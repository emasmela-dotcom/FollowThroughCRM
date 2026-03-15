import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import { DashboardNav } from "./DashboardNav";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  return (
    <div className="min-h-screen app-bg">
      <header className="border-b border-slate-200/80 bg-white shadow-sm">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
          <div>
            <Link href="/dashboard" className="font-semibold text-slate-900">
              Follow-Through CRM
            </Link>
            <p className="text-xs text-slate-500">Turn conversations into confirmed agreements.</p>
          </div>
          <DashboardNav userEmail={session.user?.email ?? ""} />
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-6">{children}</main>
    </div>
  );
}
