import { getDashboardStats, getMyCommittees } from "@/actions/committee.actions";
import { getMyPayments } from "@/actions/payment.actions";
import { EmptyState } from "@/components/shared/empty-state";
import { GradientAvatar } from "@/components/shared/gradient-avatar";
import { ListGroup, ListRow } from "@/components/shared/list-row";
import { SectionHeader } from "@/components/shared/section-header";
import { StatCard } from "@/components/shared/stat-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { buttonVariants } from "@/components/ui/button";
import { CommitteeCardList } from "@/features/committee/committee-card";
import { cn } from "@/lib/utils";
import { formatCurrency, formatRelativeDate } from "@/utils/format";
import {
    Clock,
    Layers,
    Plus,
    Users,
    Wallet
} from "lucide-react";
import Link from "next/link";

interface DashboardPayment {
  _id: string;
  amount: number;
  round: number;
  status: string;
  dueDate?: string;
  createdAt: string;
  committee?: { name?: string; currency?: string };
}

interface DashboardCommittee {
  _id: string;
  name: string;
  status: string;
  currency?: string;
  contributionAmount: number;
  currentRound: number;
  totalRounds: number;
  maxMembers: number;
  memberCount?: number;
}

function greeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export default async function DashboardPage() {
  const [stats, committees, payments] = await Promise.all([
    getDashboardStats(),
    getMyCommittees(),
    getMyPayments(),
  ]);

  const allCommittees = committees as DashboardCommittee[];
  const allPayments = payments as DashboardPayment[];

  const primaryCurrency = allCommittees[0]?.currency ?? "PKR";

  const paidPayments = allPayments.filter((p) => p.status === "approved");
  const pendingPayments = allPayments.filter(
    (p) => p.status === "pending" || p.status === "late" || p.status === "overdue"
  );

  const pendingAmount = pendingPayments.reduce((sum, p) => sum + p.amount, 0);
  const totalContribution = paidPayments.reduce((sum, p) => sum + p.amount, 0);

  const nextPayment = pendingPayments
    .filter((p) => p.dueDate)
    .sort(
      (a, b) =>
        new Date(a.dueDate as string).getTime() -
        new Date(b.dueDate as string).getTime()
    )[0];

  const recentActivity = allPayments.slice(0, 4);
  const recentCommittees = committees.slice(0, 4);

  return (
    <>
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] font-medium text-muted-foreground">
            {greeting()} 👋
          </p>
          <h1 className="mt-0.5 truncate font-heading text-xl font-extrabold tracking-tight">
            Overview
          </h1>
        </div>
        <Link
          href="/committees/new"
          className={cn(buttonVariants({ size: "sm" }), "shrink-0 gap-1.5")}
        >
          <Plus className="h-4 w-4" />
          New
        </Link>
      </div>

      <div className="grid gap-2.5 sm:grid-cols-3">
        <StatCard
          title="Total contribution"
          value={formatCurrency(totalContribution, primaryCurrency)}
          icon={Wallet}
          description="Approved payments"
        />
        <StatCard
          title="Active circles"
          value={stats?.activeCommittees ?? 0}
          icon={Layers}
          description="Running now"
        />
        <StatCard
          title="Pending"
          value={formatCurrency(pendingAmount, primaryCurrency)}
          icon={Clock}
          tone="warning"
          description="To review"
        />
      </div>

      {nextPayment && (
        <div className="rounded-[var(--card-radius)] border border-border bg-card p-3.5 shadow-[0_10px_28px_-18px_rgba(20,16,31,0.12)]">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[11px] font-medium text-muted-foreground">
                Next payment
              </p>
              <p className="mt-1 font-heading text-lg font-bold">
                {formatCurrency(nextPayment.amount, nextPayment.committee?.currency)}
              </p>
            </div>
            <Link
              href="/payments"
              className={cn(buttonVariants({ size: "sm" }), "shrink-0")}
            >
              View
            </Link>
          </div>
        </div>
      )}

      <div className="space-y-2">
        <SectionHeader title="Your circles" />
        {allCommittees.length === 0 ? (
          <EmptyState
            icon={Users}
            title="No circles yet"
            description="Create your first circle to start managing group savings."
            actionLabel="Create Circle"
            actionHref="/committees/new"
          />
        ) : (
          <CommitteeCardList committees={recentCommittees} />
        )}
      </div>

      {recentActivity.length > 0 && (
        <div className="space-y-2">
          <SectionHeader title="Recent activity" href="/payments" />
          <div className="rounded-[var(--card-radius)] bg-card p-1.5 ring-1 ring-foreground/[0.06] shadow-[0_10px_26px_-20px_rgba(20,16,31,0.1)]">
            <ListGroup>
              {recentActivity.map((payment) => (
                <ListRow
                  key={payment._id}
                  leading={
                    <GradientAvatar
                      name={payment.committee?.name || "Committee"}
                      size="md"
                    />
                  }
                  title={payment.committee?.name || "Unknown circle"}
                  caption={`Round ${payment.round} · ${formatRelativeDate(payment.createdAt)}`}
                  value={formatCurrency(
                    payment.amount,
                    payment.committee?.currency
                  )}
                  trailing={<StatusBadge status={payment.status} />}
                />
              ))}
            </ListGroup>
          </div>
        </div>
      )}
    </>
  );
}
