import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { sql } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import { PromiseForm } from "../../PromiseForm";
import { MarkDoneButton } from "./MarkDoneButton";

export default async function PromiseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return null;
  const { id } = await params;
  const [p] = await sql`
    SELECT p.id, p.title, p.direction, p.status, p.due_at, p.notes, p.person_id, p.created_at
    FROM promises p
    WHERE p.id = ${id} AND p.user_id = ${session.user.id}
  `;
  if (!p) notFound();
  const people = await sql`
    SELECT id, name FROM people WHERE user_id = ${session.user.id} ORDER BY name
  `;
  const status = p.status as string;
  return (
    <div className="max-w-lg space-y-6">
      <div className="flex items-center justify-between">
        <Link href="/dashboard" className="text-sm text-slate-500 hover:text-slate-700">
          ← Waiting On
        </Link>
        {status === "open" && <MarkDoneButton promiseId={id} />}
      </div>
      <h1 className="text-2xl font-semibold text-slate-900">
        {p.title as string}
        {status === "done" && <span className="ml-2 text-sm font-normal text-green-600">(done)</span>}
      </h1>
      <PromiseForm
        promiseId={id}
        people={people as { id: string; name: string }[]}
        defaultTitle={p.title as string}
        defaultDirection={(p.direction as "i_owe" | "they_owe") ?? "they_owe"}
        defaultPersonId={p.person_id as string | null}
        defaultDueAt={p.due_at as string | null}
        defaultNotes={p.notes as string | null}
      />
    </div>
  );
}
