"use client";

import { Analytics as VercelAnalytics } from "@vercel/analytics/react";

/** Web vitals + page views when deployed on Vercel. No-op if not on Vercel. */
export function Analytics() {
  return <VercelAnalytics />;
}
