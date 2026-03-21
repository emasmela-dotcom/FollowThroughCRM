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
import PaymentOptionsSectionWrapper from "./PaymentOptionsSectionWrapper";

export default async function PromiseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return null;
  const { id: rawId } = await params;
  const id = rawId.split("?")[0];
  const [p] = await sql`
    SELECT p.id, p.title, p.direction, p.status, p.due_at, p.notes, p.message_to_other, p.person_id, p.created_at,
           p.short_id, p.compensation, p.agreed_at, p.completed_at,
           p.stripe_link, p.paypal_link, p.cash_app_tag, p.venmo_user, p.zelle_contact, p.bank_notes,
           per.name AS person_name, per.email AS person_email
    FROM promises p
    LEFT JOIN people per ON per.id = p.person_id AND per.user_id = ${session.user.id}
    WHERE p.id::text = ${id} AND p.user_id = ${session.user.id}
  `;
  if (!p) notFound();
  const people = await sql`
    SELECT id, name FROM people WHERE user_id = ${session.user.id} ORDER BY name
  `;
  const history = await sql`
    SELECT action, performed_by_email, notes, created_at
    FROM agreement_history
    WHERE promise_id = ${p.id as string}
    ORDER BY created_at DESC
    LIMIT 8
  `;
  const activity = history as unknown as {
    action: string;
    performed_by_email: string | null;
    notes: string | null;
    created_at: string;
  }[];
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
          <AgreementActions
            promiseId={id}
            shortId={shortId}
            status={status}
            personName={(p as { person_name?: string | null }).person_name ?? null}
            personEmail={(p as { person_email?: string | null }).person_email ?? null}
          />
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
        people={people as unknown as { id: string; name: string }[]}
        defaultTitle={p.title as string}
        defaultDirection={(p.direction as "i_owe" | "they_owe") ?? "they_owe"}
        defaultPersonId={p.person_id as string | null}
        defaultDueAt={p.due_at as string | null}
        defaultNotes={p.notes as string | null}
        defaultCompensation={p.compensation as string | null}
        defaultMessageToOther={(p as { message_to_other?: string | null }).message_to_other ?? null}
      />
      <PaymentOptionsSectionWrapper
        promiseId={p.id as string}
        initial={{
          stripeLink: (p.stripe_link as string | null) ?? null,
          paypalLink: (p.paypal_link as string | null) ?? null,
          cashAppTag: (p.cash_app_tag as string | null) ?? null,
          venmoUser: (p.venmo_user as string | null) ?? null,
          zelleContact: (p.zelle_contact as string | null) ?? null,
          bankNotes: (p.bank_notes as string | null) ?? null,
        }}
      />
      <section className="rounded-lg border border-slate-200 bg-white p-4">
        <h2 className="text-sm font-semibold text-slate-900">Agreement activity</h2>
        {activity.length === 0 ? (
          <p className="mt-2 text-sm text-slate-500">No activity yet.</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {activity.map((h, idx) => (
              <li key={`${h.action}-${h.created_at}-${idx}`} className="rounded-md border border-slate-200 p-2">
                <p className="text-sm text-slate-800">
                  <span className="font-medium">{h.action.replace(/_/g, " ")}</span>
                  {h.performed_by_email ? ` by ${h.performed_by_email}` : ""}
                </p>
                {h.notes && <p className="text-sm text-slate-600 mt-1 whitespace-pre-wrap">{h.notes}</p>}
                <p className="text-xs text-slate-500 mt-1">{new Date(h.created_at).toLocaleString()}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
