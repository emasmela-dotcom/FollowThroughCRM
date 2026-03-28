"use client";

import Script from "next/script";
import { Suspense, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

function GaPageViews() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!GA_MEASUREMENT_ID || typeof window === "undefined") return;
    const gtag = window.gtag;
    if (!gtag) return;
    const q = searchParams.toString();
    const page_path = pathname + (q ? `?${q}` : "");
    gtag("config", GA_MEASUREMENT_ID, { page_path });
  }, [pathname, searchParams]);

  return null;
}

/** GA4 via gtag. Renders nothing when NEXT_PUBLIC_GA_MEASUREMENT_ID is unset. */
export function GoogleAnalytics() {
  if (!GA_MEASUREMENT_ID) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics-init" strategy="afterInteractive">
        {`
window.dataLayer=window.dataLayer||[];
function gtag(){dataLayer.push(arguments);}
gtag('js',new Date());
gtag('config','${GA_MEASUREMENT_ID}');
`}
      </Script>
      <Suspense fallback={null}>
        <GaPageViews />
      </Suspense>
    </>
  );
}
