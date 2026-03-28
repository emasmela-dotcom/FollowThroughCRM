"use client";

import { Analytics as VercelAnalytics } from "@vercel/analytics/react";
import { GoogleAnalytics } from "./GoogleAnalytics";

/** Vercel Analytics + optional GA4 (NEXT_PUBLIC_GA_MEASUREMENT_ID). */
export function Analytics() {
  return (
    <>
      <VercelAnalytics />
      <GoogleAnalytics />
    </>
  );
}
