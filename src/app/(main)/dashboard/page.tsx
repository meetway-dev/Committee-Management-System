import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { EmptyState } from "@/components/shared/empty-state";
import { CommitteeCardList } from "@/features/committee/committee-card";
import { getDashboardStats, getMyCommittees } from "@/actions/committee.actions";
import {
  LayoutDashboard,
  Users,
  CheckCircle2,
  Wallet,
  Plus,
  ArrowRight,
} from "lucide-react";
import { formatCurrency } from "@/utils/format";

export default async function DashboardPage() {
  const [stats, committees] = await Promise.all([
    getDashboardStats(),
    getMyCommittees(),
  ]);

  const recentCommittees = committees.slice(0, 6);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Dashboard"
        description="Overview of your committees and activity"
        icon={LayoutDashboard}
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

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Committees"
          value={stats?.totalCommittees ?? 0}
          icon={Users}
          description="All time"
        />
        <StatCard
          title="Active"
          value={stats?.activeCommittees ?? 0}
          icon={Users}
          description="Currently running"
        />
        <StatCard
          title="Completed"
          value={stats?.completedCommittees ?? 0}
          icon={CheckCircle2}
          description="Successfully finished"
        />
        <StatCard
          title="Total Contributions"
          value={formatCurrency(stats?.totalPaid ?? 0)}
          icon={Wallet}
          description="Amount paid"
        />
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Recent Committees</h2>
          {committees.length > 6 && (
            <Link
              href="/committees"
              className={cn(
                buttonVariants({ variant: "ghost", size: "sm" }),
                "gap-1"
              )}
            >
              View all
              <ArrowRight className="h-4 w-4" />
            </Link>
          )}
        </div>

        {committees.length === 0 ? (
          <EmptyState
            icon={Users}
            title="No committees yet"
            description="Create your first committee to start managing group savings and contributions."
            actionLabel="Create Committee"
            actionHref="/committees/new"
          />
        ) : (
          <CommitteeCardList committees={recentCommittees} />
        )}
      </div>
    </div>
  );
}
