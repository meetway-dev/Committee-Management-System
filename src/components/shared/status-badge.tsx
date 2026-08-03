import { cn } from "@/lib/utils";

const statusConfig: Record<string, { label: string; className: string }> = {
  active: { label: "Active", className: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300" },
  approved: { label: "Paid", className: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300" },
  draft: { label: "Draft", className: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300" },
  pending: { label: "Pending", className: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300" },
  completed: { label: "Completed", className: "bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300" },
  archived: { label: "Archived", className: "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400" },
  rejected: { label: "Rejected", className: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300" },
  late: { label: "Late", className: "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300" },
  overdue: { label: "Overdue", className: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300" },
  removed: { label: "Removed", className: "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400" },
  left: { label: "Left", className: "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400" },
  scheduled: { label: "Scheduled", className: "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300" },
  skipped: { label: "Skipped", className: "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400" },
  open: { label: "Open", className: "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300" },
  "in-progress": { label: "In Progress", className: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300" },
  resolved: { label: "Resolved", className: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300" },
  closed: { label: "Closed", className: "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400" },
  admin: { label: "Admin", className: "bg-primary-soft text-primary" },
  member: { label: "Member", className: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300" },
};

interface StatusBadgeProps {
  status: string;
  className?: string;
  /** Renders a leading dot for extra scannability in dense lists. */
  dot?: boolean;
}

/** Colour-coded status pill. Same status vocabulary as before — restyled only. */
export function StatusBadge({ status, className, dot }: StatusBadgeProps) {
  const config = statusConfig[status] || {
    label: status,
    className: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
  };

  return (
    <span
      className={cn(
        "inline-flex h-[22px] shrink-0 items-center gap-1 rounded-full px-2.5 text-[11px] font-semibold whitespace-nowrap capitalize",
        config.className,
        className
      )}
    >
      {dot && <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />}
      {config.label}
    </span>
  );
}
