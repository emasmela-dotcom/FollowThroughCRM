"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

type Agreement = {
  id: string;
  short_id: string | null;
  title: string;
  status: string;
  due_at: string | null;
  compensation: string | null;
  agreed_at: string | null;
  completed_at: string | null;
  request_changes: string | null;
  creator_email: string | null;
  person_name: string | null;
  other_party_name?: string | null;
  stripe_link?: string | null;
  paypal_link?: string | null;
  cash_app_tag?: string | null;
  venmo_user?: string | null;
  zelle_contact?: string | null;
  bank_notes?: string | null;
};

function formatCountdown(ms: number): string {
  const abs = Math.abs(ms);
  const totalSeconds = Math.floor(abs / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const parts: string[] = [];
  if (days) parts.push(`${days}d`);
  if (hours || days) parts.push(`${hours}h`);
  if (minutes || hours || days) parts.push(`${minutes}m`);
  parts.push(`${seconds}s`);
  return parts.join(" ");
}

function LiveCountdown({
  dueAt,
  status,
}: {
  dueAt: string | null;
  status: string;
}) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);
  if (!dueAt) return null;
  if (status === "done") return null;
  const due = new Date(dueAt).getTime();
  const diff = due - now;
  if (diff > 0) {
    return (
      <p className="text-slate-600 mt-1 text-sm">
        Due in {formatCountdown(diff)}
      </p>
    );
  }
  return (
    <p className="text-amber-600 mt-1 text-sm">
      {formatCountdown(diff)} overdue
    </p>
  );
}

