"use client";

export function ShareWin({ title, agreementPath }: { title: string; agreementPath: string }) {
  const base = typeof window !== "undefined" ? window.location.origin : "";
  const agreementUrl = base ? `${base}${agreementPath}` : "https://followthrucrm.com";
  const text = encodeURIComponent(`I completed "${title}" with Follow Thru CRM — turn conversations into confirmed agreements.`);
  const twitterUrl = `https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(agreementUrl)}`;
  const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(agreementUrl)}`;
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
      <p className="text-sm font-medium text-slate-700 mb-2">Share this win</p>
      <div className="flex gap-2">
        <a
          href={twitterUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
        >
          Twitter
        </a>
        <a
          href={linkedInUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
        >
          LinkedIn
        </a>
      </div>
    </div>
  );
}
