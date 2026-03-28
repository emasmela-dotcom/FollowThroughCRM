import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { sql } from "@/lib/db";

export async function GET() {
  const session = await getSession();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const rows = await sql`
    SELECT id, name, email, phone, address, company, job_title, preferred_contact, website, category, notes, created_at FROM people
    WHERE user_id = ${session.user.id}
    ORDER BY name
  `;
  return NextResponse.json(rows);
}

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { name, email, phone, address, company, job_title, preferred_contact, website, category, notes } = await req.json();
    if (!name?.trim()) return NextResponse.json({ error: "Name required" }, { status: 400 });
    const rows = await sql`
      INSERT INTO people (user_id, name, email, phone, address, company, job_title, preferred_contact, website, category, notes)
      VALUES (${session.user.id}, ${(name as string).trim()}, ${email?.trim() ?? null}, ${phone?.trim() ?? null}, ${address?.trim() ?? null}, ${company?.trim() ?? null}, ${job_title?.trim() ?? null}, ${preferred_contact ?? null}, ${website?.trim() ?? null}, ${category ?? null}, ${notes?.trim() ?? null})
      RETURNING id, name, email, phone, address, company, job_title, preferred_contact, website, category, notes, created_at
    `;
    const row = rows[0];
    return NextResponse.json(row);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("POST /api/people error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
