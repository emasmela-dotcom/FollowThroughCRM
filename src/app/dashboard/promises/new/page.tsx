import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { sql } from "@/lib/db";
import { PromiseForm } from "../../PromiseForm";

export default async function NewPromisePage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return null;
  const people = await sql`
    SELECT id, name FROM people WHERE user_id = ${session.user.id} ORDER BY name
  `;
  return (
    <div className="max-w-lg space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard" className="text-sm text-slate-500 hover:text-slate-700">
          ← Waiting On
        </Link>
      </div>
      <h1 className="text-2xl font-semibold text-slate-900">Add request</h1>
      <PromiseForm people={people as { id: string; name: string }[]} />
    </div>
  );
}
