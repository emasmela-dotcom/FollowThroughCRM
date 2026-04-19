/**
 * Public site origin for metadata, emails, etc.
 * NEXTAUTH_URL on Vercel is sometimes set without `https://`, which breaks `new URL()`.
 */
export function getPublicSiteOrigin(): string {
  const fromAuth = process.env.NEXTAUTH_URL?.trim().replace(/\/$/, "") || "";
  const fromVercel = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "";
  const raw = fromAuth || fromVercel || "http://localhost:3000";
  if (raw.startsWith("http://") || raw.startsWith("https://")) return raw;
  return `https://${raw}`;
}

export function getMetadataBase(): URL {
  try {
    return new URL(getPublicSiteOrigin());
  } catch {
    return new URL("http://localhost:3000");
  }
}
