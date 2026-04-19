import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { HomeMarketing } from "@/components/marketing/HomeMarketing";

const marketingCheckoutUrl =
  process.env.NEXT_PUBLIC_MARKETING_CHECKOUT_URL?.trim() || "";

export default async function Home() {
  const session = await getSession();
  if (session) redirect("/dashboard");

  return <HomeMarketing marketingCheckoutUrl={marketingCheckoutUrl} />;
}
