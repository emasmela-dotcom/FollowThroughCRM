"use client";

import { useState } from "react";
import Link from "next/link";
import { AppFooter } from "@/components/AppFooter";
import { SITE } from "@/lib/siteCopy";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const text = await res.text();
      let data: { error?: string; message?: string } = {};
      try {
        data = text ? (JSON.parse(text) as typeof data) : {};
      } catch {
        setError(`Server returned an invalid response (${res.status}). Try again or check Vercel logs.`);
        return;
      }
      if (!res.ok) {
        setError(typeof data.error === "string" ? data.error : "Something went wrong.");
        return;
      }
      setMessage(typeof data.message === "string" ? data.message : "Check your email.");
      setEmail("");
    } catch {
      setError("Network error. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col app-bg p-4">
      <div className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-md rounded-xl bg-white shadow-sm border border-slate-200 p-6">
          <p className="mb-4">
            <Link href="/login" className="text-sm text-slate-500 hover:text-slate-700">
              ← Back to sign in
            </Link>
          </p>
          <h1 className="text-xl font-semibold text-slate-900 mb-1">Forgot password</h1>
          <p className="text-slate-600 text-sm mb-4">
            Enter the email you used to sign up. We will send a reset link if an account exists.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:ring-2 focus:ring-slate-400 focus:border-slate-400"
              />
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            {message && <p className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2">{message}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-slate-800 text-white py-2 font-medium hover:bg-slate-700 disabled:opacity-50"
            >
              {loading ? "Sending…" : "Send reset link"}
            </button>
          </form>

          <details className="mt-6 text-sm text-slate-600 border-t border-slate-200 pt-4">
            <summary className="cursor-pointer text-slate-700 font-medium">No email? Admin / self-hosted reset</summary>
            <p className="mt-2 mb-2">
              If this app does not have <code className="text-xs bg-slate-100 px-1 rounded">RESEND_API_KEY</code> set, reset
              emails are not sent. Anyone with database access can set a new password from the project folder:
            </p>
            <pre className="p-3 bg-slate-900 text-slate-100 text-xs rounded-lg overflow-x-auto">
              npm run reset-password -- your@email.com YourNewPassword8+
            </pre>
            <p className="mt-2 text-xs text-slate-500">
              Use the same <code className="bg-slate-100 px-1 rounded">DATABASE_URL</code> as production (e.g. in{" "}
              <code className="bg-slate-100 px-1 rounded">.env.local</code>).
            </p>
          </details>
        </div>
      </div>
      <AppFooter howItWorksHref="/" />
    </div>
  );
}
