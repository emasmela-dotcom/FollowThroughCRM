"use client";

import Link from "next/link";

import type { PersonRow } from "./page";

export function PeopleList({ people }: { people: PersonRow[] }) {
  if (people.length === 0) {
    return (
      <p className="rounded-xl border border-slate-200 bg-white p-6 text-slate-500">
        No people yet. Add someone to attach to requests.
      </p>
    );
  }
  return (
    <ul className="space-y-2">
      {people.map((p) => (
        <li key={p.id}>
          <Link
            href={`/dashboard/people/${p.id}`}
            className="block rounded-xl border border-slate-200 bg-white p-4 shadow-sm hover:bg-slate-50"
          >
            <span className="font-medium text-slate-900">{p.name}</span>
            {(p.company || p.job_title || p.category) && (
              <span className="ml-2 text-slate-500 text-sm">
                {[p.company, p.job_title, p.category].filter(Boolean).join(" · ")}
              </span>
            )}
            {p.email && <p className="mt-0.5 text-sm text-slate-500">{p.email}</p>}
            {(p.phone || p.address) && (
              <p className="text-sm text-slate-500">
                {[p.phone, p.address].filter(Boolean).join(" · ")}
              </p>
            )}
            {p.notes && <p className="mt-1 text-sm text-slate-500 line-clamp-2">{p.notes}</p>}
          </Link>
        </li>
      ))}
    </ul>
  );
}
