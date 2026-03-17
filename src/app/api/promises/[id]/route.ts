import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { sql } from "@/lib/db";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const uid = session.user.id;
  const body = await req.json();
  const {
    title,
    direction,
    status: newStatus,
    person_id,
    due_at,
    notes,
    compensation,
    stripe_link,
    paypal_link,
    cash_app_tag,
    venmo_user,
    zelle_contact,
    bank_notes,
  } = body;
  if (title !== undefined) await sql`UPDATE promises SET title = ${String(title).trim()}, updated_at = NOW() WHERE id = ${id} AND user_id = ${uid}`;
  if (direction !== undefined) await sql`UPDATE promises SET direction = ${direction === "they_owe" ? "they_owe" : "i_owe"}, updated_at = NOW() WHERE id = ${id} AND user_id = ${uid}`;
  if (newStatus !== undefined) await sql`UPDATE promises SET status = ${newStatus === "done" ? "done" : newStatus === "cancelled" ? "cancelled" : "pending"}, updated_at = NOW() WHERE id = ${id} AND user_id = ${uid}`;
  if (person_id !== undefined) await sql`UPDATE promises SET person_id = ${person_id || null}, updated_at = NOW() WHERE id = ${id} AND user_id = ${uid}`;
  if (due_at !== undefined) await sql`UPDATE promises SET due_at = ${due_at || null}, updated_at = NOW() WHERE id = ${id} AND user_id = ${uid}`;
  if (notes !== undefined) await sql`UPDATE promises SET notes = ${String(notes).trim() ?? null}, updated_at = NOW() WHERE id = ${id} AND user_id = ${uid}`;
  if (compensation !== undefined) await sql`UPDATE promises SET compensation = ${String(compensation).trim() || null}, updated_at = NOW() WHERE id = ${id} AND user_id = ${uid}`;
  if (stripe_link !== undefined) {
    const v = String(stripe_link).trim();
    await sql`UPDATE promises SET stripe_link = ${v || null}, updated_at = NOW() WHERE id = ${id} AND user_id = ${uid}`;
  }
  if (paypal_link !== undefined) {
    const v = String(paypal_link).trim();
    await sql`UPDATE promises SET paypal_link = ${v || null}, updated_at = NOW() WHERE id = ${id} AND user_id = ${uid}`;
  }
  if (cash_app_tag !== undefined) {
    const v = String(cash_app_tag).trim();
    await sql`UPDATE promises SET cash_app_tag = ${v || null}, updated_at = NOW() WHERE id = ${id} AND user_id = ${uid}`;
  }
  if (venmo_user !== undefined) {
    const v = String(venmo_user).trim();
    await sql`UPDATE promises SET venmo_user = ${v || null}, updated_at = NOW() WHERE id = ${id} AND user_id = ${uid}`;
  }
  if (zelle_contact !== undefined) {
    const v = String(zelle_contact).trim();
    await sql`UPDATE promises SET zelle_contact = ${v || null}, updated_at = NOW() WHERE id = ${id} AND user_id = ${uid}`;
  }
  if (bank_notes !== undefined) {
    const v = String(bank_notes).trim();
    await sql`UPDATE promises SET bank_notes = ${v || null}, updated_at = NOW() WHERE id = ${id} AND user_id = ${uid}`;
  }
  const [row] = await sql`
    SELECT p.id, p.title, p.direction, p.status, p.due_at, p.notes, p.person_id, p.created_at,
           p.stripe_link, p.paypal_link, p.cash_app_tag, p.venmo_user, p.zelle_contact, p.bank_notes,
           per.name AS person_name, per.email AS person_email
    FROM promises p
    LEFT JOIN people per ON per.id = p.person_id
    WHERE p.id = ${id} AND p.user_id = ${uid}
  `;
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
  const r = await sql`DELETE FROM promises WHERE id = ${id} AND user_id = ${session.user.id} RETURNING id`;
  if (!r.length) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ ok: true });
}
