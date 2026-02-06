import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { sql } from "@/lib/db";
import Link from "next/link";
import { PeopleList } from "./PeopleList";

export default async function PeoplePage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return null;
  const people = await sql`
    SELECT id, name, email, notes, created_at FROM people
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
      <PeopleList people={people as { id: string; name: string; email: string | null; notes: string | null; created_at: string }[]} />
    </div>
  );
}
