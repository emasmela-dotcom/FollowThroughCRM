import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { sql } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import { PromiseForm } from "../../PromiseForm";
import { MarkDoneButton } from "./MarkDoneButton";
import { AgreementActions } from "./AgreementActions";
import { ShareWin } from "./ShareWin";
import { AgreementCountdown } from "@/components/agreements/AgreementCountdown";
import { StatusBadge } from "@/components/agreements/StatusBadge";

export default async function PromiseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return null;
  const { id } = await params;
  const [p] = await sql`
    SELECT p.id, p.title, p.direction, p.status, p.due_at, p.notes, p.person_id, p.created_at,
           p.short_id, p.compensation, p.agreed_at, p.completed_at
    FROM promises p
    WHERE p.id = ${id} AND p.user_id = ${session.user.id}
  `;
  if (!p) notFound();
  const people = await sql`
    SELECT id, name FROM people WHERE user_id = ${session.user.id} ORDER BY name
  `;
  const status = (p.status as string) ?? "pending";
  const shortId = p.short_id as string | null;
  return (
    <div className="max-w-lg space-y-6">
      <div className="flex items-center justify-between gap-2">
        <Link href="/dashboard" className="text-sm text-slate-500 hover:text-slate-700 shrink-0">
          ← Waiting On
        </Link>
        <div className="flex items-center gap-2 flex-wrap justify-end">
          <StatusBadge status={status} />
          {status === "pending" && <MarkDoneButton promiseId={id} />}
          <AgreementActions promiseId={id} shortId={shortId} status={status} />
        </div>
      </div>
      <h1 className="text-2xl font-semibold text-slate-900">
        {p.title as string}
        {status === "done" && <span className="ml-2 text-sm font-normal text-green-600">(done)</span>}
      </h1>
      <div className="flex flex-wrap items-center gap-3 text-sm">
        <AgreementCountdown
          dueAt={p.due_at as string | null}
          status={status}
          completedAt={p.completed_at as string | null}
        />
        {p.compensation && (
          <span className="text-slate-600">Compensation: {p.compensation as string}</span>
        )}
      </div>
      {status === "done" && shortId && (
        <ShareWin title={p.title as string} agreementPath={`/agreement/${shortId}`} />
      )}
      <PromiseForm
        promiseId={id}
        people={people as { id: string; name: string }[]}
        defaultTitle={p.title as string}
        defaultDirection={(p.direction as "i_owe" | "they_owe") ?? "they_owe"}
        defaultPersonId={p.person_id as string | null}
        defaultDueAt={p.due_at as string | null}
        defaultNotes={p.notes as string | null}
        defaultCompensation={p.compensation as string | null}
      />
    </div>
  );
}
