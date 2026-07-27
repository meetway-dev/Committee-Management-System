import { formatCurrency } from "@/utils/format";
import { cn } from "@/lib/utils";

interface CurrencyDisplayProps {
  amount: number;
  currency?: string;
  className?: string;
}

export function CurrencyDisplay({
  amount,
  currency = "PKR",
  className,
}: CurrencyDisplayProps) {
  return (
    <span className={cn("font-semibold tabular-nums", className)}>
      {formatCurrency(amount, currency)}
    </span>
  );
}
