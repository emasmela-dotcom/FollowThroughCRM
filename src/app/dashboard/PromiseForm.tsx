"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Person = {
  id: string;
  name: string;
};

type PromiseFormProps = {
  people: Person[];
  promiseId?: string;
  defaultTitle?: string;
  defaultDirection?: "they_owe" | "i_owe";
  defaultPersonId?: string | null;
  defaultDueAt?: string | null;
  defaultNotes?: string | null;
  defaultCompensation?: string | null;
  defaultMessageToOther?: string | null;
};

export function PromiseForm({
  people,
  promiseId,
  defaultTitle = "",
  defaultDirection = "they_owe",
  defaultPersonId = "",
  defaultDueAt = "",
  defaultNotes = "",
  defaultCompensation = "",
  defaultMessageToOther = "",
}: PromiseFormProps) {
  const router = useRouter();

  const [title, setTitle] = useState(defaultTitle);
  const [direction, setDirection] = useState(defaultDirection);
  const [personId, setPersonId] = useState(defaultPersonId ?? "");
  const [dueAt, setDueAt] = useState(defaultDueAt ? String(defaultDueAt).slice(0, 10) : "");
  const [notes, setNotes] = useState(defaultNotes ?? "");
  const [compensation, setCompensation] = useState(defaultCompensation ?? "");
  const [messageToOther, setMessageToOther] = useState(defaultMessageToOther ?? "");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const body = {
      title,
      direction,
      person_id: personId || null,
      due_at: dueAt || null,
      notes: notes || null,
      compensation: compensation || null,
      message_to_other: messageToOther.trim() || null,
    };

    const res = await fetch(
      promiseId ? `/api/promises/${promiseId}` : "/api/promises",
      {
        method: promiseId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }
    );

    setLoading(false);

    if (res.ok) {
      router.push("/dashboard");
      router.refresh();
    } else {
      alert("Something went wrong.");
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-lg border border-slate-200 border-l-4 border-l-slate-400 shadow-md space-y-4"
    >
      <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
        What & who
      </p>

      <div>
        <label className="block text-sm font-medium mb-1 text-slate-700">What / request</label>
        <input
          type="text"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Quote by Friday, Documents from Sarah"
          className="w-full border border-slate-300 rounded-md px-3 py-2 text-slate-900"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2 text-slate-700">Who</label>

        <div className="flex gap-4">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="direction"
              value="they_owe"
              checked={direction === "they_owe"}
              onChange={() => setDirection("they_owe")}
            />
            They owe you
          </label>

          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="direction"
              value="i_owe"
              checked={direction === "i_owe"}
              onChange={() => setDirection("i_owe")}
            />
            You owe them
          </label>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1 text-slate-700">Person</label>

        <select
          value={personId}
          onChange={(e) => setPersonId(e.target.value)}
          className="w-full border border-slate-300 rounded-md px-3 py-2 text-slate-900"
        >
          <option value="">—</option>

          {people.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>

      <p className="text-xs font-medium text-slate-500 uppercase pt-2 tracking-wide">
        When & terms
      </p>

      <div>
        <label className="block text-sm font-medium mb-1 text-slate-700">Due date</label>
        <input
          type="date"
          value={dueAt}
          onChange={(e) => setDueAt(e.target.value)}
          className="w-full border border-slate-300 rounded-md px-3 py-2 text-slate-900"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1 text-slate-700">
          Compensation (optional)
        </label>
        <input
          type="text"
          value={compensation}
          onChange={(e) => setCompensation(e.target.value)}
          placeholder="e.g. $150, 2 hours"
          className="w-full border border-slate-300 rounded-md px-3 py-2 text-slate-900"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1 text-slate-700">
          Message to them (optional)
        </label>
        <p className="text-xs text-slate-500 mb-1">
          They’ll see this on the agreement link and in the email if you send the link from here.
        </p>
        <textarea
          value={messageToOther}
          onChange={(e) => setMessageToOther(e.target.value)}
          placeholder="e.g. Thanks for the quick turnaround — please confirm by Friday."
          className="w-full border border-slate-300 rounded-md px-3 py-2 text-slate-900"
          rows={3}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1 text-slate-700">Notes</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full border border-slate-300 rounded-md px-3 py-2 text-slate-900"
          rows={3}
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-slate-800 text-white rounded-lg px-5 py-2.5 text-sm font-semibold hover:bg-slate-700 disabled:opacity-50"
      >
        {loading ? "Saving..." : promiseId ? "Update" : "Add request"}
      </button>
    </form>
  );
}
