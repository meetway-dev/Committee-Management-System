"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { cn } from "@/lib/utils";
import { GradientAvatar } from "@/components/shared/gradient-avatar";
import { NAV_ITEMS } from "@/constants";
import {
  Home,
  Users,
  UsersRound,
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
  UsersRound,
  CreditCard,
  Bell,
  User,
  LayoutDashboard,
  UserCircle,
  Settings,
  Building,
  LifeBuoy,
};

function NavLink({
  href,
  label,
  icon,
  active,
}: {
  href: string;
  label: string;
  icon: string;
  active: boolean;
}) {
  const Icon = iconMap[icon];
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2.5 text-[0.8rem] font-semibold transition-all duration-150",
        active
          ? "bg-primary/10 text-primary shadow-sm ring-1 ring-primary/10"
          : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground"
      )}
    >
      {Icon && <Icon className="h-4 w-4 shrink-0" />}
      <span className="truncate">{label}</span>
    </Link>
  );
}

export function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const user = session?.user;

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  return (
    <aside className="fixed left-0 top-14 hidden h-[calc(100vh-3.5rem)] w-56 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground shadow-[inset_-1px_0_0_rgba(15,23,42,0.04)] lg:flex">
      <nav className="flex-1 space-y-0.5 overflow-y-auto p-3">
        {NAV_ITEMS.sidebar.map((item) => (
          <NavLink
            key={item.href}
            href={item.href}
            label={item.label}
            icon={item.icon}
            active={isActive(item.href)}
          />
        ))}

        {user?.role === "superadmin" && (
          <>
            <div className="my-2 h-px bg-sidebar-border" />
            <p className="px-3 pb-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-sidebar-foreground/55">
              Admin
            </p>
            {NAV_ITEMS.admin.map((item) => (
              <NavLink
                key={item.href}
                href={item.href}
                label={item.label}
                icon={item.icon}
                active={isActive(item.href)}
              />
            ))}
          </>
        )}
      </nav>

      {user && (
        <div className="border-t border-sidebar-border p-3">
          <Link
            href="/profile"
            className="flex items-center gap-2.5 rounded-lg border border-transparent p-2.5 transition-colors hover:border-sidebar-border hover:bg-sidebar-accent/80"
          >
            <GradientAvatar
              name={user.name || "User"}
              image={user.image}
              size="sm"
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-[0.8rem] font-semibold">
                {user.name}
              </p>
              <p className="truncate text-[10px] text-muted-foreground">
                {user.email}
              </p>
            </div>
          </Link>
        </div>
      )}
    </aside>
  );
}
