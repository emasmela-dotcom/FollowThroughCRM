-- Run once in Neon SQL Editor if dashboard fails with: column p.request_changes does not exist
-- (Production DB was created before these columns were added to initDb.)

ALTER TABLE promises ADD COLUMN IF NOT EXISTS compensation TEXT;
ALTER TABLE promises ADD COLUMN IF NOT EXISTS agreed_at TIMESTAMPTZ;
ALTER TABLE promises ADD COLUMN IF NOT EXISTS completed_at TIMESTAMPTZ;
ALTER TABLE promises ADD COLUMN IF NOT EXISTS short_id VARCHAR(10);
ALTER TABLE promises ADD COLUMN IF NOT EXISTS request_changes TEXT;
ALTER TABLE promises ADD COLUMN IF NOT EXISTS last_reminder_sent TIMESTAMPTZ;
ALTER TABLE promises ADD COLUMN IF NOT EXISTS other_party_email VARCHAR(255);
ALTER TABLE promises ADD COLUMN IF NOT EXISTS other_party_name VARCHAR(255);
ALTER TABLE promises ADD COLUMN IF NOT EXISTS stripe_link TEXT;
ALTER TABLE promises ADD COLUMN IF NOT EXISTS paypal_link TEXT;
ALTER TABLE promises ADD COLUMN IF NOT EXISTS cash_app_tag TEXT;
ALTER TABLE promises ADD COLUMN IF NOT EXISTS venmo_user TEXT;
ALTER TABLE promises ADD COLUMN IF NOT EXISTS zelle_contact TEXT;
ALTER TABLE promises ADD COLUMN IF NOT EXISTS bank_notes TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS idx_promises_short_id ON promises (short_id);

CREATE TABLE IF NOT EXISTS agreement_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  promise_id UUID NOT NULL REFERENCES promises(id) ON DELETE CASCADE,
  action VARCHAR(50) NOT NULL,
  performed_by UUID REFERENCES users(id),
  performed_by_email VARCHAR(255),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_agreement_history_promise ON agreement_history (promise_id);
