"use client";

import Link from "next/link";

type Person = { id: string; name: string; email: string | null; notes: string | null; created_at: string };

export function PeopleList({ people }: { people: Person[] }) {
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
            {p.email && <span className="ml-2 text-slate-500 text-sm">{p.email}</span>}
            {p.notes && <p className="mt-1 text-sm text-slate-500">{p.notes}</p>}
          </Link>
        </li>
      ))}
    </ul>
  );
}
