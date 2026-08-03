import { cn } from "@/lib/utils";
import { type LucideIcon } from "lucide-react";

interface PageHeaderProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
  icon?: LucideIcon;
  className?: string;
}

/** Slim page title row — compact by default to preserve vertical space. */
export function PageHeader({
  title,
  description,
  action,
  icon: Icon,
  className,
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-3",
        className
      )}
    >
      <div className="flex min-w-0 items-center gap-2.5">
        {Icon && (
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary">
            <Icon className="h-4 w-4" />
          </span>
        )}
        <div className="min-w-0">
          <h1 className="truncate font-heading text-xl font-extrabold tracking-tight">
            {title}
          </h1>
          {description && (
            <p className="mt-0.5 truncate text-[11px] text-muted-foreground">
              {description}
            </p>
          )}
        </div>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
