import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import Link from "next/link";
import { DashboardNav } from "./DashboardNav";
import { AppFooter } from "@/components/AppFooter";
import { SITE } from "@/lib/siteCopy";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session) redirect("/login");

  return (
    <div className="min-h-screen app-bg flex flex-col">
      <header className="border-b border-slate-200/80 bg-white shadow-sm">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
          <div>
            <Link href="/dashboard" className="font-semibold text-slate-900">
              {SITE.brandName}
            </Link>
            <p className="text-xs text-slate-500">{SITE.tagline}</p>
          </div>
          <DashboardNav userEmail={session.user?.email ?? ""} />
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-6 flex-1 w-full">{children}</main>
      <AppFooter />
    </div>
  );
}
