import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { sql } from "@/lib/db";
import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

type Params = { params: Promise<{ id: string }> };

// POST: Send agreement link to the other party's email (person must have email in People).
export async function POST(request: NextRequest, { params }: Params) {
  try {
    const session = await getSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: promiseId } = await params;
    const uid = session.user.id;

    const rows = await sql`
      SELECT p.id, p.short_id, p.title, p.other_party_email, p.message_to_other,
             per.id AS person_id, per.name AS person_name, per.email AS person_email,
             u.email AS creator_email
      FROM promises p
      LEFT JOIN people per ON per.id = p.person_id AND per.user_id = ${uid}
      LEFT JOIN users u ON u.id = p.user_id
      WHERE (p.id::text = ${promiseId} OR p.short_id = ${promiseId})
        AND p.user_id = ${uid}
      LIMIT 1
    `;
    const row = rows[0] as {
      id: string;
      short_id: string | null;
      title: string;
      other_party_email: string | null;
      message_to_other: string | null;
      person_id: string | null;
      person_name: string | null;
      person_email: string | null;
      creator_email: string | null;
    } | undefined;

    if (!row) {
      return NextResponse.json({ error: "Agreement not found" }, { status: 404 });
    }

    if (!row.short_id) {
      return NextResponse.json({ error: "Agreement has no shareable link" }, { status: 400 });
    }

    const toEmail = row.person_email?.trim() || null;
    if (!toEmail) {
      return NextResponse.json(
        { error: "Add their email in People to send the link from Follow Thru. Edit the person and save an email." },
        { status: 400 }
      );
    }

    const origin = request.headers.get("x-forwarded-host")
      ? `${request.headers.get("x-forwarded-proto") || "https"}://${request.headers.get("x-forwarded-host")}`
      : new URL(request.url).origin;
    const agreementUrl = `${origin}/agreement/${row.short_id}`;

    if (!resend) {
      return NextResponse.json(
        { error: "Email is not configured. Link ready to copy and send yourself." },
        { status: 503 }
      );
    }

    const subject = `Agreement: ${row.title}`;
    const note = row.message_to_other?.trim();
    const fromLine = row.creator_email?.trim()
      ? `A note from ${row.creator_email.trim()}:\n\n${note}\n\n`
      : note
        ? `A note from the agreement creator:\n\n${note}\n\n`
        : "";
    const text = `You're invited to review and confirm an agreement:\n\n${row.title}\n\n${note ? fromLine : ""}Open this link to view and agree:\n${agreementUrl}\n\n— Follow Thru CRM`;

    await resend.emails.send({
      from: "Follow Thru CRM <onboarding@resend.dev>",
      to: [toEmail],
      subject,
      text,
    });

    // Store recipient email on the promise so agree-endpoint can require matching email (proof both parties included).
    if (!row.other_party_email) {
      await sql`
        UPDATE promises
        SET other_party_email = ${toEmail},
            other_party_name = COALESCE(${row.person_name ?? null}, other_party_name),
            updated_at = NOW()
        WHERE id = ${row.id}
      `;
    }

    return NextResponse.json({ success: true, sentTo: toEmail });
  } catch (error) {
    console.error("Error sending agreement link:", error);
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 }
    );
  }
}
