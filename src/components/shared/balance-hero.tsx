import { cn } from "@/lib/utils";
import { formatCurrency } from "@/utils/format";
import { type LucideIcon } from "lucide-react";

interface HeroStat {
  label: string;
  value: string | number;
  icon?: LucideIcon;
}

interface BalanceHeroProps {
  label?: string;
  amount: number;
  currency?: string;
  caption?: string;
  badge?: string;
  stats?: HeroStat[];
  className?: string;
}

/**
 * The primary "wallet card" — emerald gradient, oversized balance, and an
 * optional inline stat strip. Anchors the dashboard above the fold.
 */
export function BalanceHero({
  label = "Total Balance",
  amount,
  currency = "PKR",
  caption,
  badge,
  stats,
  className,
}: BalanceHeroProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-600 via-emerald-600 to-teal-500 p-4 text-white shadow-[0_10px_30px_-12px_rgba(5,150,105,0.55)]",
        className
      )}
    >
      {/* decorative rings */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-10 -top-14 h-40 w-40 rounded-full border border-white/15"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-2 -top-6 h-24 w-24 rounded-full border border-white/10"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-16 -left-8 h-36 w-36 rounded-full bg-white/5"
      />

      <div className="relative">
        <div className="flex items-start justify-between gap-2">
          <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-white/75">
            {label}
          </p>
          {badge && (
            <span className="rounded-full bg-white/20 px-2.5 py-0.5 text-[10px] font-bold backdrop-blur-sm">
              {badge}
            </span>
          )}
        </div>

        <p className="mt-1.5 font-heading text-[28px] font-extrabold leading-none tracking-tight tabular">
          {formatCurrency(amount, currency)}
        </p>

        {caption && (
          <p className="mt-1.5 text-[11px] text-white/75">{caption}</p>
        )}

        {stats && stats.length > 0 && (
          <div className="mt-3.5 flex items-center gap-2 border-t border-white/15 pt-3">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="min-w-0 flex-1">
                  <div className="flex items-center gap-1 text-[10px] font-medium uppercase tracking-wide text-white/70">
                    {Icon && <Icon className="h-3 w-3" />}
                    <span className="truncate">{stat.label}</span>
                  </div>
                  <p className="mt-0.5 truncate text-sm font-bold tabular">
                    {stat.value}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
