import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { Analytics } from "@/components/Analytics";
import { SITE } from "@/lib/siteCopy";

export const metadata: Metadata = {
  title: SITE.brandName,
  description: SITE.description,
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
