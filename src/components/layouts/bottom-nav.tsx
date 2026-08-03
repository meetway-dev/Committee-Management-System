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
    <nav className="fixed bottom-0 left-0 right-0 z-50 px-3 pb-3 pb-safe lg:hidden">
      <div className="glass mx-auto flex max-w-md items-stretch justify-around gap-0.5 rounded-full p-1.5 ring-1 ring-foreground/[0.06] shadow-[0_10px_34px_-10px_rgba(124,58,237,0.30)]">
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
                "group flex min-h-[44px] min-w-[44px] flex-1 flex-col items-center justify-center gap-1 rounded-full py-1 text-[10px] font-semibold transition-colors duration-200",
                isActive ? "text-primary" : "text-muted-foreground"
              )}
            >
              <span
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-full transition-all duration-200",
                  isActive
                    ? "mesh-brand text-white shadow-[0_6px_16px_-6px_rgba(124,58,237,0.65)]"
                    : "group-active:bg-muted"
                )}
              >
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
