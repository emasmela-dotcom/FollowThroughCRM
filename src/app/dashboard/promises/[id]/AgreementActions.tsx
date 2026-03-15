"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  promiseId: string;
  shortId: string | null;
  status: string;
};

export function AgreementActions({ promiseId, shortId, status }: Props) {
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState<"complete" | "cancel" | null>(null);

  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
  const publicUrl = shortId ? `${baseUrl}/agreement/${shortId}` : "";

  const handleCopyLink = () => {
    if (!publicUrl) return;
    navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const mailtoSubject = encodeURIComponent("Agreement link");
  const mailtoBody = encodeURIComponent(`Please review and confirm: ${publicUrl}`);
  const mailtoUrl = publicUrl ? `mailto:?subject=${mailtoSubject}&body=${mailtoBody}` : "";

  const handleComplete = async () => {
    setLoading("complete");
    try {
      const res = await fetch(`/api/agreements/${promiseId}/complete`, { method: "POST" });
      if (res.ok) {
        router.refresh();
      }
    } finally {
      setLoading(null);
    }
  };

  const handleCancel = async () => {
    if (!confirm("Cancel this agreement?")) return;
    setLoading("cancel");
    try {
      const res = await fetch(`/api/agreements/${promiseId}/cancel`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: "Cancelled by creator" }),
      });
      if (res.ok) {
        router.refresh();
      }
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      {shortId && (
        <>
          <button
            type="button"
            onClick={handleCopyLink}
            className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            {copied ? "Copied!" : "Copy agreement link"}
          </button>
          <a
            href={mailtoUrl}
            className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Email link
          </a>
        </>
      )}
      {status === "agreed" && (
        <button
          type="button"
          onClick={handleComplete}
          disabled={!!loading}
          className="rounded-lg border border-green-600 bg-green-50 px-3 py-1.5 text-sm font-medium text-green-700 hover:bg-green-100 disabled:opacity-50"
        >
          {loading === "complete" ? "…" : "Mark complete"}
        </button>
      )}
      {(status === "pending" || status === "agreed") && (
        <button
          type="button"
          onClick={handleCancel}
          disabled={!!loading}
          className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50"
        >
          {loading === "cancel" ? "…" : "Cancel agreement"}
        </button>
      )}
    </div>
  );
}
