import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

/** Readiness: verifies DB connectivity. */
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await sql`SELECT 1 AS ok`;
    return NextResponse.json({ ok: true, db: "up", time: new Date().toISOString() });
  } catch (e) {
    console.error("ready check failed:", e);
    return NextResponse.json(
      { ok: false, db: "down", time: new Date().toISOString() },
      { status: 503 }
    );
  }
}
