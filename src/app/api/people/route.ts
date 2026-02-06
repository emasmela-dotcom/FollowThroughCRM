import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { sql } from "@/lib/db";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const rows = await sql`
    SELECT id, name, email, notes, created_at FROM people
    WHERE user_id = ${session.user.id}
    ORDER BY name
  `;
  return NextResponse.json(rows);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { name, email, notes } = await req.json();
  if (!name?.trim()) return NextResponse.json({ error: "Name required" }, { status: 400 });
  const [row] = await sql`
    INSERT INTO people (user_id, name, email, notes)
    VALUES (${session.user.id}, ${(name as string).trim()}, ${email?.trim() ?? null}, ${notes?.trim() ?? null})
    RETURNING id, name, email, notes, created_at
  `;
  return NextResponse.json(row);
}
