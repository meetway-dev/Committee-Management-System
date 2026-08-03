import { Skeleton } from "@/components/ui/skeleton";

export function DashboardSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-5 w-36" />
        </div>
        <Skeleton className="h-9 w-9 rounded-full" />
      </div>

      <Skeleton className="h-[132px] w-full rounded-2xl" />

      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-[86px] rounded-2xl" />
        ))}
      </div>

      <Skeleton className="h-[104px] w-full rounded-2xl" />
      <Skeleton className="h-[92px] w-full rounded-2xl" />

      <div className="space-y-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-[180px] w-full rounded-2xl" />
      </div>
    </div>
  );
}

export function CardListSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-2.5 sm:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} className="h-[112px] rounded-2xl" />
      ))}
    </div>
  );
}

export function ListSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-1 rounded-2xl bg-card p-2 ring-1 ring-foreground/[0.06]">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 px-1 py-2">
          <Skeleton className="h-10 w-10 shrink-0 rounded-full" />
          <div className="flex-1 space-y-1.5">
            <Skeleton className="h-3 w-1/2" />
            <Skeleton className="h-2.5 w-1/3" />
          </div>
          <Skeleton className="h-5 w-14 rounded-full" />
        </div>
      ))}
    </div>
  );
}

/** Kept for existing imports; now renders the mobile-card list shape. */
export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return <ListSkeleton rows={rows} />;
}

export function FormSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-11 w-full rounded-xl" />
        </div>
      ))}
      <Skeleton className="h-10 w-32 rounded-full" />
    </div>
  );
}
