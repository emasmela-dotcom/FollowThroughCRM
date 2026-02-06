import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { sql } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import { PersonForm } from "../../PersonForm";

export default async function PersonEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return null;
  const { id } = await params;
  const [row] = await sql`
    SELECT id, name, email, notes FROM people WHERE id = ${id} AND user_id = ${session.user.id}
  `;
  if (!row) notFound();
  return (
    <div className="max-w-lg space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/people" className="text-sm text-slate-500 hover:text-slate-700">
          ← People
        </Link>
      </div>
      <h1 className="text-2xl font-semibold text-slate-900">Edit person</h1>
      <PersonForm
        id={id}
        defaultName={row.name as string}
        defaultEmail={(row.email as string) ?? ""}
        defaultNotes={(row.notes as string) ?? ""}
      />
    </div>
  );
}
