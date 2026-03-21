"use client";

import { useState, useCallback } from "react";

type PaymentOptions = {
  stripeLink?: string | null;
  paypalLink?: string | null;
  cashAppTag?: string | null;
  venmoUser?: string | null;
  zelleContact?: string | null;
  bankNotes?: string | null;
};

interface Props {
  value: PaymentOptions;
  onChange?: (value: PaymentOptions) => void;
}

function StripeIcon() {
  return (
    <svg viewBox="0 0 32 32" className="h-4 w-4" aria-hidden="true">
      <rect width="32" height="32" rx="6" fill="#635BFF" />
      <path
        d="M14.2 12.6c0-.9.7-1.2 1.9-1.2 1.7 0 3.8.5 5.5 1.4V8.4C19.8 7.5 18 7 16.1 7c-4 0-6.7 2.1-6.7 5.6 0 5.5 7.5 4.6 7.5 7 0 1-.9 1.4-2.1 1.4-1.8 0-4.2-.8-6-1.8v4.5c2 .9 4.1 1.3 6 1.3 4.1 0 6.9-2 6.9-5.6-.1-5.9-7.5-4.9-7.5-6.8z"
        fill="#fff"
      />
    </svg>
  );
}

function PayPalIcon() {
  return (
    <svg viewBox="0 0 32 32" className="h-4 w-4" aria-hidden="true">
      <rect width="32" height="32" rx="6" fill="#003087" />
      <path
        d="M22.5 10.5c.3 2.2-.9 4.7-3.1 5.9-.5.3-1.1.4-1.7.4h-3.3l-.8 5H11l2.4-13.5h5.6c1.9 0 3.3.8 3.5 2.2z"
        fill="#009CDE"
      />
      <path
        d="M25 13c.2 1.8-.7 3.8-2.4 4.9-.5.3-1 .5-1.6.5h-2.8l-.7 4.1h-2.6l2.1-11.4h4.8c1.7 0 2.9.7 3.2 1.9z"
        fill="#fff"
        opacity=".8"
      />
    </svg>
  );
}

function CashAppIcon() {
  return (
    <svg viewBox="0 0 32 32" className="h-4 w-4" aria-hidden="true">
      <rect width="32" height="32" rx="6" fill="#00D632" />
      <path
        d="M18.7 10.3l-.6-1.8c-.1-.3-.4-.5-.7-.5h-2.8c-.3 0-.6.2-.7.5l-.6 1.8C11.2 10.8 9 13.1 9 16s2.2 5.2 5.3 5.7l.6 1.8c.1.3.4.5.7.5h2.8c.3 0 .6-.2.7-.5l.6-1.8C22.8 21.2 25 18.9 25 16s-2.2-5.2-6.3-5.7zm-2.7 9a3.3 3.3 0 110-6.6 3.3 3.3 0 010 6.6z"
        fill="#fff"
      />
    </svg>
  );
}

function VenmoIcon() {
  return (
    <svg viewBox="0 0 32 32" className="h-4 w-4" aria-hidden="true">
      <rect width="32" height="32" rx="6" fill="#3D95CE" />
      <path
        d="M21.5 8c.7 1.2 1 2.5 1 4 0 4.2-3.6 9.6-6.5 13.4h-4.3L9.5 8.8l4-.4 1.2 9.5c1.1-1.9 2.5-4.8 2.5-6.8 0-1.1-.2-1.8-.5-2.5L21.5 8z"
        fill="#fff"
      />
    </svg>
  );
}

function ZelleIcon() {
  return (
    <svg viewBox="0 0 32 32" className="h-4 w-4" aria-hidden="true">
      <rect width="32" height="32" rx="6" fill="#6D1ED4" />
      <path
        d="M22 10h-8.5l-4.5 6 4.5 6H22v-3h-6.3l-2.7-3 2.7-3H22v-3z"
        fill="#fff"
      />
    </svg>
  );
}

