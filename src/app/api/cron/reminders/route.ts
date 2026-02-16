import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { Resend } from "resend";

// Vercel Cron calls this; protect with CRON_SECRET so only Vercel can trigger.
const CRON_SECRET = process.env.CRON_SECRET;
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null;

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization");
  if (CRON_SECRET && authHeader !== `Bearer ${CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const today = new Date().toISOString().slice(0, 10);
  // Open promises that are due (or overdue) and haven't had a reminder sent
  const rows = await sql`
    SELECT p.id AS promise_id, p.user_id, p.title, p.direction, p.due_at, per.name AS person_name
    FROM promises p
    LEFT JOIN people per ON per.id = p.person_id
    WHERE p.status = 'open'
      AND p.due_at IS NOT NULL
      AND p.due_at::text <= ${today}
      AND NOT EXISTS (SELECT 1 FROM reminder_sent r WHERE r.promise_id = p.id)
  `;

  if (rows.length === 0) {
    return NextResponse.json({ ok: true, sent: 0 });
  }

  // Get user emails
  const userIds = Array.from(new Set(rows.map((r) => r.user_id))];
  const users = await sql`
    SELECT id, email FROM users WHERE id = ANY(${userIds})
  `;
  const userEmailById = Object.fromEntries((users as { id: string; email: string }[]).map((u) => [u.id, u.email]));

  // Group by user and send one email per user (digest)
  const byUser = new Map<string, typeof rows>();
  for (const r of rows) {
    const uid = r.user_id as string;
    if (!byUser.has(uid)) byUser.set(uid, []);
    byUser.get(uid)!.push(r);
  }

  let sent = 0;
  for (const [userId, promises] of byUser) {
    const to = userEmailById[userId];
    if (!to) continue;
    if (!resend) continue; // No API key = no cost, no send

    const lines = (promises as { title: string; direction: string; due_at: string; person_name: string | null }[]).map(
      (p) => `- ${p.title}${p.person_name ? ` (${p.person_name})` : ""} — due ${String(p.due_at).slice(0, 10)}`
    );
    const body = `You have ${promises.length} item(s) due or overdue:\n\n${lines.join("\n")}\n\nView your Waiting On dashboard to update or mark done.`;

    try {
      await resend.emails.send({
        from: "Follow-Through CRM <onboarding@resend.dev>",
        to: [to],
        subject: `Follow-Through CRM: ${promises.length} item(s) due or overdue`,
        text: body,
      });
      sent++;
    } catch (_e) {
      // Log but don't fail the whole cron
    }

    for (const p of promises) {
      await sql`INSERT INTO reminder_sent (promise_id) VALUES (${(p as { promise_id: string }).promise_id}) ON CONFLICT (promise_id) DO NOTHING`;
    }
  }

  return NextResponse.json({ ok: true, sent });
}
