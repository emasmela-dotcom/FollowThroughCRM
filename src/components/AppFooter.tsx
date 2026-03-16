import Link from "next/link";

export function AppFooter({ howItWorksHref = "/dashboard/instructions" }: { howItWorksHref?: string }) {
  return (
    <footer className="mt-auto border-t border-slate-200/80 bg-white/80 py-3 px-4">
      <p className="text-center text-xs text-slate-500">
        © {new Date().getFullYear()} Follow Thru CRM · Turn conversations into confirmed agreements.
        {" · "}
        <Link href={howItWorksHref} className="text-slate-600 hover:text-slate-800 underline underline-offset-1">
          How it works
        </Link>
      </p>
    </footer>
  );
}
