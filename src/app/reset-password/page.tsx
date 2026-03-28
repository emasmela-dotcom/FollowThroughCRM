"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { AppFooter } from "@/components/AppFooter";
import { SITE } from "@/lib/siteCopy";

function ResetForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token")?.trim() ?? "";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    if (!token) {
      setError("Missing reset token. Open the link from your email, or request a new reset.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const text = await res.text();
      let data: { error?: string } = {};
      try {
        data = text ? (JSON.parse(text) as typeof data) : {};
      } catch {
        setError(`Server returned an invalid response (${res.status}). Try again.`);
        return;
      }
      if (!res.ok) {
        setError(typeof data.error === "string" ? data.error : "Reset failed.");
        return;
      }
      router.push("/login?reset=1");
      router.refresh();
    } catch {
      setError("Network error. Try again.");
    } finally {
      setLoading(false);
    }
  }

  if (!token) {
    return (
      <div className="w-full max-w-md rounded-xl bg-white shadow-sm border border-slate-200 p-6">
        <p className="text-slate-600 text-sm mb-4">This page needs a valid link from your reset email.</p>
        <Link href="/forgot-password" className="text-slate-800 font-medium underline">
          Request a new link
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md rounded-xl bg-white shadow-sm border border-slate-200 p-6">
      <p className="mb-4">
        <Link href="/login" className="text-sm text-slate-500 hover:text-slate-700">
          ← Back to sign in
        </Link>
      </p>
      <h1 className="text-xl font-semibold text-slate-900 mb-1">Set a new password</h1>
      <p className="text-slate-500 text-sm mb-6">{SITE.brandName}</p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">
            New password (min 8 characters)
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
            autoComplete="new-password"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:ring-2 focus:ring-slate-400 focus:border-slate-400"
          />
        </div>
        <div>
          <label htmlFor="confirm" className="block text-sm font-medium text-slate-700 mb-1">
            Confirm password
          </label>
          <input
            id="confirm"
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
            minLength={8}
            autoComplete="new-password"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:ring-2 focus:ring-slate-400 focus:border-slate-400"
          />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-slate-800 text-white py-2 font-medium hover:bg-slate-700 disabled:opacity-50"
        >
          {loading ? "Saving…" : "Update password"}
        </button>
      </form>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex flex-col app-bg p-4">
      <div className="flex-1 flex items-center justify-center">
        <Suspense
          fallback={<div className="text-slate-500 text-sm">Loading…</div>}
        >
          <ResetForm />
        </Suspense>
      </div>
      <AppFooter howItWorksHref="/" />
    </div>
  );
}
