import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { getSession } from "@/lib/auth";

type Params = { params: Promise<{ id: string }> };

// POST: Creator cancels agreement
export async function POST(request: NextRequest, { params }: Params) {
  try {
    const session = await getSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json().catch(() => ({}));
    const reason = (body.reason as string) ?? "Agreement cancelled by creator";

    const rows = await sql`
      SELECT id, status FROM promises
      WHERE (id::text = ${id} OR short_id = ${id})
        AND user_id = ${session.user.id}
      LIMIT 1
    `;
    const data = rows[0] as { id: string; status: string } | undefined;

    if (!data) {
      return NextResponse.json(
        { error: "Agreement not found or unauthorized" },
        { status: 404 }
      );
    }

    if (data.status === "done" || data.status === "cancelled") {
      return NextResponse.json(
        { error: "Cannot cancel completed or already cancelled agreement" },
        { status: 400 }
      );
    }

    const updated = await sql`
      UPDATE promises
      SET status = 'cancelled', updated_at = NOW()
      WHERE id = ${data.id}
      RETURNING id, status, title
    `;
    const agreement = (updated[0] as Record<string, unknown>) ?? null;

    await sql`
      INSERT INTO agreement_history (promise_id, action, performed_by, performed_by_email, notes)
      VALUES (${data.id}, 'cancelled', ${session.user.id}, ${session.user.email ?? null}, ${reason})
    `;

    return NextResponse.json({ success: true, agreement });
  } catch (error) {
    console.error("Error cancelling agreement:", error);
    return NextResponse.json(
      { error: "Failed to cancel agreement" },
      { status: 500 }
    );
  }
}
