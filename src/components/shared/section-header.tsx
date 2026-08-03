import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  title: string;
  caption?: string;
  href?: string;
  linkLabel?: string;
  action?: React.ReactNode;
  className?: string;
}

/**
 * Compact section title row used across every screen so headings share
 * one rhythm instead of ad-hoc <h2> styling.
 */
export function SectionHeader({
  title,
  caption,
  href,
  linkLabel = "View all",
  action,
  className,
}: SectionHeaderProps) {
  return (
    <div className={cn("flex items-end justify-between gap-2", className)}>
      <div className="min-w-0">
        <h2 className="truncate font-heading text-[0.95rem] font-bold tracking-tight">
          {title}
        </h2>
        {caption && (
          <p className="mt-0.5 truncate text-[11px] text-muted-foreground">
            {caption}
          </p>
        )}
      </div>
      {action ??
        (href && (
          <Link
            href={href}
            className="flex shrink-0 items-center gap-0.5 rounded-full px-2 py-1 text-[11px] font-semibold text-primary transition-colors hover:bg-primary-soft"
          >
            {linkLabel}
            <ArrowRight className="h-3 w-3" />
          </Link>
        ))}
    </div>
  );
}
