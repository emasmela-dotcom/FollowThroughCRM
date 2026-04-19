/** Single source of truth for public-facing product copy. */

/** Canonical positioning — meta, Open Graph / Twitter, and first full paragraph on the homepage. */
export const POSITIONING_SENTENCE =
  "Follow Thru CRM is a lightweight tool for freelancers and contractors to turn verbal or informal agreements into a single shareable link, track status and due dates, and attach their own payment methods (e.g. Stripe Payment Links)—without a sales pipeline." as const;

/** First paragraph under the homepage hero headline (scannable; rest in POSITIONING_SENTENCE + meta). */
export const POSITIONING_HERO_LEAD =
  "Follow Thru CRM is a lightweight tool for freelancers and contractors to turn verbal or informal agreements into a single shareable link, track status and due dates, and attach their own payment methods." as const;

export const SITE = {
  brandName: "Follow Thru CRM",
  /** Same as hero subhead — dashboard header, onboarding, footer where SITE.tagline is used. */
  tagline: POSITIONING_HERO_LEAD,
  /** One-line SEO description — flows to <meta name="description"> */
  description: POSITIONING_SENTENCE,
  /** Open Graph / Twitter description */
  socialDescription: POSITIONING_SENTENCE,
  audienceLine: "Built for freelancers, contractors, and anyone who needs a clear yes.",
  /** Product positioning: utility + money */
  valueProp:
    "Run your agreements and follow-ups in one place—then collect payment with your own links (Stripe, PayPal, and more) when the work is done.",
  /** Homepage marketing bullets */
  whyBullets: [
    "One link for the other party to read, agree, or request changes—no thread hunting.",
    "Due dates, status, and payment options (Stripe Payment Links, PayPal, and more) in one record.",
    "Optional email reminders when Resend is configured—stay on top without nagging manually.",
  ],
  /** CTA label when NEXT_PUBLIC_MARKETING_CHECKOUT_URL is set (Stripe Payment Link, etc.) */
  marketingCheckoutLabel: "Support Follow Thru",
  keywords: [
    "agreement tracking",
    "freelancer CRM",
    "contractor CRM",
    "verbal agreement",
    "Stripe payment link",
    "follow through",
    "promise tracking",
    "handshake deal",
    "client agreement",
    "payment reminders",
    "shareable contract link",
    "small business CRM",
  ],
} as const;

/** Long-form homepage sections — keep copy honest (no fake metrics). */
export const HOMEPAGE = {
  hero: {
    eyebrow: "Agreement tracking without the enterprise bloat",
    headline: "Get the yes. Ship the work. Get paid.",
    /** Shown under the headline in the dark hero (POSITIONING_HERO_LEAD). */
    subhead: POSITIONING_HERO_LEAD,
  },
  trustStrip: [
    "Sign up in under a minute",
    "You keep your money—Stripe & PayPal are your links, not ours",
    "Built for freelancers, contractors, and side hustles",
  ],
  pain: {
    title: "Sound familiar?",
    subtitle: "Most \"deals\" die in the inbox—not because people are bad, but because nobody owns the thread.",
    items: [
      {
        title: "Which thread had the final terms?",
        body: "Texts, email, and voice notes do not give you one place to point to when something slips.",
      },
      {
        title: "Who owes who, and by when?",
        body: "Promises without a due date and a status become awkward follow-ups instead of facts.",
      },
      {
        title: "Payment feels like a second job",
        body: "You should paste your Stripe Payment Link or PayPal once—not retype it every time someone asks how to pay.",
      },
    ],
  },
  features: [
    {
      id: "link",
      title: "One agreement link",
      body: "Send a single URL. They read, agree, or request a change—everything stays tied to that promise.",
    },
    {
      id: "people",
      title: "People you actually work with",
      body: "Keep contacts alongside promises so you always know who you are waiting on—and for what.",
    },
    {
      id: "dates",
      title: "Due dates that mean something",
      body: "Set deadlines, track status, and mark complete when the work is done. No pipeline stages you will never use.",
    },
    {
      id: "pay",
      title: "Your payment stack",
      body: "Attach Stripe Payment Links, PayPal, Venmo, Zelle, Cash App, or bank notes—whatever you already use.",
    },
    {
      id: "remind",
      title: "Optional reminders",
      body: "Wire Resend once and let the app nudge you on reminders—still optional if you prefer all manual.",
    },
    {
      id: "simple",
      title: "No CRM school required",
      body: "Create, share, complete. Three steps. If you can send a link, you can run Follow Thru.",
    },
  ],
  steps: [
    {
      step: "01",
      title: "Create",
      body: "Add a request, set a due date, and get a shareable agreement link.",
    },
    {
      step: "02",
      title: "Share",
      body: "Send the link—and attach your contract in the same email. The other party agrees or requests changes in one place.",
    },
    {
      step: "03",
      title: "Complete",
      body: "Track due dates, mark done, and keep everyone aligned. Professional handling without enterprise complexity.",
    },
  ],
  faq: [
    {
      q: "Is Follow Thru a replacement for a lawyer?",
      a: "No. Follow Thru helps you organize commitments and links—it is not legal advice. Use a professional for contracts that need review.",
    },
    {
      q: "Do you take a cut of payments?",
      a: "No. Payments go through links you provide (for example Stripe Payment Links or PayPal). We do not sit in the middle of your money.",
    },
    {
      q: "What does it cost?",
      a: "Sign up and use the product; hosting costs are on us for the deployed app. If you add optional email (Resend), that provider has its own pricing.",
    },
    {
      q: "Can I export or leave?",
      a: "Your data is yours. The app is straightforward—if you need a full export feature later, that is a fair product request.",
    },
  ],
  finalCta: {
    title: "Ready to stop losing deals to the inbox?",
    sub: "Create your first promise in a minute. No credit card.",
  },
} as const;
