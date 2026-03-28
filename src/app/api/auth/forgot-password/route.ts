import { NextResponse } from "next/server";
import { createHash, randomBytes } from "crypto";
import { Resend } from "resend";
import { sql } from "@/lib/db";

function appOrigin(req: Request): string {
  const host = req.headers.get("x-forwarded-host");
  const proto = req.headers.get("x-forwarded-proto") || "https";
  if (host) return `${proto}://${host}`;
  const base = process.env.NEXTAUTH_URL?.replace(/\/$/, "");
  if (base) return base;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return new URL(req.url).origin;
}

export async function POST(req: Request) {
  let email = "";
  try {
    const body = await req.json();
    email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  if (!email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  try {
    const users = await sql`
    SELECT id, email FROM users WHERE lower(trim(email)) = ${email} LIMIT 1
  `;

    if (users.length > 0) {
      const user = users[0] as { id: string; email: string };
      const rawToken = randomBytes(32).toString("hex");
      const tokenHash = createHash("sha256").update(rawToken).digest("hex");
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

      await sql`
      INSERT INTO password_reset_tokens (user_id, token_hash, expires_at)
      VALUES (${user.id}, ${tokenHash}, ${expiresAt.toISOString()})
    `;

      const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
      if (resend) {
        const origin = appOrigin(req);
        const resetUrl = `${origin}/reset-password?token=${encodeURIComponent(rawToken)}`;
        const from = process.env.AUTH_EMAIL_FROM?.trim() || "Follow Thru CRM <onboarding@resend.dev>";
        try {
          await resend.emails.send({
            from,
            to: [user.email],
            subject: "Reset your Follow Thru CRM password",
            text: `You asked to reset your password.\n\nOpen this link (valid for one hour):\n${resetUrl}\n\nIf you did not request this, you can ignore this email.\n\n— Follow Thru CRM`,
          });
        } catch (e) {
          console.error("Forgot password: email send failed:", e);
        }
      } else {
        console.warn("Forgot password: RESEND_API_KEY is not set; no email sent.");
      }
    }

    return NextResponse.json({
      ok: true,
      message:
        "If an account exists for that email, you will receive a link to reset your password. Check your inbox and spam folder.",
    });
  } catch (e) {
    console.error("[forgot-password]", e);
    return NextResponse.json(
      {
        error:
          "Password reset is not available right now. Ask your admin to run the database migration for password reset (table password_reset_tokens), or use npm run reset-password locally with production DATABASE_URL.",
      },
      { status: 500 }
    );
  }
}
