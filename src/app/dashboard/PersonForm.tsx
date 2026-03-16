"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  id?: string;
  defaultName?: string;
  defaultEmail?: string;
  defaultPhone?: string;
  defaultAddress?: string;
  defaultCompany?: string;
  defaultJobTitle?: string;
  defaultPreferredContact?: string;
  defaultWebsite?: string;
  defaultCategory?: string;
  defaultNotes?: string;
};

const PREFERRED_OPTIONS = ["", "Email preferred", "Call preferred", "Either"];
const CATEGORY_OPTIONS = ["", "Client", "Contractor", "Vendor", "Personal", "Other"];

export function PersonForm({
  id,
  defaultName = "",
  defaultEmail = "",
  defaultPhone = "",
  defaultAddress = "",
  defaultCompany = "",
  defaultJobTitle = "",
  defaultPreferredContact = "",
  defaultWebsite = "",
  defaultCategory = "",
  defaultNotes = "",
}: Props) {
  const [name, setName] = useState(defaultName);
  const [email, setEmail] = useState(defaultEmail);
  const [phone, setPhone] = useState(defaultPhone);
  const [address, setAddress] = useState(defaultAddress);
  const [company, setCompany] = useState(defaultCompany);
  const [jobTitle, setJobTitle] = useState(defaultJobTitle);
  const [preferredContact, setPreferredContact] = useState(defaultPreferredContact);
  const [website, setWebsite] = useState(defaultWebsite);
  const [category, setCategory] = useState(defaultCategory);
  const [notes, setNotes] = useState(defaultNotes);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const url = id ? `/api/people/${id}` : "/api/people";
    const method = id ? "PATCH" : "POST";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: name.trim(),
        email: email.trim() || null,
        phone: phone.trim() || null,
        address: address.trim() || null,
        company: company.trim() || null,
        job_title: jobTitle.trim() || null,
        preferred_contact: preferredContact || null,
        website: website.trim() || null,
        category: category || null,
        notes: notes.trim() || null,
      }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error ?? "Failed to save.");
      return;
    }
    router.push("/dashboard/people");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">Name *</label>
        <input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900"
        />
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">Email</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900"
        />
      </div>
      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
        <input
          id="phone"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="e.g. +1 555 123 4567"
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900"
        />
      </div>
      <div>
        <label htmlFor="address" className="block text-sm font-medium text-slate-700 mb-1">Address</label>
        <input
          id="address"
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Street, city, state, zip"
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900"
        />
      </div>
      <div>
        <label htmlFor="company" className="block text-sm font-medium text-slate-700 mb-1">Company / organization</label>
        <input
          id="company"
          type="text"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          placeholder="Who they work for"
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900"
        />
      </div>
      <div>
        <label htmlFor="job_title" className="block text-sm font-medium text-slate-700 mb-1">Job title / role</label>
        <input
          id="job_title"
          type="text"
          value={jobTitle}
          onChange={(e) => setJobTitle(e.target.value)}
          placeholder="e.g. Client, Contractor, Vendor"
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900"
        />
      </div>
      <div>
        <label htmlFor="preferred_contact" className="block text-sm font-medium text-slate-700 mb-1">Preferred contact</label>
        <select
          id="preferred_contact"
          value={preferredContact}
          onChange={(e) => setPreferredContact(e.target.value)}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900"
        >
          {PREFERRED_OPTIONS.map((opt) => (
            <option key={opt || "none"} value={opt}>{opt || "—"}</option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="website" className="block text-sm font-medium text-slate-700 mb-1">Website</label>
        <input
          id="website"
          type="url"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
          placeholder="https://… or LinkedIn, etc."
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900"
        />
      </div>
      <div>
        <label htmlFor="category" className="block text-sm font-medium text-slate-700 mb-1">Category</label>
        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900"
        >
          {CATEGORY_OPTIONS.map((opt) => (
            <option key={opt || "none"} value={opt}>{opt || "—"}</option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-slate-700 mb-1">Notes / other info</label>
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
        {loading ? "Saving…" : id ? "Update" : "Add person"}
      </button>
    </form>
  );
}
