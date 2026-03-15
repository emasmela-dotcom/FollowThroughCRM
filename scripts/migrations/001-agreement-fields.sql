-- Follow Thru CRM - Agreement System Migration
-- Run in Neon SQL Editor or: psql $DATABASE_URL -f scripts/migrations/001-agreement-fields.sql

-- Step 1: Add new columns to promises table
ALTER TABLE promises 
ADD COLUMN IF NOT EXISTS compensation TEXT,
ADD COLUMN IF NOT EXISTS agreed_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS completed_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS short_id VARCHAR(10) UNIQUE,
ADD COLUMN IF NOT EXISTS request_changes TEXT,
ADD COLUMN IF NOT EXISTS last_reminder_sent TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS other_party_email VARCHAR(255),
ADD COLUMN IF NOT EXISTS other_party_name VARCHAR(255);

-- Step 2: Map existing 'open' to 'pending' before changing constraint
UPDATE promises SET status = 'pending' WHERE status = 'open' OR status IS NULL;

-- Drop existing status constraint if exists
ALTER TABLE promises DROP CONSTRAINT IF EXISTS promises_status_check;

-- Add new status constraint
ALTER TABLE promises 
ADD CONSTRAINT promises_status_check 
CHECK (status IN ('pending', 'agreed', 'done', 'cancelled'));

-- Step 3: Create index for short_id lookups
CREATE INDEX IF NOT EXISTS idx_promises_short_id ON promises(short_id);
CREATE INDEX IF NOT EXISTS idx_promises_status ON promises(status);

-- Step 4: Function to generate short_id
CREATE OR REPLACE FUNCTION generate_short_id()
RETURNS VARCHAR(10) AS $$
DECLARE
    chars TEXT := 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    result VARCHAR(10) := '';
    i INTEGER;
BEGIN
    FOR i IN 1..8 LOOP
        result := result || substr(chars, floor(random() * length(chars) + 1)::int, 1);
    END LOOP;
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Step 5: Trigger to set short_id on insert (only if null)
CREATE OR REPLACE FUNCTION set_short_id()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.short_id IS NULL OR NEW.short_id = '' THEN
        LOOP
            NEW.short_id := generate_short_id();
            IF NOT EXISTS (SELECT 1 FROM promises WHERE short_id = NEW.short_id) THEN
                EXIT;
            END IF;
        END LOOP;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_set_short_id ON promises;
CREATE TRIGGER trigger_set_short_id
    BEFORE INSERT ON promises
    FOR EACH ROW
    EXECUTE FUNCTION set_short_id();

-- Step 6: Agreement history table (use gen_random_uuid - built in)
CREATE TABLE IF NOT EXISTS agreement_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    promise_id UUID NOT NULL REFERENCES promises(id) ON DELETE CASCADE,
    action VARCHAR(50) NOT NULL,
    performed_by UUID REFERENCES users(id),
    performed_by_email VARCHAR(255),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_agreement_history_promise ON agreement_history(promise_id);

-- Note: Existing promises will have short_id = NULL. New inserts get short_id via trigger.
-- To backfill old rows with unique short_ids, run a one-off script that generates and sets them one by one.
