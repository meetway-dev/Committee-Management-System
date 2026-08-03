import { cn } from "@/lib/utils";
import { type LucideIcon, TrendingUp, TrendingDown } from "lucide-react";

const toneMap = {
  primary: "bg-primary-soft text-primary",
  success: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
  warning: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  danger: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
  neutral: "bg-muted text-muted-foreground",
} as const;

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  tone?: keyof typeof toneMap;
  trend?: {
    value: number;
    direction: "up" | "down" | "neutral";
  };
  className?: string;
}

/**
 * Compact stat tile. Value leads (large, bold), label follows — per the
 * fintech hierarchy where the number is the primary information.
 */
export function StatCard({
  title,
  value,
  description,
  icon: Icon,
  tone = "primary",
  trend,
  className,
}: StatCardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl bg-card p-3 ring-1 ring-foreground/[0.06] shadow-[0_1px_2px_rgba(11,21,18,0.04)] transition-all duration-150 hover:ring-primary/20",
        className
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <span
          className={cn(
            "flex h-7 w-7 items-center justify-center rounded-lg",
            toneMap[tone]
          )}
        >
          <Icon className="h-3.5 w-3.5" />
        </span>
        {trend && trend.direction !== "neutral" && (
          <span
            className={cn(
              "flex items-center gap-0.5 text-[10px] font-bold",
              trend.direction === "up" ? "text-emerald-600" : "text-red-600"
            )}
          >
            {trend.direction === "up" ? (
              <TrendingUp className="h-3 w-3" />
            ) : (
              <TrendingDown className="h-3 w-3" />
            )}
            {trend.value}%
          </span>
        )}
      </div>

      <p className="mt-2 truncate font-heading text-lg font-extrabold leading-none tracking-tight tabular">
        {value}
      </p>
      <p className="mt-1 truncate text-[11px] font-medium text-muted-foreground">
        {title}
      </p>
      {description && (
        <p className="mt-0.5 truncate text-[10px] text-muted-foreground/80">
          {description}
        </p>
      )}
    </div>
  );
}
