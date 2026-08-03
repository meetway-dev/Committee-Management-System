import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { type LucideIcon } from "lucide-react";
import Link from "next/link";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-[var(--card-radius)] bg-card/60 px-6 py-10 text-center ring-1 ring-foreground/[0.05]",
        className
      )}
    >
      <div className="relative">
        <div
          aria-hidden
          className="absolute inset-0 -m-3 rounded-full bg-primary/5"
        />
        <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500/15 to-fuchsia-500/10 text-primary">
          <Icon className="h-6 w-6" />
        </div>
      </div>
      <h3 className="mt-4 font-heading text-[0.95rem] font-bold tracking-tight">
        {title}
      </h3>
      <p className="mt-1 max-w-[15rem] text-[0.8rem] leading-relaxed text-muted-foreground">
        {description}
      </p>
      {actionLabel && actionHref && (
        <Link href={actionHref} className={cn(buttonVariants({ size: "sm" }), "mt-4")}>
          {actionLabel}
        </Link>
      )}
      {actionLabel && onAction && !actionHref && (
        <button
          onClick={onAction}
          className={cn(buttonVariants({ size: "sm" }), "mt-4")}
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
