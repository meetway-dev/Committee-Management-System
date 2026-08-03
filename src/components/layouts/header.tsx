"use client";

import { logoutUser } from "@/actions/auth.actions";
import { GradientAvatar } from "@/components/shared/gradient-avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { APP_NAME } from "@/constants";
import { CircleDollarSign, LogOut, Settings, User } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";

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
  const { data: session } = useSession();
  const user = session?.user;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/80 bg-background/90 backdrop-blur-xl">
      <div className="flex h-14 w-full items-center justify-between gap-2 px-3 sm:px-4 lg:px-6">
        <Wordmark />

        <DropdownMenu>
          <DropdownMenuTrigger
            aria-label="Account menu"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card shadow-sm outline-none transition-all hover:border-primary/40 hover:shadow-md focus-visible:ring-2 focus-visible:ring-primary/30"
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
    </header>
  );
}
