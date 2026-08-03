"use client";

import { NAV_ITEMS } from "@/constants";
import { cn } from "@/lib/utils";
import { CreditCard, Home, Users, UsersRound } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Home,
  Users,
  CreditCard,
  UsersRound,
};

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 px-2 pb-2 pt-1 pb-safe lg:hidden">
      <div className="mx-auto flex max-w-3xl items-center justify-between gap-1 rounded-[var(--card-radius)] border border-border bg-card px-1.5 py-1.5 shadow-[0_18px_80px_-48px_rgba(15,23,42,0.28)] sm:px-2 sm:py-2 sm:gap-2">
        {NAV_ITEMS.main.map((item) => {
          const Icon = iconMap[item.icon];
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              aria-label={item.label}
              className={cn(
                "group flex min-h-[50px] flex-1 flex-col items-center justify-center gap-0.5 rounded-[0.95rem] px-2 py-1.5 text-[10px] font-medium transition-all duration-200 sm:min-h-[56px] sm:gap-1 sm:px-3 sm:py-2 sm:text-[11px]",
                isActive
                  ? "bg-primary text-primary-foreground shadow-[0_8px_20px_-10px_rgba(124,58,237,0.25)]"
                  : "text-muted-foreground hover:bg-muted/70 hover:text-foreground"
              )}
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-card shadow-sm sm:h-9 sm:w-9">
                {Icon && <Icon className="h-4 w-4 sm:h-5 sm:w-5" />}
              </span>
              <span className="leading-none">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
