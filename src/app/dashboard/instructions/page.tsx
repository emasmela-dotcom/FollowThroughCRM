import Link from "next/link";

export default function InstructionsPage() {
  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-2xl font-semibold text-slate-900">Instructions</h1>
      <p className="text-slate-600 text-sm">
        Follow Thru CRM turns conversations into confirmed agreements. Here’s how to use it.
      </p>
      <p className="text-slate-500 text-sm italic">
        Used by freelancers, contractors, and anyone who needs a clear yes.
      </p>

      <h2 className="text-lg font-medium text-slate-900 mt-6">How it works</h2>
      <ol className="list-decimal list-inside space-y-4 text-slate-700 text-sm">
        <li>
          <strong>Add people.</strong> Go to <Link href="/dashboard/people" className="text-slate-800 underline">People</Link> and add anyone you make agreements with (name, optional email).
        </li>
        <li>
          <strong>Add a request.</strong> From the dashboard, click <strong>Add request</strong>. Enter what you’re waiting on, who owes it (they owe you / you owe them), pick a person, set a due date and optional compensation, then save.
        </li>
        <li>
          <strong>Share the agreement link.</strong> Open the request from your dashboard, then click <strong>Copy agreement link</strong>. Send that link to the other person (email, text, etc.).
        </li>
        <li>
          <strong>They agree or request changes.</strong> On the link, they can click <strong>Agree</strong> to confirm or <strong>Request change</strong> to ask for edits. Only you (the creator) can edit the agreement after that.
        </li>
        <li>
          <strong>Mark complete.</strong> When the work is done, open the request again and click <strong>Mark complete</strong>. You can also <strong>Cancel agreement</strong> if it’s no longer needed.
        </li>
      </ol>

      <p className="text-slate-500 text-xs">
        The public agreement page shows a live countdown until the due date. After completion, it shows the completion date.
      </p>

      <h2 className="text-lg font-medium text-slate-900 mt-6">Setup: Neon database</h2>
      <p className="text-slate-700 text-sm">
        This app uses Neon (free tier) for the database. To set up Neon: create a project at Neon, get your connection string, and add it to the app as <code className="bg-slate-100 px-1 rounded">DATABASE_URL</code>. Full steps:
      </p>
      <a
        href="https://neon.tech/docs/get-started-with-neon"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block text-sm text-slate-800 font-medium underline underline-offset-1 hover:text-slate-600 mt-2"
      >
        How to set up Neon (official guide) →
      </a>

      <Link href="/dashboard" className="inline-block text-sm text-slate-600 hover:text-slate-900 underline mt-6">
        ← Back to Waiting On
      </Link>
    </div>
  );
}
