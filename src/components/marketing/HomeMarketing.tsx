import Link from "next/link";
import { HOMEPAGE, POSITIONING_SENTENCE, SITE } from "@/lib/siteCopy";

function FeatureIcon({ id }: { id: string }) {
  const common = "h-10 w-10 text-slate-700";
  switch (id) {
    case "link":
      return (
        <svg className={common} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden>
          <path strokeLinecap="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
        </svg>
      );
    case "people":
      return (
        <svg className={common} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
          />
        </svg>
      );
    case "dates":
      return (
        <svg className={common} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5a2.25 2.25 0 002.25-2.25m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5a2.25 2.25 0 012.25 2.25v7.5" />
        </svg>
      );
    case "pay":
      return (
        <svg className={common} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
        </svg>
      );
    case "remind":
      return (
        <svg className={common} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M14.857 17.647a1.125 1.125 0 01-.668-1.03V11.25a5.25 5.25 0 10-10.5 0v5.367a1.125 1.125 0 01-.668 1.03l-.667.333a.75.75 0 00-.333 1.03v.319c0 .415.336.75.75.75h12.667a.75.75 0 00.75-.75v-.319a.75.75 0 00-.333-1.03l-.667-.333zM12 2.25a.75.75 0 01.75.75v.216a.751.751 0 01-1.5 0V3a.75.75 0 01.75-.75z"
          />
        </svg>
      );
    default:
      return (
        <svg className={common} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
        </svg>
      );
  }
}

function CtaRow({
  marketingCheckoutUrl,
  variant = "light",
}: {
  marketingCheckoutUrl: string;
  variant?: "light" | "dark";
}) {
  const primary =
    variant === "dark"
      ? "rounded-xl bg-white px-8 py-3.5 text-center text-base font-semibold text-slate-900 shadow-sm hover:bg-slate-100"
      : "rounded-xl bg-slate-900 px-8 py-3.5 text-center text-base font-semibold text-white shadow-sm hover:bg-slate-800";
  const secondary =
    variant === "dark"
      ? "rounded-xl border border-white/30 bg-transparent px-8 py-3.5 text-center text-base font-semibold text-white hover:bg-white/10"
      : "rounded-xl border border-slate-300 bg-white px-8 py-3.5 text-center text-base font-semibold text-slate-800 shadow-sm hover:bg-slate-50";
  const stripe =
    variant === "dark"
      ? "rounded-xl border border-emerald-400/40 bg-emerald-500/15 px-8 py-3.5 text-center text-base font-semibold text-emerald-100 hover:bg-emerald-500/25"
      : "rounded-xl border border-emerald-700/25 bg-emerald-50 px-8 py-3.5 text-center text-base font-semibold text-emerald-900 hover:bg-emerald-100";

  return (
    <div className="flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:flex-wrap sm:items-center">
      <Link href="/signup" className={primary}>
        Start free
      </Link>
      <Link href="/login" className={secondary}>
        Sign in
      </Link>
      {marketingCheckoutUrl ? (
        <a href={marketingCheckoutUrl} target="_blank" rel="noopener noreferrer" className={stripe}>
          {SITE.marketingCheckoutLabel}
        </a>
      ) : null}
    </div>
  );
}

