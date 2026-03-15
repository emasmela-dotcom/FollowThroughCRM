import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { sql } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    if (!email || !password || password.length < 8) {
      return NextResponse.json(
        { error: "Email and password (min 8 chars) required" },
        { status: 400 }
      );
    }
    const hash = await bcrypt.hash(password, 10);
    await sql`
      INSERT INTO users (email, password_hash) VALUES (${email}, ${hash})
    `;
    return NextResponse.json({ ok: true });
  } catch (e: unknown) {
    const isDuplicate = e && typeof e === "object" && "code" in e && (e as { code: string }).code === "23505";
    const errMsg =
      e && typeof e === "object" && "message" in e && typeof (e as { message: string }).message === "string"
        ? (e as { message: string }).message
        : e instanceof Error
          ? e.message
          : String(e);
    const msg = isDuplicate ? "Email already registered" : (process.env.NODE_ENV === "development" ? errMsg : "Registration failed");
    if (!isDuplicate && e) console.error("Register error:", e);
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
