import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface CountdownProps {
  date: Date | string;
  className?: string;
}

function daysUntil(date: Date | string): number {
  const target = typeof date === "string" ? new Date(date) : date;
  const startOfTarget = new Date(
    target.getFullYear(),
    target.getMonth(),
    target.getDate()
  );
  const now = new Date();
  const startOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );
  return Math.round(
    (startOfTarget.getTime() - startOfToday.getTime()) / 86_400_000
  );
}

export function formatCountdown(date: Date | string): {
  text: string;
  overdue: boolean;
  soon: boolean;
} {
  const days = daysUntil(date);

  if (days < 0) {
    const late = Math.abs(days);
    return {
      text: late === 1 ? "1 day overdue" : `${late} days overdue`,
      overdue: true,
      soon: false,
    };
  }
  if (days === 0) return { text: "Due today", overdue: false, soon: true };
  if (days === 1) return { text: "Due tomorrow", overdue: false, soon: true };
  return { text: `in ${days} days`, overdue: false, soon: days <= 3 };
}

/** Colour-coded due-date pill: emerald when comfortable, amber soon, red overdue. */
export function Countdown({ date, className }: CountdownProps) {
  const { text, overdue, soon } = formatCountdown(date);

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold",
        overdue
          ? "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300"
          : soon
            ? "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300"
            : "bg-primary-soft text-primary",
        className
      )}
    >
      <Clock className="h-3 w-3" />
      {text}
    </span>
  );
}