export function HomeMarketing({ marketingCheckoutUrl }: { marketingCheckoutUrl: string }) {
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
          <span className="text-sm font-bold tracking-tight text-slate-900 sm:text-base">{SITE.brandName}</span>
          <nav className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/login"
              className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            >
              Sign in
            </Link>
            <Link
              href="/signup"
              className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
            >
              Get started
            </Link>
          </nav>
        </div>
      </header>

      <section className="relative overflow-hidden bg-slate-900 text-white">
        <div
          className="pointer-events-none absolute inset-0 opacity-90"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% -20%, rgb(51 65 85 / 0.55), transparent), radial-gradient(ellipse 60% 50% at 100% 50%, rgb(15 118 110 / 0.12), transparent)",
          }}
        />
        <div className="relative mx-auto max-w-6xl px-4 pb-20 pt-16 sm:pb-24 sm:pt-20">
          <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 sm:text-sm">
            {HOMEPAGE.hero.eyebrow}
          </p>
          <h1 className="mx-auto mt-4 max-w-4xl text-center text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
            {HOMEPAGE.hero.headline}
          </h1>
          <p className="mx-auto mt-6 max-w-4xl text-center text-base leading-relaxed text-slate-300 sm:text-lg sm:leading-relaxed">
            {HOMEPAGE.hero.subhead}
          </p>
          <div className="mx-auto mt-10 max-w-3xl">
            <CtaRow marketingCheckoutUrl={marketingCheckoutUrl} variant="dark" />
          </div>
          <div className="mx-auto mt-12 flex max-w-3xl flex-col gap-3 sm:flex-row sm:justify-center sm:gap-6">
            {HOMEPAGE.trustStrip.map((line) => (
              <p
                key={line}
                className="flex items-center gap-2 text-center text-sm text-slate-400 sm:text-left sm:text-base"
              >
                <span className="inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" aria-hidden />
                {line}
              </p>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-slate-200/60 bg-white" aria-label="What Follow Thru CRM is">
        <div className="mx-auto max-w-3xl px-4 py-10 sm:py-12">
          <p className="text-center text-base font-medium leading-relaxed text-slate-800 sm:text-lg sm:leading-relaxed">
            {POSITIONING_SENTENCE}
          </p>
        </div>
      </section>

      <div className="app-bg border-b border-slate-200/60">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
          <p className="text-center text-sm font-semibold uppercase tracking-wide text-slate-500">{HOMEPAGE.pain.title}</p>
          <h2 className="mx-auto mt-2 max-w-2xl text-center text-2xl font-bold text-slate-900 sm:text-3xl">
            {HOMEPAGE.pain.subtitle}
          </h2>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {HOMEPAGE.pain.items.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
              >
                <h3 className="text-lg font-semibold text-slate-900">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <section className="border-b border-slate-200/60 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
          <h2 className="text-center text-2xl font-bold text-slate-900 sm:text-3xl">Everything you need to follow through</h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-slate-600">{SITE.valueProp}</p>
          <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {HOMEPAGE.features.map((f) => (
              <div key={f.title} className="flex gap-4 rounded-2xl border border-slate-100 bg-slate-50/50 p-5">
                <div className="shrink-0 rounded-xl bg-white p-2 shadow-sm ring-1 ring-slate-200/80">
                  <FeatureIcon id={f.id} />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">{f.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{f.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="app-bg border-b border-slate-200/60">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
          <h2 className="text-center text-2xl font-bold text-slate-900 sm:text-3xl">How it works</h2>
          <p className="mx-auto mt-2 max-w-xl text-center text-slate-600">{SITE.audienceLine}</p>
          <div className="mt-12 grid gap-8 lg:grid-cols-3">
            {HOMEPAGE.steps.map((s) => (
              <div
                key={s.step}
                className="relative rounded-2xl border border-slate-200/80 bg-white p-8 pt-10 shadow-sm"
              >
                <span className="absolute left-8 top-0 -translate-y-1/2 rounded-full bg-slate-900 px-3 py-1 text-xs font-bold text-white">
                  {s.step}
                </span>
                <h3 className="text-xl font-bold text-slate-900">{s.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <section className="border-b border-slate-200/60 bg-white">
        <div className="mx-auto max-w-3xl px-4 py-16 sm:py-20">
          <h2 className="text-center text-2xl font-bold text-slate-900">Why teams pick Follow Thru</h2>
          <ul className="mt-8 space-y-4 text-slate-700">
            {SITE.whyBullets.map((line) => (
              <li key={line} className="flex gap-3 rounded-xl border border-slate-100 bg-slate-50/80 p-4 text-sm leading-relaxed sm:text-base">
                <span className="mt-0.5 font-bold text-emerald-600" aria-hidden>
                  ✓
                </span>
                <span>{line}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="app-bg border-b border-slate-200/60">
        <div className="mx-auto max-w-3xl px-4 py-16 sm:py-20">
          <h2 className="text-center text-2xl font-bold text-slate-900">Questions</h2>
          <div className="mt-8 space-y-3">
            {HOMEPAGE.faq.map((item) => (
              <details
                key={item.q}
                className="group rounded-xl border border-slate-200/80 bg-white shadow-sm open:shadow-md"
              >
                <summary className="cursor-pointer list-none px-5 py-4 font-semibold text-slate-900 marker:content-none [&::-webkit-details-marker]:hidden">
                  <span className="flex items-center justify-between gap-2">
                    {item.q}
                    <span className="text-slate-400 transition group-open:rotate-180" aria-hidden>
                      ▼
                    </span>
                  </span>
                </summary>
                <p className="border-t border-slate-100 px-5 pb-4 pt-3 text-sm leading-relaxed text-slate-600">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-900 py-16 text-white sm:py-20">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">{HOMEPAGE.finalCta.title}</h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-slate-300">{HOMEPAGE.finalCta.sub}</p>
          <div className="mx-auto mt-10 max-w-xl">
            <CtaRow marketingCheckoutUrl={marketingCheckoutUrl} variant="dark" />
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-200/80 bg-white py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 text-center text-sm text-slate-500 sm:flex-row sm:text-left">
          <p>
            © {new Date().getFullYear()} {SITE.brandName}. {SITE.tagline}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/signup" className="font-medium text-slate-700 hover:text-slate-900">
              Sign up
            </Link>
            <Link href="/login" className="font-medium text-slate-700 hover:text-slate-900">
              Sign in
            </Link>
            {marketingCheckoutUrl ? (
              <a
                href={marketingCheckoutUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-emerald-800 hover:text-emerald-950"
              >
                {SITE.marketingCheckoutLabel}
              </a>
            ) : null}
          </div>
        </div>
      </footer>
    </div>
  );
}
