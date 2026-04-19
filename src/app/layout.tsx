import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { Analytics } from "@/components/Analytics";
import { getMetadataBase } from "@/lib/publicSiteUrl";
import { SITE } from "@/lib/siteCopy";

export const metadata: Metadata = {
  metadataBase: getMetadataBase(),
  title: { default: SITE.brandName, template: `%s · ${SITE.brandName}` },
  description: SITE.description,
  keywords: [...SITE.keywords],
  openGraph: {
    title: SITE.brandName,
    description: SITE.socialDescription,
    siteName: SITE.brandName,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE.brandName,
    description: SITE.socialDescription,
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="app-bg">
        <Providers>{children}</Providers>
        <Analytics />
      </body>
    </html>
  );
}
