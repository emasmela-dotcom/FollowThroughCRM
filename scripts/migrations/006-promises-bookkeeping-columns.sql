-- Dashboard uses payment_received_at (unpaid “they owe” banner). Not in 005 — run if /dashboard still 500 after 005.
-- Also safe if already applied.

ALTER TABLE promises ADD COLUMN IF NOT EXISTS payment_received_at TIMESTAMPTZ;
ALTER TABLE promises ADD COLUMN IF NOT EXISTS message_to_other TEXT;
ALTER TABLE promises ADD COLUMN IF NOT EXISTS version INTEGER NOT NULL DEFAULT 1;
