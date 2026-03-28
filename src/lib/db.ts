import postgres from "postgres";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error(
    "DATABASE_URL is not set. Create .env.local (or add in Vercel: Settings → Environment Variables) with DATABASE_URL=your-neon-connection-string."
  );
}

/**
 * TCP Postgres driver (postgres.js). Uses the host in DATABASE_URL (e.g. ep-…-pooler…neon.tech).
 * Neon's `neon()` HTTP driver can fail locally with DNS (ENOTFOUND api.*.neon.tech); TCP avoids that.
 */
const sql = postgres(connectionString, {
  ssl: "require",
  max: 1,
});

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
  await sql`
    ALTER TABLE people ADD COLUMN IF NOT EXISTS company TEXT;
  `;
  await sql`
    ALTER TABLE people ADD COLUMN IF NOT EXISTS job_title TEXT;
  `;
  await sql`
    ALTER TABLE people ADD COLUMN IF NOT EXISTS preferred_contact TEXT;
  `;
  await sql`
    ALTER TABLE people ADD COLUMN IF NOT EXISTS website TEXT;
  `;
  await sql`
    ALTER TABLE people ADD COLUMN IF NOT EXISTS category TEXT;
  `;
  // Agreement documents (contract PDFs stored in DB to stay $0)
  await sql`
    ALTER TABLE promises ADD COLUMN IF NOT EXISTS message_to_other TEXT;
  `;
  await sql`
    ALTER TABLE promises ADD COLUMN IF NOT EXISTS version INTEGER NOT NULL DEFAULT 1;
  `;
  await sql`
    ALTER TABLE promises ADD COLUMN IF NOT EXISTS payment_received_at TIMESTAMPTZ;
  `;
  // Agreement / public link columns (see scripts/migrations/001-agreement-fields.sql)
  await sql`ALTER TABLE promises ADD COLUMN IF NOT EXISTS compensation TEXT`;
  await sql`ALTER TABLE promises ADD COLUMN IF NOT EXISTS agreed_at TIMESTAMPTZ`;
  await sql`ALTER TABLE promises ADD COLUMN IF NOT EXISTS completed_at TIMESTAMPTZ`;
  await sql`ALTER TABLE promises ADD COLUMN IF NOT EXISTS short_id VARCHAR(10)`;
  await sql`ALTER TABLE promises ADD COLUMN IF NOT EXISTS request_changes TEXT`;
  await sql`ALTER TABLE promises ADD COLUMN IF NOT EXISTS last_reminder_sent TIMESTAMPTZ`;
  await sql`ALTER TABLE promises ADD COLUMN IF NOT EXISTS other_party_email VARCHAR(255)`;
  await sql`ALTER TABLE promises ADD COLUMN IF NOT EXISTS other_party_name VARCHAR(255)`;
  // Payment link fields (dashboard / agreement page)
  await sql`ALTER TABLE promises ADD COLUMN IF NOT EXISTS stripe_link TEXT`;
  await sql`ALTER TABLE promises ADD COLUMN IF NOT EXISTS paypal_link TEXT`;
  await sql`ALTER TABLE promises ADD COLUMN IF NOT EXISTS cash_app_tag TEXT`;
  await sql`ALTER TABLE promises ADD COLUMN IF NOT EXISTS venmo_user TEXT`;
  await sql`ALTER TABLE promises ADD COLUMN IF NOT EXISTS zelle_contact TEXT`;
  await sql`ALTER TABLE promises ADD COLUMN IF NOT EXISTS bank_notes TEXT`;
  await sql`CREATE UNIQUE INDEX IF NOT EXISTS idx_promises_short_id ON promises (short_id)`;
  await sql`
    CREATE TABLE IF NOT EXISTS agreement_history (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      promise_id UUID NOT NULL REFERENCES promises(id) ON DELETE CASCADE,
      action VARCHAR(50) NOT NULL,
      performed_by UUID REFERENCES users(id),
      performed_by_email VARCHAR(255),
      notes TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;
  await sql`CREATE INDEX IF NOT EXISTS idx_agreement_history_promise ON agreement_history (promise_id)`;
  await sql`
    CREATE TABLE IF NOT EXISTS agreement_documents (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      promise_id UUID NOT NULL REFERENCES promises(id) ON DELETE CASCADE,
      file_name TEXT NOT NULL,
      content_type TEXT NOT NULL,
      file_size INTEGER NOT NULL,
      file_data TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS password_reset_tokens (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      token_hash TEXT NOT NULL,
      expires_at TIMESTAMPTZ NOT NULL,
      used_at TIMESTAMPTZ,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;
  await sql`
    CREATE INDEX IF NOT EXISTS idx_password_reset_token_hash ON password_reset_tokens (token_hash)
  `;
}
