"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import PaymentOptionsSection from "./PaymentOptionsSection";

type PaymentOptions = {
  stripeLink?: string | null;
  paypalLink?: string | null;
  cashAppTag?: string | null;
  venmoUser?: string | null;
  zelleContact?: string | null;
  bankNotes?: string | null;
};

interface Props {
  promiseId: string;
  initial: PaymentOptions;
}

export default function PaymentOptionsSectionWrapper({
  promiseId,
  initial,
}: Props) {
  const router = useRouter();
  const [value, setValue] = useState<PaymentOptions>(initial);
  const [, startTransition] = useTransition();

  async function handleChange(next: PaymentOptions) {
    setValue(next);

    await fetch(`/api/promises/${promiseId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        stripe_link: next.stripeLink ?? null,
        paypal_link: next.paypalLink ?? null,
        cash_app_tag: next.cashAppTag ?? null,
        venmo_user: next.venmoUser ?? null,
        zelle_contact: next.zelleContact ?? null,
        bank_notes: next.bankNotes ?? null,
      }),
    });

    startTransition(() => router.refresh());
  }

  return <PaymentOptionsSection value={value} onChange={handleChange} />;
}

