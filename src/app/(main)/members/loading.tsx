import { Skeleton } from "@/components/ui/skeleton";
import { ListSkeleton } from "@/components/shared/loading-skeleton";

export default function MembersLoading() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2.5">
        <Skeleton className="h-9 w-9 rounded-xl" />
        <div className="space-y-1.5">
          <Skeleton className="h-5 w-28" />
          <Skeleton className="h-2.5 w-40" />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-[52px] rounded-xl" />
        ))}
      </div>
      <Skeleton className="h-4 w-36" />
      <ListSkeleton rows={4} />
      <Skeleton className="h-4 w-36" />
      <ListSkeleton rows={3} />
    </div>
  );
}
