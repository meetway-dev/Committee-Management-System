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
 * The primary "wallet card" — brand mesh gradient, oversized balance, and an
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
        "mesh-brand shadow-brand relative overflow-hidden rounded-3xl p-5 text-white",
        className
      )}
    >
      {/* halftone dot texture, fading out toward the bottom-right */}
      <div
        aria-hidden
        className="halftone pointer-events-none absolute inset-0 text-white/25 [mask-image:linear-gradient(115deg,black,transparent_65%)]"
      />
      {/* soft specular blooms */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-16 -top-20 h-52 w-52 rounded-full bg-white/15 blur-2xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-20 -left-12 h-44 w-44 rounded-full bg-white/10 blur-2xl"
      />

      <div className="relative">
        <div className="flex items-start justify-between gap-2">
          <p className="text-[11px] font-medium tracking-[0.02em] text-white/80">
            {label}
          </p>
          {badge && (
            <span className="rounded-full bg-white/20 px-2.5 py-1 text-[10px] font-bold ring-1 ring-white/25 backdrop-blur-md">
              {badge}
            </span>
          )}
        </div>

        <p className="mt-2 font-heading text-[34px] font-extrabold leading-none tracking-[-0.03em] tabular">
          {formatCurrency(amount, currency)}
        </p>

        {caption && (
          <p className="mt-2 text-[11px] text-white/75">{caption}</p>
        )}

        {stats && stats.length > 0 && (
          <div className="mt-4 flex items-center gap-2 border-t border-white/20 pt-3.5">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="min-w-0 flex-1">
                  <div className="flex items-center gap-1 text-[10px] font-medium text-white/70">
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
