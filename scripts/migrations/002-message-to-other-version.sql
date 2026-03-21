-- Message shown to the other party on the public agreement page and in send-link email.
-- Run in Neon SQL Editor if initDb has not been applied to this database.

ALTER TABLE promises ADD COLUMN IF NOT EXISTS message_to_other TEXT;
ALTER TABLE promises ADD COLUMN IF NOT EXISTS version INTEGER NOT NULL DEFAULT 1;
