import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { CommitteeCardList } from "@/features/committee/committee-card";
import { getMyCommittees } from "@/actions/committee.actions";
import { Users, Plus } from "lucide-react";

export default async function CommitteesPage() {
  const committees = await getMyCommittees();

  const active = committees.filter(
    (c: { status: string }) => c.status === "active"
  );
  const drafts = committees.filter(
    (c: { status: string }) => c.status === "draft"
  );
  const completed = committees.filter(
    (c: { status: string }) => c.status === "completed"
  );

  return (
    <>
      <PageHeader
        title="Circles"
        description="Manage your savings circles"
        icon={Users}
        action={
          <Link
            href="/committees/new"
            className={cn(buttonVariants({ size: "sm" }), "gap-1.5")}
          >
            <Plus className="h-4 w-4" />
            New
          </Link>
        }
      />

      {committees.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No circles yet"
          description="Create your first circle to start managing group savings and contributions."
          actionLabel="Create Circle"
          actionHref="/committees/new"
        />
      ) : (
        <Tabs defaultValue="all">
          <TabsList className="w-full">
            <TabsTrigger value="all">All ({committees.length})</TabsTrigger>
            <TabsTrigger value="active">Active ({active.length})</TabsTrigger>
            <TabsTrigger value="drafts">Drafts ({drafts.length})</TabsTrigger>
            <TabsTrigger value="completed">
              Done ({completed.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-2.5">
            <CommitteeCardList committees={committees} />
          </TabsContent>
          <TabsContent value="active" className="mt-2.5">
            <CommitteeCardList
              committees={active}
              emptyMessage="No active circles"
            />
          </TabsContent>
          <TabsContent value="drafts" className="mt-2.5">
            <CommitteeCardList
              committees={drafts}
              emptyMessage="No draft circles"
            />
          </TabsContent>
          <TabsContent value="completed" className="mt-2.5">
            <CommitteeCardList
              committees={completed}
              emptyMessage="No completed circles"
            />
          </TabsContent>
        </Tabs>
      )}
    </>
  );
}