function BankIcon() {
  return (
    <svg viewBox="0 0 32 32" className="h-4 w-4" aria-hidden="true">
      <rect width="32" height="32" rx="6" fill="#64748b" />
      <path
        d="M16 7l9 5v1H7v-1l9-5zm-7 7h2v7H9v-7zm5 0h2v7h-2v-7zm5 0h2v7h-2v-7zm-9 8h12v2H7v-2z"
        fill="#fff"
      />
    </svg>
  );
}

function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const el = document.createElement("textarea");
      el.value = value;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [value]);

  return (
    <button
      type="button"
      onClick={handleCopy}
      disabled={!value}
      title={copied ? "Copied!" : "Copy to clipboard"}
      className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-30"
    >
      {copied ? (
        <svg
          className="h-4 w-4 text-emerald-500"
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            d="M2.5 8.5l3.5 3.5 7-7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ) : (
        <svg
          className="h-4 w-4"
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <rect x="5" y="5" width="8" height="9" rx="1.5" />
          <path
            d="M11 5V4a1.5 1.5 0 00-1.5-1.5h-6A1.5 1.5 0 002 4v7A1.5 1.5 0 003.5 12.5H5"
            strokeLinecap="round"
          />
        </svg>
      )}
    </button>
  );
}

function validateField(key: keyof PaymentOptions, value: string): string | null {
  if (!value) return null;

  switch (key) {
    case "stripeLink":
    case "paypalLink":
      try {
        new URL(value);
        return null;
      } catch {
        return "Please enter a valid URL (e.g. https://…)";
      }
    case "cashAppTag":
      return value.startsWith("$")
        ? null
        : 'Must start with "$" (e.g. $yourhandle)';
    case "venmoUser":
      return value.startsWith("@")
        ? null
        : 'Must start with "@" (e.g. @yourname)';
    default:
      return null;
  }
}

interface FieldProps {
  icon: React.ReactNode;
  label: string;
  hint: string;
  error: string | null;
  children: React.ReactNode;
}

function Field({ icon, label, hint, error, children }: FieldProps) {
  return (
    <div className="space-y-1.5">
      <label className="flex items-center gap-1.5 text-sm font-medium text-slate-700">
        {icon}
        {label}
      </label>
      {children}
      {error ? (
        <p className="flex items-center gap-1 text-xs text-red-600">
          <svg
            className="h-3 w-3 shrink-0"
            viewBox="0 0 12 12"
            fill="currentColor"
          >
            <path d="M6 1a5 5 0 100 10A5 5 0 006 1zm-.75 2.75a.75.75 0 011.5 0v2.5a.75.75 0 01-1.5 0v-2.5zm.75 5.5a.75.75 0 110-1.5.75.75 0 010 1.5z" />
          </svg>
          {error}
        </p>
      ) : (
        <p className="text-xs text-slate-500">{hint}</p>
      )}
    </div>
  );
}

