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
    WHERE p.user_id = ${uid} AND p.status = 'open'
    ORDER BY p.due_at ASC NULLS LAST, p.created_at DESC
  `;
  const today = new Date().toISOString().slice(0, 10);
  const theyOwe = promises.filter((r) => r.direction === "they_owe");
  const iOwe = promises.filter((r) => r.direction === "i_owe");
  const overdue = promises.filter((r) => r.due_at && String(r.due_at).slice(0, 10) < today);
  const upcoming = promises.filter((r) => r.due_at && String(r.due_at).slice(0, 10) >= today);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-slate-900">Waiting On</h1>
        <Link
          href="/dashboard/promises/new"
          className="rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
        >
          Add request
        </Link>
      </div>

      <WaitingOnDashboard
        theyOwe={theyOwe as PromiseRow[]}
        iOwe={iOwe as PromiseRow[]}
        overdue={overdue as PromiseRow[]}
        upcoming={upcoming as PromiseRow[]}
      />
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
};
