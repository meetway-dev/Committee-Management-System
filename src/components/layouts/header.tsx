"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  Bell,
  Search,
  Menu,
  LogOut,
  User,
  Settings,
  Home,
  Users,
  UsersRound,
  CreditCard,
  UserCircle,
  LayoutDashboard,
  Building,
  LifeBuoy,
  CircleDollarSign,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { GradientAvatar } from "@/components/shared/gradient-avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { logoutUser } from "@/actions/auth.actions";
import { NAV_ITEMS, APP_NAME } from "@/constants";
import { cn } from "@/lib/utils";

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

function Wordmark() {
  return (
    <Link href="/dashboard" className="flex items-center gap-2">
      <span className="mesh-brand flex h-8 w-8 items-center justify-center rounded-2xl text-white shadow-[0_4px_12px_-4px_rgba(124,58,237,0.6)]">
        <CircleDollarSign className="h-4 w-4" />
      </span>
      <span className="font-heading text-base font-extrabold tracking-tight">
        {APP_NAME}
      </span>
    </Link>
  );
}

export function Header() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const user = session?.user;

  return (
    <header className="glass fixed top-0 left-0 right-0 z-50 flex h-14 items-center border-b border-border/50">
      <div className="flex w-full items-center justify-between gap-2 px-3 sm:px-4 lg:px-6">
        <div className="flex items-center gap-2">
          <Sheet>
            <SheetTrigger
              aria-label="Open menu"
              className="flex h-9 w-9 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-muted lg:hidden"
            >
              <Menu className="h-[18px] w-[18px]" />
            </SheetTrigger>
            <SheetContent
              side="left"
              className="w-72 border-r border-border/60 bg-sidebar p-0 text-sidebar-foreground"
            >
              <div className="flex h-14 items-center border-b border-sidebar-border px-5">
                <Wordmark />
              </div>
              <nav className="space-y-0.5 p-3">
                {NAV_ITEMS.sidebar.map((item) => {
                  const Icon = iconMap[item.icon];
                  const isActive =
                    pathname === item.href ||
                    pathname.startsWith(item.href + "/");
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 rounded-xl px-3 py-2.5 text-[0.8rem] font-semibold transition-colors",
                        isActive
                          ? "bg-primary-soft text-primary"
                          : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                      )}
                    >
                      {Icon && <Icon className="h-4 w-4" />}
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
            </SheetContent>
          </Sheet>
          <Wordmark />
        </div>

        <div className="flex items-center gap-0.5">
          <Button variant="ghost" size="icon-sm" render={<Link href="/search" />} aria-label="Search">
            <Search className="h-[18px] w-[18px]" />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            render={<Link href="/notifications" />}
            aria-label="Notifications"
          >
            <Bell className="h-[18px] w-[18px]" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger
              aria-label="Account menu"
              className="ml-1 rounded-full outline-none ring-offset-2 focus-visible:ring-2 focus-visible:ring-ring"
            >
              <GradientAvatar
                name={user?.name || "User"}
                image={user?.image}
                size="sm"
              />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52">
              <div className="px-2 py-1.5">
                <p className="truncate text-[0.8rem] font-semibold">
                  {user?.name}
                </p>
                <p className="truncate text-[11px] text-muted-foreground">
                  {user?.email}
                </p>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem render={<Link href="/profile" />}>
                <User className="h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem render={<Link href="/settings" />}>
                <Settings className="h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="p-0">
                <form action={logoutUser} className="w-full">
                  <button
                    type="submit"
                    className="flex w-full items-center gap-2 px-2 py-1.5 text-destructive"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </form>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
