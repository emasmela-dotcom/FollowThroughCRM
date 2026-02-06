"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

export function DashboardNav({ userEmail }: { userEmail: string }) {
  const path = usePathname();
  return (
    <nav className="flex items-center gap-4">
      <Link
        href="/dashboard"
        className={`text-sm font-medium ${path === "/dashboard" ? "text-slate-900" : "text-slate-500 hover:text-slate-700"}`}
      >
        Waiting On
      </Link>
      <Link
        href="/dashboard/people"
        className={`text-sm font-medium ${path === "/dashboard/people" ? "text-slate-900" : "text-slate-500 hover:text-slate-700"}`}
      >
        People
      </Link>
      <span className="text-sm text-slate-400">{userEmail}</span>
      <button
        onClick={() => signOut({ callbackUrl: "/login" })}
        className="text-sm text-slate-500 hover:text-slate-700"
      >
        Sign out
      </button>
    </nav>
  );
}
