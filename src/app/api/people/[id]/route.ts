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
  const { name, email, phone, address, company, job_title, preferred_contact, website, category, notes } = body;
  const uid = session.user.id;
  if (name !== undefined) await sql`UPDATE people SET name = ${String(name).trim()} WHERE id = ${id} AND user_id = ${uid}`;
  if (email !== undefined) await sql`UPDATE people SET email = ${String(email).trim() || null} WHERE id = ${id} AND user_id = ${uid}`;
  if (phone !== undefined) await sql`UPDATE people SET phone = ${String(phone).trim() || null} WHERE id = ${id} AND user_id = ${uid}`;
  if (address !== undefined) await sql`UPDATE people SET address = ${String(address).trim() || null} WHERE id = ${id} AND user_id = ${uid}`;
  if (company !== undefined) await sql`UPDATE people SET company = ${String(company).trim() || null} WHERE id = ${id} AND user_id = ${uid}`;
  if (job_title !== undefined) await sql`UPDATE people SET job_title = ${String(job_title).trim() || null} WHERE id = ${id} AND user_id = ${uid}`;
  if (preferred_contact !== undefined) await sql`UPDATE people SET preferred_contact = ${preferred_contact || null} WHERE id = ${id} AND user_id = ${uid}`;
  if (website !== undefined) await sql`UPDATE people SET website = ${String(website).trim() || null} WHERE id = ${id} AND user_id = ${uid}`;
  if (category !== undefined) await sql`UPDATE people SET category = ${category || null} WHERE id = ${id} AND user_id = ${uid}`;
  if (notes !== undefined) await sql`UPDATE people SET notes = ${String(notes).trim() || null} WHERE id = ${id} AND user_id = ${uid}`;
  const [row] = await sql`SELECT id, name, email, phone, address, company, job_title, preferred_contact, website, category, notes, created_at FROM people WHERE id = ${id} AND user_id = ${uid}`;
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
