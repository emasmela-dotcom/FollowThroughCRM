/**
 * Reset a user's password in the database (no email, no Resend usage).
 * Run from repo root with .env.local containing DATABASE_URL.
 *
 * Terminal: npm run reset-password -- you@email.com YourNewPass8+
 */
require("dotenv").config({ path: ".env.local" });
require("dotenv").config({ path: ".env" });

import bcrypt from "bcryptjs";
import { sql } from "../src/lib/db";

async function main() {
  const email = process.argv[2]?.trim().toLowerCase();
  const password = process.argv[3];
  if (!email || !password) {
    console.error("Usage: npm run reset-password -- <email> <new-password>");
    process.exit(1);
  }
  if (password.length < 8) {
    console.error("Password must be at least 8 characters.");
    process.exit(1);
  }
  const rows = await sql<{ id: string }[]>`
    SELECT id FROM users WHERE lower(trim(email)) = ${email} LIMIT 1
  `;
  if (!rows.length) {
    console.error("No user found with that email.");
    process.exit(1);
  }
  const hash = await bcrypt.hash(password, 10);
  await sql`UPDATE users SET password_hash = ${hash} WHERE id = ${rows[0].id}`;
  console.log("Password updated for:", email);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
