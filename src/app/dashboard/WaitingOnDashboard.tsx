"use client";

import Link from "next/link";
import type { PromiseRow } from "./page";

function getInitials(name: string | null): string {
  if (!name || !name.trim()) return "?";
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0]! + parts[parts.length - 1]![0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

function StatusPill({ status }: { status: string }) {
  const isAgreed = status === "agreed";
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
        isAgreed ? "bg-blue-100 text-blue-800" : "bg-amber-100 text-amber-800"
      }`}
    >
      {isAgreed ? "Agreed" : "Pending"}
    </span>
  );
}

function Card({
  title,
  items,
  emptyMessage,
  badge,
  accent = "slate",
}: {
  title: string;
  items: PromiseRow[];
  emptyMessage: string;
  badge?: string;
  accent?: "blue" | "slate" | "amber" | "green";
}) {
  const accentBorder = {
    blue: "border-t-blue-400",
    slate: "border-t-slate-400",
    amber: "border-t-amber-400",
    green: "border-t-green-500",
  }[accent];
  return (
    <div className={`rounded-xl border border-slate-200 border-t-4 ${accentBorder} bg-white p-4 shadow-sm`}>
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
                className="flex items-center gap-2 rounded-lg border border-slate-100 p-3 text-sm hover:bg-slate-50"
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-200 text-xs font-medium text-slate-700">
                  {getInitials(p.person_name)}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="font-medium text-slate-900">{p.title}</span>
                  {p.person_name && (
                    <span className="ml-2 text-slate-500">— {p.person_name}</span>
                  )}
                  {p.request_changes && (
                    <span className="ml-2 inline-flex items-center rounded-full bg-rose-100 px-2 py-0.5 text-xs font-medium text-rose-800">
                      Change requested
                    </span>
                  )}
                  {p.due_at && (
                    <span className="ml-2 text-slate-400">
                      due {String(p.due_at).slice(0, 10)}
                    </span>
                  )}
                </span>
                <StatusPill status={p.status} />
                <span className="shrink-0 text-slate-500 font-medium">View →</span>
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
