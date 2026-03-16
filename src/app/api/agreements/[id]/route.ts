import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { sql } from "@/lib/db";
import { authOptions } from "@/lib/auth";

type Params = { params: Promise<{ id: string }> };

// GET: Fetch one agreement by id (UUID) or short_id. Owner gets full data; no auth = public fields only (short_id lookup).
export async function GET(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    const rows = await sql`
      SELECT p.id, p.short_id, p.title, p.direction, p.status, p.due_at, p.notes,
             p.compensation, p.agreed_at, p.completed_at, p.request_changes,
             p.other_party_email, p.other_party_name, p.user_id, p.person_id, p.created_at,
             per.name AS person_name, per.email AS person_email,
             u.email AS creator_email
      FROM promises p
      LEFT JOIN people per ON per.id = p.person_id
      LEFT JOIN users u ON u.id = p.user_id
      WHERE p.id::text = ${id} OR p.short_id = ${id}
      LIMIT 1
    `;
    const row = rows[0] as Record<string, unknown> | undefined;
    if (!row) {
      return NextResponse.json({ error: "Agreement not found" }, { status: 404 });
    }

    const isOwner = session?.user?.id === row.user_id;

    if (!session) {
      // Public: only allow short_id lookup, return public fields only
      if (row.short_id !== id) {
        return NextResponse.json({ error: "Agreement not found" }, { status: 404 });
      }
      return NextResponse.json({
        agreement: {
          id: row.id,
          short_id: row.short_id,
          title: row.title,
          status: row.status,
          due_at: row.due_at,
          compensation: row.compensation,
          agreed_at: row.agreed_at,
          completed_at: row.completed_at,
          request_changes: row.request_changes,
          other_party_name: row.other_party_name,
          person_name: row.person_name,
          person_email: row.person_email,
          creator_email: row.creator_email,
        },
      });
    }

    if (!isOwner) {
      return NextResponse.json({ error: "Agreement not found" }, { status: 404 });
    }

    return NextResponse.json({ agreement: row });
  } catch (error) {
    console.error("Error fetching agreement:", error);
    return NextResponse.json({ error: "Failed to fetch agreement" }, { status: 500 });
  }
}
