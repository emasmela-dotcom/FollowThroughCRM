import Link from "next/link";
import { PersonForm } from "../../PersonForm";

export default function NewPersonPage() {
  return (
    <div className="max-w-lg space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/people" className="text-sm text-slate-500 hover:text-slate-700">
          ← People
        </Link>
      </div>
      <h1 className="text-2xl font-semibold text-slate-900">Add person</h1>
      <PersonForm />
    </div>
  );
}
