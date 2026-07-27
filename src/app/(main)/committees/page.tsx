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
    <div className="space-y-6">
      <PageHeader
        title="Committees"
        description="Manage your savings committees"
        icon={Users}
        action={
          <Link
            href="/committees/new"
            className={cn(buttonVariants({ size: "sm" }), "gap-1.5")}
          >
            <Plus className="h-4 w-4" />
            New Committee
          </Link>
        }
      />

      {committees.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No committees yet"
          description="Create your first committee to start managing group savings and contributions."
          actionLabel="Create Committee"
          actionHref="/committees/new"
        />
      ) : (
        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">
              All ({committees.length})
            </TabsTrigger>
            <TabsTrigger value="active">
              Active ({active.length})
            </TabsTrigger>
            <TabsTrigger value="drafts">
              Drafts ({drafts.length})
            </TabsTrigger>
            <TabsTrigger value="completed">
              Completed ({completed.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <CommitteeCardList committees={committees} />
          </TabsContent>
          <TabsContent value="active">
            <CommitteeCardList
              committees={active}
              emptyMessage="No active committees"
            />
          </TabsContent>
          <TabsContent value="drafts">
            <CommitteeCardList
              committees={drafts}
              emptyMessage="No draft committees"
            />
          </TabsContent>
          <TabsContent value="completed">
            <CommitteeCardList
              committees={completed}
              emptyMessage="No completed committees"
            />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
