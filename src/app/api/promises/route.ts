import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { sql } from "@/lib/db";

export async function GET(req: Request) {
  const session = await getSession();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status") ?? "pending";
  const uid = session.user.id;
  const rows = await sql`
    SELECT p.id, p.title, p.direction, p.status, p.due_at, p.notes, p.message_to_other, p.created_at,
           per.id AS person_id, per.name AS person_name, per.email AS person_email
    FROM promises p
    LEFT JOIN people per ON per.id = p.person_id
    WHERE p.user_id = ${uid}
    AND p.status = ${status === "done" ? "done" : status === "cancelled" ? "cancelled" : "pending"}
    ORDER BY p.due_at ASC NULLS LAST, p.created_at DESC
  `;
  return NextResponse.json(rows);
}

export async function POST(req: Request) {
  const session = await getSession();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const { title, direction, person_id, due_at, notes, compensation, message_to_other } = body;
  if (!title?.trim()) return NextResponse.json({ error: "Title required" }, { status: 400 });
  const dir = direction === "they_owe" ? "they_owe" : "i_owe";
  const msgOther =
    typeof message_to_other === "string" && message_to_other.trim()
      ? message_to_other.trim()
      : null;
  const [row] = await sql`
    INSERT INTO promises (user_id, title, direction, person_id, due_at, notes, compensation, message_to_other)
    VALUES (${session.user.id}, ${String(title).trim()}, ${dir}, ${person_id || null}, ${due_at || null}, ${notes?.trim() ?? null}, ${compensation?.trim() ?? null}, ${msgOther})
    RETURNING id, title, direction, status, due_at, notes, message_to_other, person_id, created_at
  `;
  return NextResponse.json(row);
}
