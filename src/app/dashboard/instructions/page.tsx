import Link from "next/link";
import { SITE } from "@/lib/siteCopy";

export default function InstructionsPage() {
  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-2xl font-semibold text-slate-900">How it works</h1>
      <p className="text-slate-600 text-sm">
        {SITE.brandName} turns conversations into confirmed agreements. Here’s the flow.
      </p>
      <p className="text-slate-500 text-sm italic">{SITE.audienceLine}</p>

      <div className="rounded-lg border border-slate-200 bg-slate-50/80 p-4 text-sm text-slate-700">
        <p className="font-medium text-slate-900 mb-1">Single source of truth</p>
        <p>Each agreement keeps your structured record (task, due date, compensation, status) in one place. When you send the agreement link, <strong>attach your contract (PDF or Word) in the same email</strong> so the other party has the document and the link together. You get an audit trail and a clear workflow—professional agreement handling at no extra cost.</p>
      </div>

      <h2 className="text-lg font-medium text-slate-900 mt-6">How it works</h2>
      <ol className="list-decimal list-inside space-y-4 text-slate-700 text-sm">
        <li>
          <strong>Add people.</strong> Go to <Link href="/dashboard/people" className="text-slate-800 underline">People</Link> and add anyone you make agreements with (name, optional email).
        </li>
        <li>
          <strong>Add a request.</strong> From the dashboard, click <strong>Add request</strong>. Enter what you’re waiting on, who owes it (they owe you / you owe them), pick a person, set a due date and optional compensation, then save.
        </li>
        <li>
          <strong>Share the agreement link.</strong> Open the request from your dashboard, click <strong>Copy agreement link</strong>, then send that link to the other person. <strong>Attach your contract in the same email</strong> (or message) so they have the document and the link in one place.
        </li>
        <li>
          <strong>They agree or request changes.</strong> On the link they can click <strong>Agree</strong> to confirm or <strong>Request change</strong> to ask for edits. Only you (the creator) can edit the agreement after that.
        </li>
        <li>
          <strong>Mark complete.</strong> When the work is done, open the request again and click <strong>Mark complete</strong>. You can also <strong>Cancel agreement</strong> if it’s no longer needed.
        </li>
        <li>
          <strong>Get paid.</strong> Under <strong>Get paid</strong>, add your Stripe, PayPal, Venmo, or other instructions. When the agreement is complete, the other party sees those options on the public link. When money hits your account,{" "}
          <strong>Mark payment received</strong> on the request for your own records (Follow Thru doesn’t process payments).
        </li>
      </ol>

      <p className="text-slate-500 text-xs">
        The public agreement page shows a live countdown until the due date. After completion, it shows the completion date.
      </p>

      <Link href="/dashboard" className="inline-block text-sm text-slate-600 hover:text-slate-900 underline mt-6">
        ← Back to Waiting On
      </Link>
    </div>
  );
}
