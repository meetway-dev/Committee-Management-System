"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { NAV_ITEMS } from "@/constants";
import { Home, Users, CreditCard, UsersRound, User } from "lucide-react";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Home,
  Users,
  CreditCard,
  UsersRound,
  User,
};

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border/60 bg-card/90 backdrop-blur-xl lg:hidden">
      <div className="mx-auto flex max-w-md items-stretch justify-around gap-0.5 px-1.5 pb-safe">
        {NAV_ITEMS.main.map((item) => {
          const Icon = iconMap[item.icon];
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "flex min-h-[52px] min-w-[44px] flex-1 flex-col items-center justify-center gap-1 rounded-xl py-1.5 text-[10px] font-semibold transition-colors duration-150",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground active:bg-muted"
              )}
            >
              <span
                className={cn(
                  "flex h-7 w-12 items-center justify-center rounded-full transition-colors duration-150",
                  isActive && "bg-primary-soft"
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
