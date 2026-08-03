"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { NAV_ITEMS } from "@/constants";
import { Home, Users, CreditCard, UsersRound } from "lucide-react";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Home,
  Users,
  CreditCard,
  UsersRound,
};

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 px-2 pb-2 pb-safe lg:hidden">
      <div className="mx-auto flex max-w-md items-stretch justify-around gap-1 rounded-[22px] border border-border bg-card p-1.5 shadow-[0_12px_30px_-18px_rgba(15,23,42,0.45)]">
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
                "group flex min-h-[52px] min-w-[52px] flex-1 flex-col items-center justify-center gap-1 rounded-[16px] px-1 py-1.5 text-[10px] font-semibold transition-all duration-200",
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-muted"
              )}
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full">
                {Icon && <Icon className="h-[18px] w-[18px]" />}
              </span>
              <span className="leading-none">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
