import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import Link from "next/link";
import { SITE } from "@/lib/siteCopy";

export default async function Home() {
  const session = await getSession();
  if (session) redirect("/dashboard");

  return (
    <div className="min-h-screen app-bg">
      <div className="mx-auto max-w-4xl px-4 py-12 sm:py-16">
        <header className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
            {SITE.brandName}
          </h1>
          <p className="mt-2 text-lg text-slate-600">{SITE.tagline}</p>
        </header>

        <div className="rounded-xl border border-slate-200/80 bg-white p-6 shadow-sm mb-10 text-center">
          <p className="text-slate-700 text-sm max-w-2xl mx-auto">
            <strong className="text-slate-900">One place for every agreement.</strong> {SITE.valueProp} Share your link, attach your contract in the same email if you use one, and keep a clear record—task, due date, compensation, status.
          </p>
        </div>

        <div className="grid sm:grid-cols-3 gap-6 mb-12">
          <div className="rounded-xl border border-slate-200/80 bg-white p-6 shadow-sm text-center">
            <div className="text-2xl font-semibold text-slate-800 mb-1">Create</div>
            <p className="text-sm text-slate-600">Add a request, set a due date, and get a shareable agreement link.</p>
          </div>
          <div className="rounded-xl border border-slate-200/80 bg-white p-6 shadow-sm text-center">
            <div className="text-2xl font-semibold text-slate-800 mb-1">Share</div>
            <p className="text-sm text-slate-600">Send the link—and attach your contract in the same email. The other party agrees or requests changes in one place.</p>
          </div>
          <div className="rounded-xl border border-slate-200/80 bg-white p-6 shadow-sm text-center">
            <div className="text-2xl font-semibold text-slate-800 mb-1">Complete</div>
            <p className="text-sm text-slate-600">Track due dates, mark done, and keep everyone on the same page. Professional agreement handling without the complexity.</p>
          </div>
        </div>

        <p className="text-center text-slate-500 text-sm mb-6">{SITE.audienceLine}</p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/signup"
            className="rounded-lg bg-slate-800 px-6 py-3 text-center font-medium text-white hover:bg-slate-700"
          >
            Sign up
          </Link>
          <Link
            href="/login"
            className="rounded-lg border border-slate-300 bg-white px-6 py-3 text-center font-medium text-slate-700 hover:bg-slate-50"
          >
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
