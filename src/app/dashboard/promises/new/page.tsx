import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { sql } from "@/lib/db";
import { PromiseForm } from "../../PromiseForm";
import Link from "next/link";

const TEMPLATES: Record<string, { title: string; compensation?: string; notes?: string; dueDays?: number }> = {
  freelance: { title: "Deliverable", compensation: "As per quote", dueDays: 7 },
  contractor: { title: "Contractor job", compensation: "As agreed", dueDays: 14 },
  loan: { title: "Loan between friends", notes: "Repayment terms as agreed", dueDays: 30 },
};

function getTemplateDefaults(template: string | null) {
  if (!template || !TEMPLATES[template]) return {};
  const t = TEMPLATES[template];
  const due = new Date();
  due.setDate(due.getDate() + (t.dueDays ?? 7));
  return {
    defaultTitle: t.title,
    defaultCompensation: t.compensation ?? "",
    defaultNotes: t.notes ?? "",
    defaultDueAt: due.toISOString().slice(0, 10),
  };
}

export default async function NewPromisePage({
  searchParams,
}: {
  searchParams: Promise<{ template?: string }>;
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login");
  }

  const people = await sql`
    SELECT id, name
    FROM people
    WHERE user_id = ${session.user.id}
    ORDER BY name
  `;

  const params = await searchParams;
  const templateDefaults = getTemplateDefaults(params.template ?? null);

  return (
    <div className="max-w-xl mx-auto py-8">
      <Link
        href="/dashboard"
        className="text-sm text-slate-600 hover:text-slate-900"
      >
        ← Back to Waiting On
      </Link>

      <h1 className="text-2xl font-semibold mt-4">Add request</h1>

      <p className="text-slate-600 text-sm mt-1">
        Create an agreement so you and the other person are on the same page.
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        <span className="text-sm text-slate-500 mr-1 self-center">Templates:</span>
        <Link
          href="/dashboard/promises/new?template=freelance"
          className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
        >
          Freelance deliverable
        </Link>
        <Link
          href="/dashboard/promises/new?template=contractor"
          className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
        >
          Contractor job
        </Link>
        <Link
          href="/dashboard/promises/new?template=loan"
          className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
        >
          Loan between friends
        </Link>
      </div>

      <div className="mt-6">
        <PromiseForm
          people={people as unknown as { id: string; name: string }[]}
          {...templateDefaults}
        />
      </div>
    </div>
  );
}
