# Start here (when you pick the project up again)

## Database — Neon SQL Editor

If this database **doesn’t** have the agreement message + version columns yet, run **once** in the **Neon SQL Editor**:

```sql
ALTER TABLE promises ADD COLUMN IF NOT EXISTS message_to_other TEXT;
ALTER TABLE promises ADD COLUMN IF NOT EXISTS version INTEGER NOT NULL DEFAULT 1;
```

Same SQL lives in: `scripts/migrations/002-message-to-other-version.sql`.

After that, `message_to_other` (form → public agreement + send-link email) and `version` (increments when someone requests a change) work end-to-end.

---

## Local app

- `.env.local`: `DATABASE_URL` must be the raw connection string (no `psql '...'` wrapper). `NEXTAUTH_URL` must match how you run the app (e.g. `http://localhost:4125` if you use `-p 4125`).
