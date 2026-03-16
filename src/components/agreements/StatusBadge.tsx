"use client";

type Props = { status: string };

const styles: Record<string, string> = {
  pending: "bg-amber-100 text-amber-800",
  agreed: "bg-blue-100 text-blue-800",
  done: "bg-green-100 text-green-800",
  cancelled: "bg-slate-100 text-slate-600",
};

const labels: Record<string, string> = {
  pending: "Pending",
  agreed: "Agreed",
  done: "Done",
  cancelled: "Cancelled",
};

export function StatusBadge({ status }: Props) {
  const s = status in styles ? status : "pending";
  return (
    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${styles[s]}`}>
      {labels[s] ?? status}
    </span>
  );
}
