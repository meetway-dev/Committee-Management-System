import { CardListSkeleton } from "@/components/shared/loading-skeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function CommitteesLoading() {
  return (
    <>
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <Skeleton className="h-9 w-9 rounded-xl" />
          <div className="space-y-1.5">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-2.5 w-36" />
          </div>
        </div>
        <Skeleton className="h-9 w-20 rounded-full" />
      </div>
      <Skeleton className="h-9 w-full rounded-xl" />
      <CardListSkeleton count={6} />
    </>
  );
}
