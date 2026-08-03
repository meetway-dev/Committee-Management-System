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
      className="mesh-brand fixed bottom-28 right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full text-white shadow-[0_10px_28px_-6px_rgba(124,58,237,0.65)] transition-all duration-150 hover:shadow-[0_14px_34px_-6px_rgba(124,58,237,0.75)] active:scale-95 lg:bottom-6 lg:right-6"
    >
      <Icon className="h-6 w-6" />
    </Link>
  );
}
