# Follow-Through CRM

A **Promise Tracking CRM**: track what you’re waiting on and who you’re waiting on it from. Built for solo operators and small teams who need organization, not sales pipelines.

- **Waiting On dashboard** — They owe you / You owe them / Overdue / Upcoming  
- **People** — Contacts linked to requests  
- **Promises** — Title, direction, due date, notes, status (open/done/cancelled)  
- **Reminders** — Optional daily email for due/overdue items (no cost if you don’t enable email)

---

## No-cost setup (what you pay: $0)

Everything below stays **free** within normal solo/small use. No credit card required.

| Service | What it does | Free tier / cost |
|--------|----------------|-------------------|
| **Vercel** | Hosts the app and runs it in the cloud | Hobby: free. No card required. |
| **Neon** | Postgres database in the cloud | Free tier: 0.5 GB, no card required. |
| **Resend** (optional) | Sends reminder emails | Free: 100 emails/day. No card required. If you don’t set `RESEND_API_KEY`, reminders are **not** sent and you use **$0**. |
| **NextAuth** | Login/signup (email + password) | No separate service; runs in your app. **$0**. |

**Summary:**  
- **Required:** Vercel (free) + Neon (free) + `NEXTAUTH_SECRET` + `DATABASE_URL`.  
- **Optional:** `RESEND_API_KEY` only if you want reminder emails; otherwise leave it unset and you have **no usage and no cost**.

---

## Run in the cloud (no Mac required)

1. **Push this folder to GitHub**  
   - Either create a new repo and push the `follow-through-crm` folder as the repo root, or keep it as a folder in an existing repo and deploy that repo with root set to `follow-through-crm` (see Vercel “Root Directory”).

2. **Create a Neon database (free)**  
   - Go to [neon.tech](https://neon.tech), sign up, create a project.  
   - Copy the **connection string** (e.g. `postgresql://user:pass@host/db?sslmode=require`).  
   - No credit card.

3. **Deploy on Vercel**  
   - Go to [vercel.com](https://vercel.com), sign up, “Add New Project”, import your GitHub repo.  
   - If the app is in a subfolder, set **Root Directory** to `follow-through-crm`.  
   - **Environment variables** (in Vercel project → Settings → Environment Variables):

   | Name | Value | Required |
   |------|--------|----------|
   | `DATABASE_URL` | Your Neon connection string | Yes |
   | `NEXTAUTH_SECRET` | Any long random string (e.g. 32+ chars) | Yes |
   | `NEXTAUTH_URL` | Your app URL (e.g. `https://your-app.vercel.app`). Vercel often sets this automatically. | Yes for auth |
   | `RESEND_API_KEY` | From [resend.com](https://resend.com) (free tier) | No — only if you want reminder emails |
   | `CRON_SECRET` | A random string; Vercel will send it when calling the cron | Recommended for cron security |

   Deploy. The app runs in the cloud; you use it in the browser.

4. **Apply the database schema once**  
   - Locally (one time): copy `.env.example` to `.env.local`, set `DATABASE_URL` and `NEXTAUTH_SECRET`, then run:
     ```bash
     cd follow-through-crm && npm install && npm run db:push
     ```
   - Or run the same from a one-off script/CI that has `DATABASE_URL` (e.g. `npx tsx scripts/db-push.ts`).  
   - This creates `users`, `people`, `promises`, and `reminder_sent` tables.

5. **Cron (reminders)**  
   - `vercel.json` defines a daily cron that hits `/api/cron/reminders`.  
   - On Vercel, cron runs in the cloud.  
   - If `RESEND_API_KEY` is not set, the route does nothing except mark reminders as “sent” in DB (so no duplicate work); **no emails, no cost**.

---

## Local development (optional)

Only if you want to run it on your machine:

```bash
cd follow-through-crm
cp .env.example .env.local
# Edit .env.local: DATABASE_URL (Neon), NEXTAUTH_SECRET, NEXTAUTH_URL=http://localhost:3000
npm install
npm run db:push
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Sign up, then use Waiting On, People, and Promises.

---

## Tech stack

- Next.js 14 (App Router), React, TypeScript, Tailwind  
- Auth: NextAuth (Credentials, email + password)  
- DB: Neon (serverless Postgres)  
- Optional email: Resend (reminder digest)  
- Deploy: Vercel (and Vercel Cron for daily reminders)

---

## Inbox-by-email (future)

The spec mentioned “forward email to inbox@followthroughcrm.com” to create a tracked item. That requires:

- A domain (e.g. followthroughcrm.com) and inbound email (e.g. Resend Inbound, Mailgun, or SendGrid).
- A webhook that receives the email and creates a promise/person.

Not included in this repo to keep setup **no-cost** and no domain/email config. You can add it later by:

1. Configuring inbound email for your domain with a provider.  
2. Adding an API route (e.g. `POST /api/inbound-email`) that parses the payload and inserts into `people`/`promises`.

Until then, use “Add request” and “Add person” in the app.
