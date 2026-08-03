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
          className="group flex min-h-[44px] min-w-[68px] flex-1 shrink-0 flex-col items-center justify-center gap-2 rounded-2xl px-2 py-3 transition-all duration-150 active:scale-[0.96]"
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-card text-primary ring-1 ring-foreground/[0.06] shadow-[0_4px_14px_-6px_rgba(124,58,237,0.30)] transition-all duration-200 group-hover:mesh-brand group-hover:text-white group-hover:ring-transparent">
            <Icon className="h-[18px] w-[18px]" />
          </span>
          <span className="text-[10px] font-semibold leading-none text-muted-foreground transition-colors group-hover:text-foreground">
            {label}
          </span>
        </Link>
      ))}
    </div>
  );
}
