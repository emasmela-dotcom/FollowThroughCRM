"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  promiseId: string;
  shortId: string | null;
  status: string;
  personName?: string | null;
  personEmail?: string | null;
};

export function AgreementActions({ promiseId, shortId, status, personName, personEmail }: Props) {
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState<"complete" | "cancel" | "send" | null>(null);
  const [sendError, setSendError] = useState<string | null>(null);

  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
  const publicUrl = shortId ? `${baseUrl}/agreement/${shortId}` : "";
  const canSendLink = Boolean(shortId && personEmail?.trim());

  const handleCopyLink = () => {
    if (!publicUrl) return;
    navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendLink = async () => {
    if (!canSendLink) return;
    setLoading("send");
    setSendError(null);
    try {
      const res = await fetch(`/api/agreements/${promiseId}/send-link`, { method: "POST" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setSendError(data.error || "Failed to send");
        return;
      }
      router.refresh();
    } finally {
      setLoading(null);
    }
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
          {canSendLink ? (
            <button
              type="button"
              onClick={handleSendLink}
              disabled={!!loading}
              className="rounded-lg border border-slate-300 bg-slate-800 px-3 py-1.5 text-sm font-medium text-white hover:bg-slate-700 disabled:opacity-50"
            >
              {loading === "send" ? "…" : `Send link to ${personName?.trim() || "them"}`}
            </button>
          ) : (
            <a
              href={mailtoUrl}
              className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Email link
            </a>
          )}
          {sendError && <span className="text-red-600 text-xs">{sendError}</span>}
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
