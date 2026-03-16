import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";

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
      SELECT id, status, other_party_email, short_id
      FROM promises
      WHERE short_id = ${id} OR id::text = ${id}
      LIMIT 1
    `;
    const data = rows[0] as { id: string; status: string; other_party_email: string | null; short_id: string | null } | undefined;

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
      RETURNING id, status, agreed_at, title, due_at, compensation
    `;
    const agreement = (updated[0] as Record<string, unknown>) ?? null;

    await sql`
      INSERT INTO agreement_history (promise_id, action, performed_by_email, notes)
      VALUES (
        ${data.id},
        'agreed',
        ${email ?? name ?? "anonymous"},
        ${notes ?? "Agreement accepted via public link"}
      )
    `;

    return NextResponse.json({ success: true, agreement });
  } catch (error) {
    console.error("Error agreeing to agreement:", error);
    return NextResponse.json(
      { error: "Failed to process agreement" },
      { status: 500 }
    );
  }
}
