import Link from "next/link";

type Props = {
  peopleCount: number;
  activePromiseCount: number;
};

export function OnboardingChecklist({ peopleCount, activePromiseCount }: Props) {
  const hasPeople = peopleCount > 0;
  const hasRequest = activePromiseCount > 0;
  if (hasPeople && hasRequest) return null;

  return (
    <div className="rounded-xl border border-blue-200 bg-blue-50/80 p-4 border-l-4 border-l-blue-500">
      <h2 className="text-sm font-semibold text-blue-950">Get started</h2>
      <p className="text-xs text-blue-900/80 mt-1">
        Complete these steps once—then your <strong>Waiting On</strong> list becomes your home base.
      </p>
      <ol className="mt-3 space-y-2 text-sm text-blue-950">
        <li className="flex gap-2">
          <span className="shrink-0 font-mono text-xs w-5">{hasPeople ? "✓" : "1"}</span>
          <span>
            {hasPeople ? (
              <span className="text-blue-800">People added</span>
            ) : (
              <>
                <Link href="/dashboard/people/new" className="font-medium underline underline-offset-1">
                  Add someone
                </Link>{" "}
                you make agreements with (name + email for sending links).
              </>
            )}
          </span>
        </li>
        <li className="flex gap-2">
          <span className="shrink-0 font-mono text-xs w-5">{hasRequest ? "✓" : "2"}</span>
          <span>
            {hasRequest ? (
              <span className="text-blue-800">First request created</span>
            ) : (
              <>
                <Link href="/dashboard/promises/new" className="font-medium underline underline-offset-1">
                  Create a request
                </Link>{" "}
                (what you’re waiting on, due date, optional compensation).
              </>
            )}
          </span>
        </li>
        <li className="flex gap-2">
          <span className="shrink-0 font-mono text-xs w-5">3</span>
          <span>
            Open the request → <strong>Copy agreement link</strong> → send it (attach your contract in the same email if you use one).{" "}
            <Link href="/dashboard/instructions" className="underline underline-offset-1">
              Full walkthrough
            </Link>
          </span>
        </li>
      </ol>
    </div>
  );
}
