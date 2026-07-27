import { FormSkeleton } from "@/components/shared/loading-skeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProfileLoading() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-8 w-28" />
        <Skeleton className="h-4 w-52" />
      </div>
      <div className="flex flex-col items-center gap-4 py-4">
        <Skeleton className="h-20 w-20 rounded-full" />
        <div className="space-y-2 text-center">
          <Skeleton className="mx-auto h-5 w-32" />
          <Skeleton className="mx-auto h-4 w-40" />
        </div>
      </div>
      <FormSkeleton />
    </div>
  );
}
