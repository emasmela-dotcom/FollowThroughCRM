import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { Resend } from "resend";

// Vercel Cron calls this; protect with CRON_SECRET so only Vercel can trigger.
const CRON_SECRET = process.env.CRON_SECRET;
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null;

export const dynamic = "force-dynamic";
export const maxDuration = 60;

type OverdueRow = {
  promise_id: string;
  user_id: string;
  title: string;
  direction: string;
  due_at: string;
  person_name: string | null;
};

type UnconfirmedRow = {
  promise_id: string;
  user_id: string;
  title: string;
  created_at: string;
  person_name: string | null;
};

export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization");
  if (CRON_SECRET && authHeader !== `Bearer ${CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const today = new Date().toISOString().slice(0, 10);

  //
  // 1) OVERDUE REMINDERS (existing behavior), tagged as reminder_type = 'overdue'
  //
  // Pending promises that are due/overdue AND have NOT had an "overdue" reminder sent TODAY
  const overdueRows = (await sql`
    SELECT p.id AS promise_id, p.user_id, p.title, p.direction, p.due_at, per.name AS person_name
    FROM promises p
    LEFT JOIN people per ON per.id = p.person_id
    WHERE p.status = 'pending'
      AND p.due_at IS NOT NULL
      AND p.due_at::text <= ${today}
      AND NOT EXISTS (
        SELECT 1
        FROM reminder_sent r
        WHERE r.promise_id = p.id
          AND r.reminder_type = 'overdue'
          AND r.sent_at::date = ${today}
      )
  `) as unknown as OverdueRow[];

  // Get user emails for any user that has overdue items
  const userEmailById: Record<string, string> = {};
  const overdueUserIds = Array.from(new Set(overdueRows.map((r) => r.user_id as string)));
  if (overdueUserIds.length > 0) {
    const users = await sql`
      SELECT id, email FROM users WHERE id = ANY(${overdueUserIds})
    `;
    for (const u of users as unknown as { id: string; email: string }[]) {
      userEmailById[u.id] = u.email;
    }
  }

  let sent = 0;

  // Group overdue rows by user and send one email per user (digest)
  const overdueByUser = new Map<string, OverdueRow[]>();
  for (const r of overdueRows) {
    const uid = r.user_id as string;
    if (!overdueByUser.has(uid)) overdueByUser.set(uid, []);
    overdueByUser.get(uid)!.push(r);
  }

  for (const [userId, promises] of Array.from(overdueByUser.entries())) {
    const to = userEmailById[userId];
    if (!to) continue;
    if (!resend) continue; // No API key = no cost, no send

    const lines = (
      promises as {
        title: string;
        direction: string;
        due_at: string;
        person_name: string | null;
      }[]
    ).map(
      (p) =>
        `- ${p.title}${
          p.person_name ? ` (${p.person_name})` : ""
        } — due ${String(p.due_at).slice(0, 10)}`
    );
    const body = `You have ${
      promises.length
    } item(s) due or overdue:\n\n${lines.join(
      "\n"
    )}\n\nView your Waiting On dashboard to update or mark done.`;

    try {
      await resend.emails.send({
        from: "Follow-Through CRM <onboarding@resend.dev>",
        to: [to],
        subject: `Follow-Through CRM: ${promises.length} item(s) due or overdue`,
        text: body,
      });
      sent++;
    } catch {
      // ignore errors per-user, keep going
    }
  }

  // Log an "overdue" reminder for each promise for TODAY (so we don't send more than once per day)
  for (const p of overdueRows as { promise_id: string }[]) {
    await sql`
      INSERT INTO reminder_sent (promise_id, reminder_type)
      VALUES (${p.promise_id}, 'overdue')
      ON CONFLICT DO NOTHING
    `;
  }

  //
  // 2) UNCONFIRMED REMINDERS (new behavior), reminder_type = 'unconfirmed'
  //
  // Pending promises that have not been agreed to within 3+ days of creation,
  // and have NOT had an "unconfirmed" reminder sent TODAY.
  const unconfirmedRowsRaw = await sql`
    SELECT p.id AS promise_id, p.user_id, p.title, p.created_at, per.name AS person_name
    FROM promises p
    LEFT JOIN people per ON per.id = p.person_id
    WHERE p.status = 'pending'
      AND p.agreed_at IS NULL
      AND p.created_at <= NOW() - INTERVAL '3 days'
      AND NOT EXISTS (
        SELECT 1
        FROM reminder_sent r
        WHERE r.promise_id = p.id
          AND r.reminder_type = 'unconfirmed'
          AND r.sent_at::date = ${today}
      )
  `;
  const unconfirmedRows = unconfirmedRowsRaw as unknown as UnconfirmedRow[];

  const unconfirmedUserIds = Array.from(new Set(unconfirmedRows.map((r) => r.user_id as string)));
  if (unconfirmedUserIds.length > 0) {
    const unconfirmedUsers = await sql`
      SELECT id, email FROM users WHERE id = ANY(${unconfirmedUserIds})
    `;
    for (const u of unconfirmedUsers as unknown as { id: string; email: string }[]) {
      userEmailById[u.id] = u.email;
    }
  }

  const unconfirmedByUser = new Map<string, UnconfirmedRow[]>();
  for (const r of unconfirmedRows) {
    const uid = r.user_id as string;
    if (!unconfirmedByUser.has(uid)) unconfirmedByUser.set(uid, []);
    unconfirmedByUser.get(uid)!.push(r);
  }

  for (const [userId, promises] of Array.from(unconfirmedByUser.entries())) {
    const to = userEmailById[userId];
    if (!to) continue;
    if (!resend) continue;

    const lines = (
      promises as {
        title: string;
        created_at: string;
        person_name: string | null;
      }[]
    ).map((p) => {
      const createdDate = String(p.created_at).slice(0, 10);
      return `- ${p.title}${p.person_name ? ` (${p.person_name})` : ""} — sent ${createdDate}, still unconfirmed`;
    });

    const body = `You have ${
      promises.length
    } agreement(s) that were sent 3+ days ago and are still not confirmed:\n\n${lines.join(
      "\n"
    )}\n\nVisit your Waiting On dashboard to copy the links and follow up.`;

    try {
      await resend.emails.send({
        from: "Follow-Through CRM <onboarding@resend.dev>",
        to: [to],
        subject: `Follow-Through CRM: ${promises.length} agreement(s) still waiting for confirmation`,
        text: body,
      });
      sent++;
    } catch {
      // ignore errors per-user, keep going
    }
  }

  // Log an "unconfirmed" reminder for each promise for TODAY
  for (const p of unconfirmedRows as { promise_id: string }[]) {
    await sql`
      INSERT INTO reminder_sent (promise_id, reminder_type)
      VALUES (${p.promise_id}, 'unconfirmed')
      ON CONFLICT DO NOTHING
    `;
  }

  return NextResponse.json({ ok: true, sent });
}