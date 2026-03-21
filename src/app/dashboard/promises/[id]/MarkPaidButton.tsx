"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function MarkPaidButton({
  promiseId,
  paidAt,
}: {
  promiseId: string;
  paidAt: string | null;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function toggle() {
    setLoading(true);
    try {
      const res = await fetch(`/api/promises/${promiseId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ payment_received: !paidAt }),
      });
      if (res.ok) router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-lg border border-emerald-200 bg-emerald-50/80 p-4 text-sm">
      {paidAt ? (
        <>
          <p className="font-medium text-emerald-900">Payment recorded</p>
          <p className="text-emerald-800/90 mt-1">Marked received on {new Date(paidAt).toLocaleString()}</p>
          <button
            type="button"
            onClick={toggle}
            disabled={loading}
            className="mt-2 text-xs text-emerald-800 underline hover:text-emerald-950 disabled:opacity-50"
          >
            {loading ? "…" : "Undo (not received yet)"}
          </button>
        </>
      ) : (
        <>
          <p className="font-medium text-emerald-900">Got paid?</p>
          <p className="text-emerald-800/90 mt-1">
            This is your own record—Follow Thru doesn’t process money. Mark here when you’ve received payment outside the app.
          </p>
          <button
            type="button"
            onClick={toggle}
            disabled={loading}
            className="mt-3 rounded-lg bg-emerald-800 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-900 disabled:opacity-50"
          >
            {loading ? "…" : "Mark payment received"}
          </button>
        </>
      )}
    </div>
  );
}
