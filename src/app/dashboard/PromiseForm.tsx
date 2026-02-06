"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Person = { id: string; name: string };

type Props = {
  promiseId?: string;
  people: Person[];
  defaultTitle?: string;
  defaultDirection?: "i_owe" | "they_owe";
  defaultPersonId?: string | null;
  defaultDueAt?: string | null;
  defaultNotes?: string | null;
};

export function PromiseForm({
  promiseId,
  people,
  defaultTitle = "",
  defaultDirection = "they_owe",
  defaultPersonId = null,
  defaultDueAt = null,
  defaultNotes = null,
}: Props) {
  const [title, setTitle] = useState(defaultTitle);
  const [direction, setDirection] = useState<"i_owe" | "they_owe">(defaultDirection);
  const [personId, setPersonId] = useState(defaultPersonId ?? "");
  const [dueAt, setDueAt] = useState(defaultDueAt ? String(defaultDueAt).slice(0, 10) : "");
  const [notes, setNotes] = useState(defaultNotes ?? "");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const url = promiseId ? `/api/promises/${promiseId}` : "/api/promises";
    const method = promiseId ? "PATCH" : "POST";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: title.trim(),
        direction,
        person_id: personId || null,
        due_at: dueAt || null,
        notes: notes.trim() || null,
      }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error ?? "Failed to save.");
      return;
    }
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-slate-700 mb-1">What / request *</label>
        <input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          placeholder="e.g. Quote by Friday, Documents from Sarah"
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">Who</label>
        <div className="flex gap-4">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="direction"
              checked={direction === "they_owe"}
              onChange={() => setDirection("they_owe")}
            />
            <span className="text-sm">They owe you</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="direction"
              checked={direction === "i_owe"}
              onChange={() => setDirection("i_owe")}
            />
            <span className="text-sm">You owe them</span>
          </label>
        </div>
      </div>
      <div>
        <label htmlFor="person" className="block text-sm font-medium text-slate-700 mb-1">Person</label>
        <select
          id="person"
          value={personId}
          onChange={(e) => setPersonId(e.target.value)}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900"
        >
          <option value="">—</option>
          {people.map((p) => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="due_at" className="block text-sm font-medium text-slate-700 mb-1">Due date</label>
        <input
          id="due_at"
          type="date"
          value={dueAt}
          onChange={(e) => setDueAt(e.target.value)}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900"
        />
      </div>
      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-slate-700 mb-1">Notes</label>
        <textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900"
        />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:opacity-50"
      >
        {loading ? "Saving…" : promiseId ? "Update" : "Add request"}
      </button>
    </form>
  );
}
