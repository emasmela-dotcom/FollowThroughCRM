"use client";

import Link from "next/link";
import type { PromiseRow } from "./page";

function Card({
  title,
  items,
  emptyMessage,
  badge,
}: {
  title: string;
  items: PromiseRow[];
  emptyMessage: string;
  badge?: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold text-slate-900">
        {title}
        {badge && (
          <span className="rounded-full bg-slate-200 px-2 py-0.5 text-xs font-medium text-slate-600">
            {badge}
          </span>
        )}
      </h2>
      {items.length === 0 ? (
        <p className="text-sm text-slate-500">{emptyMessage}</p>
      ) : (
        <ul className="space-y-2">
          {items.map((p) => (
            <li key={p.id}>
              <Link
                href={`/dashboard/promises/${p.id}`}
                className="block rounded-lg border border-slate-100 p-3 text-sm hover:bg-slate-50"
              >
                <span className="font-medium text-slate-900">{p.title}</span>
                {p.person_name && (
                  <span className="ml-2 text-slate-500">— {p.person_name}</span>
                )}
                {p.due_at && (
                  <span className="ml-2 text-slate-400">
                    due {String(p.due_at).slice(0, 10)}
                  </span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function WaitingOnDashboard({
  theyOwe,
  iOwe,
  overdue,
  upcoming,
}: {
  theyOwe: PromiseRow[];
  iOwe: PromiseRow[];
  overdue: PromiseRow[];
  upcoming: PromiseRow[];
}) {
  return (
    <div className="grid gap-6 sm:grid-cols-2">
      <Card
        title="They owe you"
        items={theyOwe}
        emptyMessage="Nothing waiting on others."
        badge={theyOwe.length > 0 ? String(theyOwe.length) : undefined}
      />
      <Card
        title="You owe others"
        items={iOwe}
        emptyMessage="Nothing you owe."
        badge={iOwe.length > 0 ? String(iOwe.length) : undefined}
      />
      <Card
        title="Overdue"
        items={overdue}
        emptyMessage="No overdue items."
        badge={overdue.length > 0 ? String(overdue.length) : undefined}
      />
      <Card
        title="Upcoming"
        items={upcoming}
        emptyMessage="No upcoming due dates."
        badge={upcoming.length > 0 ? String(upcoming.length) : undefined}
      />
    </div>
  );
}
