import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { sql } from "@/lib/db";
import { WaitingOnDashboard } from "./WaitingOnDashboard";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return null;
  const uid = session.user.id;
  const promises = await sql`
    SELECT p.id, p.title, p.direction, p.status, p.due_at, p.notes, p.created_at,
           per.id AS person_id, per.name AS person_name, per.email AS person_email
    FROM promises p
    LEFT JOIN people per ON per.id = p.person_id
    WHERE p.user_id = ${uid} AND p.status IN ('pending', 'agreed')
    ORDER BY p.due_at ASC NULLS LAST, p.created_at DESC
  `;
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);
  const completedThisMonth = await sql`
    SELECT COUNT(*)::int AS count FROM promises
    WHERE user_id = ${uid} AND status = 'done'
    AND completed_at >= ${startOfMonth.toISOString()}
  `;
  const totalCompleted = await sql`
    SELECT COUNT(*)::int AS count FROM promises
    WHERE user_id = ${uid} AND status = 'done'
  `;
  const totalClosed = await sql`
    SELECT COUNT(*)::int AS count FROM promises
    WHERE user_id = ${uid} AND status IN ('done', 'cancelled')
  `;
  const today = new Date().toISOString().slice(0, 10);
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().slice(0, 10);
  const theyOwe = promises.filter((r) => r.direction === "they_owe");
  const iOwe = promises.filter((r) => r.direction === "i_owe");
  const overdue = promises.filter((r) => r.due_at && String(r.due_at).slice(0, 10) < today);
  const upcoming = promises.filter((r) => r.due_at && String(r.due_at).slice(0, 10) >= today);
  const dueTomorrow = promises.filter((r) => r.due_at && String(r.due_at).slice(0, 10) === tomorrowStr);
  const dueToday = promises.filter((r) => r.due_at && String(r.due_at).slice(0, 10) === today);
  const completedCount = (completedThisMonth[0] as { count: number })?.count ?? 0;
  const totalDone = (totalCompleted[0] as { count: number })?.count ?? 0;
  const closedCount = (totalClosed[0] as { count: number })?.count ?? 1;
  const followThroughRate = closedCount ? Math.round((totalDone / closedCount) * 100) : 0;
  const awaitingCount = promises.filter((r) => r.status === "pending").length;
  const firstPending = promises.find((r) => r.status === "pending");
  const firstPendingId = firstPending?.id ?? null;
  const hasAnyRequests = promises.length > 0;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Waiting On</h1>
          <p className="text-slate-500 text-sm mt-0.5">Track what you’re waiting on and who you’re waiting on it from.</p>
        </div>
        <Link
          href="/dashboard/promises/new"
          className="rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
        >
          Add request
        </Link>
      </div>

      <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-4 border-l-4 border-l-slate-400">
        <div className="flex flex-wrap gap-6 text-sm text-slate-700">
          <span><strong className="text-slate-900">{completedCount}</strong> completed this month</span>
          <span><strong className="text-slate-900">{followThroughRate}%</strong> follow-through rate</span>
          <span><strong className="text-slate-900">{dueToday.length}</strong> due today</span>
          <span><strong className="text-slate-900">{dueTomorrow.length}</strong> due soon</span>
        </div>
      </div>

      {(awaitingCount > 0 || dueTomorrow.length > 0) && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
          {awaitingCount > 0 && (
            <p>
              <strong>{awaitingCount}</strong> agreement{awaitingCount !== 1 ? "s" : ""} awaiting confirmation.{" "}
              {firstPendingId ? (
                <Link href={`/dashboard/promises/${firstPendingId}`} className="font-medium underline underline-offset-1 hover:text-amber-800">
                  View & copy link →
                </Link>
              ) : (
                "Send the link to get them confirmed."
              )}
            </p>
          )}
          {dueTomorrow.length > 0 && (
            <p className={awaitingCount > 0 ? "mt-1" : ""}><strong>{dueTomorrow.length}</strong> due tomorrow.</p>
          )}
          <p className="mt-2 text-amber-800/90 text-xs">Tip: Copy the agreement link and send it in email or chat.</p>
        </div>
      )}

      {!hasAnyRequests ? (
        <div className="rounded-xl border border-slate-200 bg-white p-6 text-center">
          <p className="text-slate-600 mb-4">Nothing being waited on yet.</p>
          <ol className="text-left max-w-sm mx-auto space-y-2 text-sm text-slate-700 mb-5">
            <li>1. <Link href="/dashboard/people" className="text-slate-800 font-medium underline underline-offset-1 hover:text-slate-600">Add people you work with</Link>.</li>
            <li>2. <Link href="/dashboard/promises/new" className="text-slate-800 font-medium underline underline-offset-1 hover:text-slate-600">Create your first request</Link>.</li>
            <li>3. Share the agreement link for them to agree.</li>
          </ol>
          <Link href="/dashboard/promises/new" className="inline-block rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700">
            Add your first request
          </Link>
          <p className="mt-4 text-sm text-slate-500">
            New here? <Link href="/dashboard/instructions" className="text-slate-700 font-medium underline underline-offset-1 hover:text-slate-600">See how it works</Link>.
          </p>
        </div>
      ) : (
      <WaitingOnDashboard
        theyOwe={theyOwe as PromiseRow[]}
        iOwe={iOwe as PromiseRow[]}
        overdue={overdue as PromiseRow[]}
        upcoming={upcoming as PromiseRow[]}
      />
      )}
    </div>
  );
}

export type PromiseRow = {
  id: string;
  title: string;
  direction: string;
  status: string;
  due_at: string | null;
  notes: string | null;
  created_at: string;
  person_id: string | null;
  person_name: string | null;
  person_email: string | null;
  short_id?: string | null;
};
