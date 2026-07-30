import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { type LucideIcon, TrendingUp, TrendingDown } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    direction: "up" | "down" | "neutral";
  };
  className?: string;
}

export function StatCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  className,
}: StatCardProps) {
  return (
    <Card className={cn("border-border/70 bg-card/90 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md", className)}>
      <CardContent className="p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 space-y-1.5">
            <p className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">{title}</p>
            <p className="text-2xl font-extrabold tracking-tight text-foreground font-heading">{value}</p>
            {description && (
              <p className="text-[11px] text-muted-foreground">{description}</p>
            )}
            {trend && (
              <div className="flex items-center gap-1 pt-0.5">
                {trend.direction === "up" ? (
                  <TrendingUp className="h-3 w-3 text-emerald-600" />
                ) : trend.direction === "down" ? (
                  <TrendingDown className="h-3 w-3 text-red-600" />
                ) : null}
                <span
                  className={cn(
                    "text-[11px] font-medium",
                    trend.direction === "up" && "text-emerald-600",
                    trend.direction === "down" && "text-red-600",
                    trend.direction === "neutral" && "text-muted-foreground"
                  )}
                >
                  {trend.value}%
                </span>
              </div>
            )}
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Icon className="h-4 w-4" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
