-- Creator marks when they received payment (bookkeeping; not a payment processor).
ALTER TABLE promises ADD COLUMN IF NOT EXISTS payment_received_at TIMESTAMPTZ;