export default function PaymentOptionsSection({ value, onChange }: Props) {
  const [touched, setTouched] = useState<
    Partial<Record<keyof PaymentOptions, boolean>>
  >({});

  const opts: PaymentOptions = {
    stripeLink: value?.stripeLink ?? "",
    paypalLink: value?.paypalLink ?? "",
    cashAppTag: value?.cashAppTag ?? "",
    venmoUser: value?.venmoUser ?? "",
    zelleContact: value?.zelleContact ?? "",
    bankNotes: value?.bankNotes ?? "",
  };

  function update<K extends keyof PaymentOptions>(key: K, v: string) {
    if (!onChange) return;
    onChange({ ...opts, [key]: v });
  }

  function touch(key: keyof PaymentOptions) {
    setTouched((prev) => ({ ...prev, [key]: true }));
  }

  function err(key: keyof PaymentOptions) {
    if (!touched[key]) return null;
    return validateField(key, (opts[key] ?? "") as string);
  }

  const inputBase =
    "w-full rounded-lg border px-3 py-2 text-sm text-slate-900 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent";

  function inputCls(key: keyof PaymentOptions, hasCopy = false) {
    const hasError = !!err(key);
    return [
      inputBase,
      hasError ? "border-red-400 bg-red-50" : "border-slate-300 bg-white",
      hasCopy ? "pr-10" : "",
    ]
      .join(" ")
      .trim();
  }

  return (
    <section className="mt-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">Get paid</h2>
        <p className="text-sm text-slate-600 mt-1">
          Add Stripe, PayPal, Venmo, Zelle, etc. Only fields you fill show on the public agreement. When the work is complete, they pay you through your links—Follow Thru doesn’t process or hold funds.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Field
          icon={<StripeIcon />}
          label="Stripe payment link"
          hint="Optional. Paste a Stripe Payment Link or Checkout URL."
          error={err("stripeLink")}
        >
          <input
            type="url"
            value={opts.stripeLink ?? ""}
            onChange={(e) => update("stripeLink", e.target.value)}
            onBlur={() => touch("stripeLink")}
            placeholder="https://buy.stripe.com/..."
            className={inputCls("stripeLink")}
          />
        </Field>

        <Field
          icon={<PayPalIcon />}
          label="PayPal.me link"
          hint="Optional. People will be taken to PayPal to complete payment."
          error={err("paypalLink")}
        >
          <input
            type="url"
            value={opts.paypalLink ?? ""}
            onChange={(e) => update("paypalLink", e.target.value)}
            onBlur={() => touch("paypalLink")}
            placeholder="https://paypal.me/yourname/150"
            className={inputCls("paypalLink")}
          />
        </Field>

        <Field
          icon={<CashAppIcon />}
          label="Cash App $cashtag"
          hint='People can open Cash App and send to this $cashtag.'
          error={err("cashAppTag")}
        >
          <div className="relative">
            <input
              type="text"
              value={opts.cashAppTag ?? ""}
              onChange={(e) => update("cashAppTag", e.target.value)}
              onBlur={() => touch("cashAppTag")}
              placeholder="$yourhandle"
              className={inputCls("cashAppTag", true)}
            />
            <CopyButton value={opts.cashAppTag ?? ""} />
          </div>
        </Field>

        <Field
          icon={<VenmoIcon />}
          label="Venmo username"
          hint="People can open Venmo and pay this username."
          error={err("venmoUser")}
        >
          <div className="relative">
            <input
              type="text"
              value={opts.venmoUser ?? ""}
              onChange={(e) => update("venmoUser", e.target.value)}
              onBlur={() => touch("venmoUser")}
              placeholder="@yourname"
              className={inputCls("venmoUser", true)}
            />
            <CopyButton value={opts.venmoUser ?? ""} />
          </div>
        </Field>

        <Field
          icon={<ZelleIcon />}
          label="Zelle email or phone"
          hint="People can use their banking app to send via Zelle."
          error={err("zelleContact")}
        >
          <div className="relative">
            <input
              type="text"
              value={opts.zelleContact ?? ""}
              onChange={(e) => update("zelleContact", e.target.value)}
              onBlur={() => touch("zelleContact")}
              placeholder="email or phone linked to Zelle"
              className={inputCls("zelleContact", true)}
            />
            <CopyButton value={opts.zelleContact ?? ""} />
          </div>
        </Field>

        <Field
          icon={<BankIcon />}
          label="Bank transfer notes"
          hint="Shown as text on the public page for manual transfers."
          error={err("bankNotes")}
        >
          <div className="relative">
            <textarea
              value={opts.bankNotes ?? ""}
              onChange={(e) => update("bankNotes", e.target.value)}
              onBlur={() => touch("bankNotes")}
              placeholder="Bank name, last 4 digits, any reference you prefer"
              rows={3}
              className={[inputCls("bankNotes"), "resize-none pr-10"].join(" ")}
            />
            <button
              type="button"
              onClick={async () => {
                const val = opts.bankNotes ?? "";
                if (!val) return;
                await navigator.clipboard.writeText(val);
              }}
              disabled={!opts.bankNotes}
              title="Copy to clipboard"
              className="absolute right-2 top-2 rounded-md p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-30"
            >
              <svg
                className="h-4 w-4"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <rect x="5" y="5" width="8" height="9" rx="1.5" />
                <path
                  d="M11 5V4a1.5 1.5 0 00-1.5-1.5h-6A1.5 1.5 0 002 4v7A1.5 1.5 0 003.5 12.5H5"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>
        </Field>
      </div>
    </section>
  );
}

