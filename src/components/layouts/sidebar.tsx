"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/utils/format";
import { NAV_ITEMS } from "@/constants";
import {
  Home,
  Users,
  CreditCard,
  Bell,
  User,
  LayoutDashboard,
  UserCircle,
  Settings,
  Building,
  LifeBuoy,
} from "lucide-react";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Home,
  Users,
  CreditCard,
  Bell,
  User,
  LayoutDashboard,
  UserCircle,
  Settings,
  Building,
  LifeBuoy,
};

export function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const user = session?.user;

  return (
    <aside className="fixed left-0 top-16 hidden h-[calc(100vh-4rem)] w-64 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground shadow-[0_16px_40px_rgba(15,23,42,0.08)] lg:flex">
      <nav className="flex-1 space-y-1 overflow-y-auto p-3.5">
        {NAV_ITEMS.sidebar.map((item) => {
          const Icon = iconMap[item.icon];
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-sidebar-foreground/75 hover:bg-sidebar-accent hover:text-sidebar-foreground"
              )}
            >
              {Icon && <Icon className="h-4 w-4 shrink-0" />}
              <span>{item.label}</span>
            </Link>
          );
        })}

        {user?.role === "superadmin" && (
          <>
            <div className="py-2">
              <div className="h-px bg-border/80" />
            </div>
            <p className="px-3 pb-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              Admin
            </p>
            {NAV_ITEMS.admin.map((item) => {
              const Icon = iconMap[item.icon];
              const isActive =
                pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-sidebar-foreground/75 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                  )}
                >
                  {Icon && <Icon className="h-4 w-4 shrink-0" />}
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </>
        )}
      </nav>

      {user && (
        <div className="border-t border-sidebar-border bg-sidebar/90 p-3.5">
          <div className="flex items-center gap-3 rounded-xl border border-border/60 bg-background/60 p-2.5">
            <Avatar className="h-9 w-9 ring-2 ring-background">
              <AvatarImage src={user.image || ""} alt={user.name || ""} />
              <AvatarFallback className="text-[10px] font-semibold">
                {user.name ? getInitials(user.name) : "U"}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">{user.name}</p>
              <p className="truncate text-[11px] text-muted-foreground">{user.email}</p>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
