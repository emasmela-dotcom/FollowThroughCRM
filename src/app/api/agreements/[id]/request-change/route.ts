import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";

type Params = { params: Promise<{ id: string }> };

// POST: Other party requests changes (no auth). Body: { message?, email?, name? }
export async function POST(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const body = await request.json().catch(() => ({}));
    const message = (body.message as string) ?? (body.notes as string) ?? "Requested changes";
    const email = body.email as string | undefined;
    const name = body.name as string | undefined;

    const rows = await sql`
      SELECT id, status FROM promises
      WHERE short_id = ${id} OR id::text = ${id}
      LIMIT 1
    `;
    const data = rows[0] as { id: string; status: string } | undefined;

    if (!data) {
      return NextResponse.json({ error: "Agreement not found" }, { status: 404 });
    }

    if (data.status !== "pending") {
      return NextResponse.json(
        { error: "Only pending agreements can receive change requests" },
        { status: 400 }
      );
    }

    await sql`
      UPDATE promises
      SET request_changes = ${message}, updated_at = NOW()
      WHERE id = ${data.id}
    `;

    await sql`
      INSERT INTO agreement_history (promise_id, action, performed_by_email, notes)
      VALUES (${data.id}, 'request_change', ${email ?? name ?? "anonymous"}, ${message})
    `;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error requesting change:", error);
    return NextResponse.json(
      { error: "Failed to submit change request" },
      { status: 500 }
    );
  }
}
