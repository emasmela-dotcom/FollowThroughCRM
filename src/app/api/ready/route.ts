import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

/** Readiness: verifies DB connectivity + key schema (debug wrong Neon project / missed migration). */
export const dynamic = "force-dynamic";

function dbHostHint(): string | null {
  const u = process.env.DATABASE_URL;
  if (!u) return null;
  const m = u.match(/@([^/?]+)/);
  return m ? m[1] : null;
}

export async function GET() {
  try {
    await sql`SELECT 1 AS ok`;
    const [reqCol] = await sql`
      SELECT 1 AS n FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'promises' AND column_name = 'request_changes'
      LIMIT 1
    `;
    const [histTbl] = await sql`
      SELECT 1 AS n FROM information_schema.tables
      WHERE table_schema = 'public' AND table_name = 'agreement_history'
      LIMIT 1
    `;
    const [payCol] = await sql`
      SELECT 1 AS n FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'promises' AND column_name = 'payment_received_at'
      LIMIT 1
    `;
    return NextResponse.json({
      ok: true,
      db: "up",
      db_host: dbHostHint(),
      schema: {
        promises_has_request_changes: Boolean(reqCol),
        has_agreement_history: Boolean(histTbl),
        promises_has_payment_received_at: Boolean(payCol),
      },
      time: new Date().toISOString(),
    });
  } catch (e) {
    console.error("ready check failed:", e);
    return NextResponse.json(
      { ok: false, db: "down", db_host: dbHostHint(), time: new Date().toISOString() },
      { status: 503 }
    );
  }
}
