import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { sql } from "@/lib/db";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status") ?? "open";
  const uid = session.user.id;
  const rows = await sql`
    SELECT p.id, p.title, p.direction, p.status, p.due_at, p.notes, p.created_at,
           per.id AS person_id, per.name AS person_name, per.email AS person_email
    FROM promises p
    LEFT JOIN people per ON per.id = p.person_id
    WHERE p.user_id = ${uid}
    AND p.status = ${status === "done" ? "done" : status === "cancelled" ? "cancelled" : "open"}
    ORDER BY p.due_at ASC NULLS LAST, p.created_at DESC
  `;
  return NextResponse.json(rows);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const { title, direction, person_id, due_at, notes } = body;
  if (!title?.trim()) return NextResponse.json({ error: "Title required" }, { status: 400 });
  const dir = direction === "they_owe" ? "they_owe" : "i_owe";
  const [row] = await sql`
    INSERT INTO promises (user_id, title, direction, person_id, due_at, notes)
    VALUES (${session.user.id}, ${String(title).trim()}, ${dir}, ${person_id || null}, ${due_at || null}, ${notes?.trim() ?? null})
    RETURNING id, title, direction, status, due_at, notes, person_id, created_at
  `;
  return NextResponse.json(row);
}
