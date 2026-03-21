import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { sql } from "@/lib/db";
import { normalizeOptionalText } from "@/lib/normalizeOptionalText";

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
    message_to_other,
    payment_received,
  } = body;
  const isRevisionEdit =
    title !== undefined ||
    direction !== undefined ||
    person_id !== undefined ||
    due_at !== undefined ||
    notes !== undefined ||
    compensation !== undefined ||
    stripe_link !== undefined ||
    paypal_link !== undefined ||
    cash_app_tag !== undefined ||
    venmo_user !== undefined ||
    zelle_contact !== undefined ||
    bank_notes !== undefined ||
    message_to_other !== undefined;
  if (title !== undefined) await sql`UPDATE promises SET title = ${String(title).trim()}, updated_at = NOW() WHERE id = ${id} AND user_id = ${uid}`;
  if (direction !== undefined) await sql`UPDATE promises SET direction = ${direction === "they_owe" ? "they_owe" : "i_owe"}, updated_at = NOW() WHERE id = ${id} AND user_id = ${uid}`;
  if (newStatus !== undefined) await sql`UPDATE promises SET status = ${newStatus === "done" ? "done" : newStatus === "cancelled" ? "cancelled" : "pending"}, updated_at = NOW() WHERE id = ${id} AND user_id = ${uid}`;
  if (person_id !== undefined) await sql`UPDATE promises SET person_id = ${person_id || null}, updated_at = NOW() WHERE id = ${id} AND user_id = ${uid}`;
  if (due_at !== undefined) await sql`UPDATE promises SET due_at = ${due_at || null}, updated_at = NOW() WHERE id = ${id} AND user_id = ${uid}`;
  if (notes !== undefined) {
    const v = normalizeOptionalText(notes);
    await sql`UPDATE promises SET notes = ${v}, updated_at = NOW() WHERE id = ${id} AND user_id = ${uid}`;
  }
  if (compensation !== undefined) {
    const v = normalizeOptionalText(compensation);
    await sql`UPDATE promises SET compensation = ${v}, updated_at = NOW() WHERE id = ${id} AND user_id = ${uid}`;
  }
  if (stripe_link !== undefined) {
    const v = normalizeOptionalText(stripe_link);
    await sql`UPDATE promises SET stripe_link = ${v}, updated_at = NOW() WHERE id = ${id} AND user_id = ${uid}`;
  }
  if (paypal_link !== undefined) {
    const v = normalizeOptionalText(paypal_link);
    await sql`UPDATE promises SET paypal_link = ${v}, updated_at = NOW() WHERE id = ${id} AND user_id = ${uid}`;
  }
  if (cash_app_tag !== undefined) {
    const v = normalizeOptionalText(cash_app_tag);
    await sql`UPDATE promises SET cash_app_tag = ${v}, updated_at = NOW() WHERE id = ${id} AND user_id = ${uid}`;
  }
  if (venmo_user !== undefined) {
    const v = normalizeOptionalText(venmo_user);
    await sql`UPDATE promises SET venmo_user = ${v}, updated_at = NOW() WHERE id = ${id} AND user_id = ${uid}`;
  }
  if (zelle_contact !== undefined) {
    const v = normalizeOptionalText(zelle_contact);
    await sql`UPDATE promises SET zelle_contact = ${v}, updated_at = NOW() WHERE id = ${id} AND user_id = ${uid}`;
  }
  if (bank_notes !== undefined) {
    const v = normalizeOptionalText(bank_notes);
    await sql`UPDATE promises SET bank_notes = ${v}, updated_at = NOW() WHERE id = ${id} AND user_id = ${uid}`;
  }
  if (message_to_other !== undefined) {
    const v = normalizeOptionalText(message_to_other);
    await sql`UPDATE promises SET message_to_other = ${v}, updated_at = NOW() WHERE id = ${id} AND user_id = ${uid}`;
  }
  if (payment_received !== undefined) {
    if (payment_received === true) {
      await sql`
        UPDATE promises
        SET payment_received_at = NOW(), updated_at = NOW()
        WHERE id = ${id} AND user_id = ${uid}
      `;
    } else {
      await sql`
        UPDATE promises SET payment_received_at = NULL, updated_at = NOW() WHERE id = ${id} AND user_id = ${uid}
      `;
    }
  }
  let revisedVersion: number | null = null;
  if (isRevisionEdit) {
    // Any creator edit creates a new revision and clears prior change-request text.
    const revisionRows = await sql`
      UPDATE promises
      SET version = COALESCE(version, 1) + 1,
          request_changes = NULL,
          updated_at = NOW()
      WHERE id = ${id} AND user_id = ${uid}
      RETURNING version
    `;
    revisedVersion = (revisionRows[0] as { version?: number } | undefined)?.version ?? null;
    await sql`
      INSERT INTO agreement_history (promise_id, action, performed_by, performed_by_email, notes)
      VALUES (
        ${id},
        'revise',
        ${uid},
        ${session.user.email ?? null},
        ${revisedVersion ? `Creator updated agreement to v${revisedVersion}` : "Creator updated agreement"}
      )
    `;
  }
  const [row] = await sql`
    SELECT p.id, p.title, p.direction, p.status, p.due_at, p.notes, p.request_changes, p.version, p.message_to_other, p.person_id, p.created_at,
           p.completed_at, p.payment_received_at,
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
