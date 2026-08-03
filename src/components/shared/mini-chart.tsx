import { cn } from "@/lib/utils";

interface MiniChartProps {
  data: number[];
  className?: string;
  /** Stroke colour token; defaults to the primary emerald. */
  stroke?: string;
  filled?: boolean;
  height?: number;
}

/**
 * Dependency-free sparkline. Recharts is reserved for full-size charts;
 * this keeps compact trend indicators cheap and server-renderable.
 */
export function MiniChart({
  data,
  className,
  stroke = "var(--primary)",
  filled = true,
  height = 32,
}: MiniChartProps) {
  if (data.length < 2) {
    return <div className={cn("h-8", className)} />;
  }

  const width = 100;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const stepX = width / (data.length - 1);

  const points = data.map((value, i) => {
    const x = i * stepX;
    const y = height - ((value - min) / range) * (height - 4) - 2;
    return { x, y };
  });

  const line = points
    .map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(2)},${p.y.toFixed(2)}`)
    .join(" ");

  const area = `${line} L${width},${height} L0,${height} Z`;
  const last = points[points.length - 1];
  const gradientId = `spark-${data.length}-${Math.round(max)}`;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      className={cn("h-8 w-full overflow-visible", className)}
      aria-hidden
    >
      {filled && (
        <>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={stroke} stopOpacity="0.22" />
              <stop offset="100%" stopColor={stroke} stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={area} fill={`url(#${gradientId})`} />
        </>
      )}
      <path
        d={line}
        fill="none"
        stroke={stroke}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
      <circle cx={last.x} cy={last.y} r="2.5" fill={stroke} />
    </svg>
  );
}
