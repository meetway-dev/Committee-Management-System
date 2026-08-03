import { Skeleton } from "@/components/ui/skeleton";

export default function CommitteeDetailLoading() {
  return (
    <>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Skeleton className="h-9 w-24 rounded-full" />
          <Skeleton className="h-9 w-24 rounded-full" />
        </div>
        <div className="flex items-start gap-3">
          <Skeleton className="h-12 w-12 shrink-0 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-5 w-2/3" />
            <Skeleton className="h-3 w-full max-w-sm" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-[52px] rounded-xl" />
        ))}
      </div>

      <Skeleton className="h-[68px] w-full rounded-2xl" />

      <div className="space-y-2.5">
        <Skeleton className="h-9 w-full rounded-xl" />
        <div className="space-y-1 rounded-2xl bg-card p-3.5 ring-1 ring-foreground/[0.06]">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between py-2.5">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-3 w-28" />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
