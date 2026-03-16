"use client";

type Props = {
  dueAt: string | null;
  status: string;
  completedAt?: string | null;
};

export function AgreementCountdown({ dueAt, status, completedAt }: Props) {
  if (status === "done" && completedAt) {
    const completed = new Date(completedAt);
    const due = dueAt ? new Date(dueAt) : null;
    let extra = "";
    if (due) {
      due.setHours(0, 0, 0, 0);
      completed.setHours(0, 0, 0, 0);
      const diff = Math.round((completed.getTime() - due.getTime()) / (1000 * 60 * 60 * 24));
      if (diff < 0) extra = ` (${Math.abs(diff)} days before due)`;
      if (diff > 0) extra = ` (${diff} days after due)`;
    }
    return (
      <span className="text-green-600 text-sm">
        Completed on {new Date(completedAt).toLocaleDateString()}
        {extra && <span className="text-slate-500">{extra}</span>}
      </span>
    );
  }
  if (!dueAt) return <span className="text-slate-500 text-sm">No due date set</span>;
  const due = new Date(dueAt);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  due.setHours(0, 0, 0, 0);
  const diff = Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  if (diff < 0)
    return <span className="text-amber-600 text-sm">{Math.abs(diff)} days overdue</span>;
  if (diff === 0) return <span className="text-amber-600 text-sm">Due today</span>;
  if (diff === 1) return <span className="text-slate-600 text-sm">Due tomorrow</span>;
  return <span className="text-slate-600 text-sm">Due in {diff} days</span>;
}