export default function PublicAgreementPage() {
  const params = useParams();
  const shortId = params.shortId as string;
  const [agreement, setAgreement] = useState<Agreement | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [agreeLoading, setAgreeLoading] = useState(false);
  const [requestLoading, setRequestLoading] = useState(false);
  const [agreeName, setAgreeName] = useState("");
  const [agreeEmail, setAgreeEmail] = useState("");
  const [requestMessage, setRequestMessage] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/agreements/${shortId}`);
        if (!res.ok) {
          if (res.status === 404) setError("Agreement not found");
          else setError("Failed to load");
          return;
        }
        const data = await res.json();
        if (!cancelled) setAgreement(data.agreement);
      } catch {
        if (!cancelled) setError("Failed to load");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [shortId]);

  const handleAgree = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreement) return;
    setAgreeLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/agreements/${agreement.id}/agree`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: agreeName || undefined, email: agreeEmail || undefined }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to agree");
        return;
      }
      setAgreement((prev) => (prev ? { ...prev, status: "agreed", agreed_at: new Date().toISOString() } : null));
    } catch {
      setError("Something went wrong");
    } finally {
      setAgreeLoading(false);
    }
  };

  const handleRequestChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreement) return;
    setRequestLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/agreements/${agreement.id}/request-change`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: requestMessage || "Please update this agreement.", email: agreeEmail || undefined, name: agreeName || undefined }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to submit");
        return;
      }
      setRequestMessage("");
      setError("");
      setAgreement((prev) => (prev ? { ...prev, request_changes: requestMessage || "Change requested." } : null));
    } catch {
      setError("Something went wrong");
    } finally {
      setRequestLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen app-bg flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-slate-300 border-t-slate-700" />
      </div>
    );
  }

  if (error && !agreement) {
    return (
      <div className="min-h-screen app-bg flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-slate-600 mb-4">{error}</p>
          <Link href="/" className="text-slate-800 underline">Go home</Link>
        </div>

        {(agreement.stripe_link ||
          agreement.paypal_link ||
          agreement.cash_app_tag ||
          agreement.venmo_user ||
          agreement.zelle_contact ||
          agreement.bank_notes) && (
          <section className="p-6 border-t border-slate-200 space-y-3">
            <h2 className="text-lg font-semibold text-slate-900">How to pay</h2>
            <div className="flex flex-col gap-2">
              {agreement.stripe_link && (
                <a
                  href={agreement.stripe_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 self-start rounded-lg bg-[#635BFF] px-4 py-2 text-sm font-medium text-white hover:opacity-90 transition-opacity"
                >
                  Pay with Stripe
                </a>
              )}
              {agreement.paypal_link && (
                <a
                  href={agreement.paypal_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 self-start rounded-lg bg-[#003087] px-4 py-2 text-sm font-medium text-white hover:opacity-90 transition-opacity"
                >
                  Pay with PayPal
                </a>
              )}
              {agreement.cash_app_tag && (
                <p className="text-sm text-slate-700">
                  <span className="font-medium">Cash App:</span>{" "}
                  <span className="font-mono">{agreement.cash_app_tag}</span>
                </p>
              )}
              {agreement.venmo_user && (
                <p className="text-sm text-slate-700">
                  <span className="font-medium">Venmo:</span>{" "}
                  <span className="font-mono">{agreement.venmo_user}</span>
                </p>
              )}
              {agreement.zelle_contact && (
                <p className="text-sm text-slate-700">
                  <span className="font-medium">Zelle:</span>{" "}
                  <span className="font-mono">{agreement.zelle_contact}</span>
                </p>
              )}
              {agreement.bank_notes && (
                <div className="text-sm text-slate-700">
                  <p className="font-medium mb-1">Bank transfer:</p>
                  <p className="whitespace-pre-wrap text-slate-600 rounded-lg bg-slate-50 border border-slate-200 px-3 py-2 text-xs font-mono">
                    {agreement.bank_notes}
                  </p>
                </div>
              )}
            </div>
          </section>
        )}
      </div>
    );
  }

  if (!agreement) return null;

  const isPending = agreement.status === "pending";
  const isAgreed = agreement.status === "agreed";
  const isDone = agreement.status === "done";

  return (
    <div className="min-h-screen app-bg py-8 px-4">
      <p className="max-w-lg mx-auto mb-4 px-1">
        <Link href="/" className="text-sm text-slate-500 hover:text-slate-700">← Home</Link>
      </p>
      <div className="max-w-lg mx-auto bg-white rounded-xl border border-slate-200/80 shadow-md overflow-hidden">
        <div className="p-6 border-b border-slate-200">
          <p className="text-sm text-slate-500 mb-1">
            {agreement.creator_email ? `Agreement from ${agreement.creator_email}` : "Agreement"}
          </p>
          <h1 className="text-xl font-semibold text-slate-900">{agreement.title}</h1>
          {agreement.compensation && (
            <p className="text-slate-600 mt-2">Compensation: {agreement.compensation}</p>
          )}
          {agreement.due_at && !isDone && (
            <LiveCountdown dueAt={agreement.due_at} status={agreement.status} />
          )}
          {agreement.status === "done" && agreement.completed_at && (
            <p className="text-green-600 text-sm mt-1">
              Completed on {new Date(agreement.completed_at).toLocaleDateString()}
            </p>
          )}
          {(isAgreed || isDone) && agreement.agreed_at && (
            <p className="text-slate-500 text-xs mt-2">
              Confirmed by {agreement.other_party_name || "the other party"} on {new Date(agreement.agreed_at).toLocaleString()}
            </p>
          )}
        </div>

        {isPending && (
          <div className="p-6 space-y-4">
            {error && <p className="text-red-600 text-sm">{error}</p>}
            <form onSubmit={handleAgree} className="space-y-3">
              <input
                type="text"
                placeholder="Your name (optional)"
                value={agreeName}
                onChange={(e) => setAgreeName(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900"
              />
              <input
                type="email"
                placeholder="Your email (optional)"
                value={agreeEmail}
                onChange={(e) => setAgreeEmail(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900"
              />
              <button
                type="submit"
                disabled={agreeLoading}
                className="w-full rounded-lg bg-slate-800 text-white py-2.5 font-medium hover:bg-slate-700 disabled:opacity-50"
              >
                {agreeLoading ? "…" : "Agree"}
              </button>
            </form>
            <form onSubmit={handleRequestChange} className="space-y-3 pt-2 border-t border-slate-200">
              <textarea
                placeholder="Request changes (optional message)"
                value={requestMessage}
                onChange={(e) => setRequestMessage(e.target.value)}
                rows={2}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900"
              />
              <button
                type="submit"
                disabled={requestLoading}
                className="w-full rounded-lg border border-slate-300 text-slate-700 py-2.5 font-medium hover:bg-slate-50 disabled:opacity-50"
              >
                {requestLoading ? "…" : "Request change"}
              </button>
            </form>
          </div>
        )}

        {isAgreed && !isDone && (
          <div className="p-6 space-y-4 text-slate-600 text-sm">
            <p>This agreement has been confirmed. The creator will follow up with next steps.</p>
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-center">
              <p className="font-medium text-slate-800 mb-2">Create your own agreement in 30 seconds.</p>
              <Link href="/login" className="inline-block rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700">
                Get started
              </Link>
            </div>
          </div>
        )}

        {isDone && (
          <div className="p-6 border-t border-slate-200">
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-center">
              <p className="font-medium text-slate-800 mb-2">Create your own agreement in 30 seconds.</p>
              <Link href="/login" className="inline-block rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700">
                Get started
              </Link>
            </div>
          </div>
        )}

        <footer className="p-4 bg-slate-50 border-t border-slate-200 text-center text-sm text-slate-500">
          <p>Created with Follow Thru CRM — turn conversations into confirmed agreements.</p>
          <Link href="/login" className="text-slate-700 underline mt-1 inline-block">Create your own agreement</Link>
        </footer>
      </div>
      <footer className="mt-8 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} Follow Thru CRM · Turn conversations into confirmed agreements, then payment after completion.
        {" · "}
        <Link href="/" className="text-slate-600 hover:text-slate-800 underline underline-offset-1">How it works</Link>
      </footer>
    </div>
  );
}
