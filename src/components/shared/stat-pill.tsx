import { cn } from "@/lib/utils";
import { type LucideIcon } from "lucide-react";

const toneMap = {
  default: "bg-muted text-muted-foreground",
  primary: "bg-primary-soft text-primary",
  success: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
  warning: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  danger: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
} as const;

interface StatPillProps {
  icon?: LucideIcon;
  label: string;
  value: string | number;
  tone?: keyof typeof toneMap;
  className?: string;
}

/** Small horizontal chip: icon + value + label. Used for dense info rows. */
export function StatPill({
  icon: Icon,
  label,
  value,
  tone = "default",
  className,
}: StatPillProps) {
  return (
    <div
      className={cn(
        "flex min-w-0 items-center gap-2 rounded-xl px-2.5 py-2",
        toneMap[tone],
        className
      )}
    >
      {Icon && <Icon className="h-3.5 w-3.5 shrink-0" />}
      <div className="min-w-0">
        <p className="truncate text-sm font-bold leading-none tabular">
          {value}
        </p>
        <p className="mt-1 truncate text-[10px] font-medium uppercase tracking-wide opacity-80">
          {label}
        </p>
      </div>
    </div>
  );
}
