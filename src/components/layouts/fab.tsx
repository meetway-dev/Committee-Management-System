"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Plus, Wallet } from "lucide-react";

/**
 * Context-aware floating action button. Sits above the bottom nav on mobile
 * and bottom-right on desktop. Hidden where a primary action makes no sense.
 */
export function Fab() {
  const pathname = usePathname();

  const config = (() => {
    if (pathname.startsWith("/payments")) {
      return { href: "/committees", label: "Pay installment", icon: Wallet };
    }
    if (
      pathname.startsWith("/dashboard") ||
      pathname.startsWith("/committees") ||
      pathname.startsWith("/members")
    ) {
      return { href: "/committees/new", label: "Create committee", icon: Plus };
    }
    return null;
  })();

  if (!config) return null;
  // Never overlap the create form itself.
  if (pathname === "/committees/new") return null;

  const Icon = config.icon;

  return (
    <Link
      href={config.href}
      aria-label={config.label}
      className="fixed bottom-20 right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-[0_8px_24px_-6px_rgba(5,150,105,0.6)] transition-all duration-150 hover:shadow-[0_10px_28px_-6px_rgba(5,150,105,0.7)] active:scale-95 lg:bottom-6 lg:right-6"
    >
      <Icon className="h-6 w-6" />
    </Link>
  );
}
