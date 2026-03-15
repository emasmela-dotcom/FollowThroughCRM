import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import Link from "next/link";

export default async function Home() {
  const session = await getServerSession(authOptions);
  if (session) redirect("/dashboard");

  return (
    <div className="min-h-screen app-bg">
      <div className="mx-auto max-w-4xl px-4 py-12 sm:py-16">
        <header className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
            Follow Thru CRM
          </h1>
          <p className="mt-2 text-lg text-slate-600">
            Turn conversations into confirmed agreements.
          </p>
        </header>

        <div className="grid sm:grid-cols-3 gap-6 mb-12">
          <div className="rounded-xl border border-slate-200/80 bg-white p-6 shadow-sm text-center">
            <div className="text-2xl font-semibold text-slate-800 mb-1">Create</div>
            <p className="text-sm text-slate-600">Add a request, set a due date, and get a shareable agreement link.</p>
          </div>
          <div className="rounded-xl border border-slate-200/80 bg-white p-6 shadow-sm text-center">
            <div className="text-2xl font-semibold text-slate-800 mb-1">Share</div>
            <p className="text-sm text-slate-600">Send the link. The other party agrees or requests changes—no back-and-forth.</p>
          </div>
          <div className="rounded-xl border border-slate-200/80 bg-white p-6 shadow-sm text-center">
            <div className="text-2xl font-semibold text-slate-800 mb-1">Complete</div>
            <p className="text-sm text-slate-600">Track due dates, mark done, and keep everyone on the same page.</p>
          </div>
        </div>

        <p className="text-center text-slate-500 text-sm mb-6">
          Used by freelancers, contractors, and anyone who needs a clear yes.
        </p>

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
