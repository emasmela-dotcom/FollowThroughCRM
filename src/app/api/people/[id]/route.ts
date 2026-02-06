import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { sql } from "@/lib/db";

export async function PATCH(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const body = await _req.json();
  const { name, email, notes } = body;
  const uid = session.user.id;
  if (name !== undefined) await sql`UPDATE people SET name = ${String(name).trim()} WHERE id = ${id} AND user_id = ${uid}`;
  if (email !== undefined) await sql`UPDATE people SET email = ${String(email).trim() || null} WHERE id = ${id} AND user_id = ${uid}`;
  if (notes !== undefined) await sql`UPDATE people SET notes = ${String(notes).trim() || null} WHERE id = ${id} AND user_id = ${uid}`;
  const [row] = await sql`SELECT id, name, email, notes, created_at FROM people WHERE id = ${id} AND user_id = ${uid}`;
  if (!row) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(row);
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const r = await sql`
    DELETE FROM people WHERE id = ${id} AND user_id = ${session.user.id} RETURNING id
  `;
  if (!r.length) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ ok: true });
}
