import Link from "next/link";
import { cn } from "@/lib/utils";
import { type LucideIcon } from "lucide-react";

export interface QuickAction {
  label: string;
  href: string;
  icon: LucideIcon;
}

interface QuickActionsProps {
  actions: QuickAction[];
  className?: string;
}

/**
 * Row of compact icon tiles. Horizontally scrollable on narrow phones so it
 * never wraps into a second line and costs vertical space.
 */
export function QuickActions({ actions, className }: QuickActionsProps) {
  return (
    <div
      className={cn(
        "no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1",
        className
      )}
    >
      {actions.map(({ label, href, icon: Icon }) => (
        <Link
          key={href + label}
          href={href}
          className="flex min-h-[44px] min-w-[68px] flex-1 shrink-0 flex-col items-center justify-center gap-1.5 rounded-xl bg-card px-2 py-2.5 ring-1 ring-foreground/[0.06] transition-all duration-150 hover:ring-primary/30 active:scale-[0.97]"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-soft text-primary">
            <Icon className="h-4 w-4" />
          </span>
          <span className="text-[10px] font-semibold leading-none text-muted-foreground">
            {label}
          </span>
        </Link>
      ))}
    </div>
  );
}
