import { NextResponse } from "next/server";
import { createHash } from "crypto";
import bcrypt from "bcryptjs";
import { sql } from "@/lib/db";

export async function POST(req: Request) {
  let token = "";
  let password = "";
  try {
    const body = await req.json();
    token = typeof body.token === "string" ? body.token.trim() : "";
    password = typeof body.password === "string" ? body.password : "";
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  if (!token || password.length < 8) {
    return NextResponse.json(
      { error: "A valid reset link and a new password (at least 8 characters) are required." },
      { status: 400 }
    );
  }

  const tokenHash = createHash("sha256").update(token).digest("hex");
  const rows = await sql`
    SELECT id, user_id FROM password_reset_tokens
    WHERE token_hash = ${tokenHash}
      AND used_at IS NULL
      AND expires_at > NOW()
    LIMIT 1
  `;

  if (!rows.length) {
    return NextResponse.json(
      { error: "This reset link is invalid or has expired. Request a new one from the sign-in page." },
      { status: 400 }
    );
  }

  const row = rows[0] as { id: string; user_id: string };
  const passwordHash = await bcrypt.hash(password, 10);

  await sql.begin(async (s) => {
    await s`UPDATE users SET password_hash = ${passwordHash} WHERE id = ${row.user_id}`;
    await s`UPDATE password_reset_tokens SET used_at = NOW() WHERE user_id = ${row.user_id} AND used_at IS NULL`;
  });

  return NextResponse.json({ ok: true });
}
