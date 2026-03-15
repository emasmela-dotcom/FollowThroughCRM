import { neon } from "@neondatabase/serverless";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error(
    "DATABASE_URL is not set. Create .env.local (or add in Vercel: Settings → Environment Variables) with DATABASE_URL=your-neon-connection-string."
  );
}
const sql = neon(connectionString);

export { sql };

export async function initDb() {
  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS people (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      name TEXT NOT NULL,
      email TEXT,
      notes TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS promises (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      person_id UUID REFERENCES people(id) ON DELETE SET NULL,
      title TEXT NOT NULL,
      direction TEXT NOT NULL CHECK (direction IN ('i_owe', 'they_owe')),
      status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'agreed', 'done', 'cancelled')),
      due_at DATE,
      notes TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS reminder_sent (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      promise_id UUID NOT NULL REFERENCES promises(id) ON DELETE CASCADE,
      sent_at TIMESTAMPTZ DEFAULT NOW(),
      UNIQUE(promise_id)
    )
  `;
  // Add notes column if table existed from an older schema
  await sql`
    DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'promises' AND column_name = 'notes') THEN
        ALTER TABLE promises ADD COLUMN notes TEXT;
      END IF;
    END $$
  `;
  // Add people contact columns if missing
  await sql`
    ALTER TABLE people ADD COLUMN IF NOT EXISTS phone TEXT;
  `;
  await sql`
    ALTER TABLE people ADD COLUMN IF NOT EXISTS address TEXT;
  `;
}
