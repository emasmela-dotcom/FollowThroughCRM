import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

type Params = { params: Promise<{ id: string }> };

// POST: Other party agrees to agreement (no auth required)
export async function POST(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const body = await request.json().catch(() => ({}));
    const email = body.email as string | undefined;
    const name = body.name as string | undefined;
    const notes = body.notes as string | undefined;

    const rows = await sql`
      SELECT id, status, other_party_email, short_id, title
      FROM promises
      WHERE short_id = ${id} OR id::text = ${id}
      LIMIT 1
    `;
    const data = rows[0] as { id: string; status: string; other_party_email: string | null; short_id: string | null; title: string } | undefined;

    if (!data) {
      return NextResponse.json({ error: "Agreement not found" }, { status: 404 });
    }

    if (data.status !== "pending") {
      return NextResponse.json(
        { error: `Agreement already ${data.status}` },
        { status: 400 }
      );
    }

    if (email && data.other_party_email && data.other_party_email !== email) {
      return NextResponse.json(
        { error: "Email does not match agreement recipient" },
        { status: 403 }
      );
    }

    const updated = await sql`
      UPDATE promises
      SET
        status = 'agreed',
        agreed_at = NOW(),
        other_party_name = COALESCE(${name ?? null}, other_party_name),
        other_party_email = COALESCE(${email ?? null}, other_party_email),
        updated_at = NOW()
      WHERE id = ${data.id}
      RETURNING id, status, agreed_at, title, due_at, compensation, other_party_email
    `;
    const agreement = (updated[0] as Record<string, unknown>) ?? null;
    const toEmail = (agreement?.other_party_email as string) || email;

    await sql`
      INSERT INTO agreement_history (promise_id, action, performed_by_email, notes)
      VALUES (
        ${data.id},
        'agreed',
        ${email ?? name ?? "anonymous"},
        ${notes ?? "Agreement accepted via public link"}
      )
    `;

    // Send confirmation email to the other party (proof + receipt). Fire-and-forget.
    if (resend && toEmail && typeof data.title === "string") {
      resend.emails.send({
        from: "Follow Thru CRM <onboarding@resend.dev>",
        to: [toEmail],
        subject: `You confirmed: ${data.title}`,
        text: `You confirmed the agreement "${data.title}". The creator will follow up with next steps.\n\n— Follow Thru CRM`,
      }).catch(() => {});
    }

    return NextResponse.json({ success: true, agreement });
  } catch (error) {
    console.error("Error agreeing to agreement:", error);
    return NextResponse.json(
      { error: "Failed to process agreement" },
      { status: 500 }
    );
  }
}
