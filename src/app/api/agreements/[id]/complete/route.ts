import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { sql } from "@/lib/db";
import { authOptions } from "@/lib/auth";

type Params = { params: Promise<{ id: string }> };

// POST: Creator marks agreement as complete
export async function POST(request: NextRequest, { params }: Params) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json().catch(() => ({}));
    const notes = (body.notes as string) ?? "Marked as complete";

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

    if (data.status !== "agreed") {
      return NextResponse.json(
        { error: "Agreement must be agreed before marking complete" },
        { status: 400 }
      );
    }

    const updated = await sql`
      UPDATE promises
      SET status = 'done', completed_at = NOW(), updated_at = NOW()
      WHERE id = ${data.id}
      RETURNING id, status, completed_at, title, due_at
    `;
    const agreement = (updated[0] as Record<string, unknown>) ?? null;

    await sql`
      INSERT INTO agreement_history (promise_id, action, performed_by, performed_by_email, notes)
      VALUES (${data.id}, 'completed', ${session.user.id}, ${session.user.email ?? null}, ${notes})
    `;

    return NextResponse.json({ success: true, agreement });
  } catch (error) {
    console.error("Error completing agreement:", error);
    return NextResponse.json(
      { error: "Failed to complete agreement" },
      { status: 500 }
    );
  }
}
