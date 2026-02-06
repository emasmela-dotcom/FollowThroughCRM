"use client";

import { useRouter } from "next/navigation";

export function MarkDoneButton({ promiseId }: { promiseId: string }) {
  const router = useRouter();

  async function handleClick() {
    await fetch(`/api/promises/${promiseId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "done" }),
    });
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className="rounded-lg border border-green-600 bg-green-50 px-3 py-1.5 text-sm font-medium text-green-700 hover:bg-green-100"
    >
      Mark done
    </button>
  );
}
