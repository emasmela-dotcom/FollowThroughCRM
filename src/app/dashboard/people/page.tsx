import { getSession } from "@/lib/auth";
import { sql } from "@/lib/db";
import Link from "next/link";
import { PeopleList } from "./PeopleList";

export type PersonRow = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  company: string | null;
  job_title: string | null;
  preferred_contact: string | null;
  website: string | null;
  category: string | null;
  notes: string | null;
  created_at: string;
};

export default async function PeoplePage() {
  const session = await getSession();
  if (!session?.user?.id) return null;
  const people = await sql`
    SELECT id, name, email, phone, address, company, job_title, preferred_contact, website, category, notes, created_at FROM people
    WHERE user_id = ${session.user.id}
    ORDER BY name
  `;
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-slate-900">People</h1>
        <Link
          href="/dashboard/people/new"
          className="rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
        >
          Add person
        </Link>
      </div>
      <PeopleList people={people as unknown as PersonRow[]} />
    </div>
  );
}
