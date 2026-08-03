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
    <nav className="fixed inset-x-0 bottom-0 z-50 lg:hidden">
      <div className="flex h-16 items-center border-t border-border bg-card/95 px-1 shadow-[0_-10px_25px_-20px_rgba(15,23,42,0.35)] backdrop-blur-md">
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
              className="flex flex-1 min-h-full flex-col items-center justify-center gap-1 px-3 transition duration-200 text-muted-foreground hover:text-foreground"
            >
              {Icon && <Icon className={cn("h-4 w-4", isActive ? "text-primary" : "text-current")} />}
              <span className="text-[10px] font-medium leading-none">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
