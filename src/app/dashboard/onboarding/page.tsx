import Link from "next/link";
import { getSession } from "@/lib/auth";
import { sql } from "@/lib/db";
import { redirect } from "next/navigation";
import { SITE } from "@/lib/siteCopy";

export default async function OnboardingPage() {
  const session = await getSession();
  if (!session?.user?.id) redirect("/login");
  const uid = session.user.id;
  const [peopleRow] = await sql`
    SELECT COUNT(*)::int AS c FROM people WHERE user_id = ${uid}
  `;
  const [promiseRow] = await sql`
    SELECT COUNT(*)::int AS c FROM promises WHERE user_id = ${uid}
  `;
  const peopleCount = (peopleRow as { c: number }).c ?? 0;
  const promiseCount = (promiseRow as { c: number }).c ?? 0;

  return (
    <div className="max-w-2xl space-y-6">
      <p className="text-sm">
        <Link href="/dashboard" className="text-slate-500 hover:text-slate-800">
          ← Waiting On
        </Link>
      </p>
      <h1 className="text-2xl font-semibold text-slate-900">Welcome to {SITE.brandName}</h1>
      <p className="text-slate-600 text-sm">{SITE.tagline}</p>

      <div className="rounded-lg border border-slate-200 bg-white p-4 text-sm text-slate-700 space-y-3">
        <p>
          You have <strong>{peopleCount}</strong> {peopleCount === 1 ? "person" : "people"} and{" "}
          <strong>{promiseCount}</strong> {promiseCount === 1 ? "request" : "requests"}.
        </p>
        <ol className="list-decimal list-inside space-y-2">
          <li>Add contacts in <Link href="/dashboard/people" className="text-slate-900 underline">People</Link>.</li>
          <li>
            Create a request with <Link href="/dashboard/promises/new" className="text-slate-900 underline">Add request</Link>—what you’re waiting on, who, due date.
          </li>
          <li>Open the request, copy the agreement link, and send it. They agree or request changes on that page.</li>
          <li>Use <strong>Mark complete</strong> when work is done.</li>
        </ol>
      </div>

      <div className="flex flex-wrap gap-3">
        <Link
          href="/dashboard/people/new"
          className="rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
        >
          Add a person
        </Link>
        <Link
          href="/dashboard/promises/new"
          className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-800 hover:bg-slate-50"
        >
          New request
        </Link>
        <Link href="/dashboard/instructions" className="rounded-lg px-4 py-2 text-sm text-slate-600 underline">
          Instructions
        </Link>
      </div>
    </div>
  );
}
