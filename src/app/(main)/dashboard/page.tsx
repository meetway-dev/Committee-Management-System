import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { BalanceHero } from "@/components/shared/balance-hero";
import { StatCard } from "@/components/shared/stat-card";
import { SectionHeader } from "@/components/shared/section-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { EmptyState } from "@/components/shared/empty-state";
import { ListRow, ListGroup } from "@/components/shared/list-row";
import { GradientAvatar } from "@/components/shared/gradient-avatar";
import { QuickActions } from "@/components/shared/quick-actions";
import { Countdown } from "@/components/shared/countdown";
import { MiniChart } from "@/components/shared/mini-chart";
import { CommitteeCardList } from "@/features/committee/committee-card";
import { getDashboardStats, getMyCommittees } from "@/actions/committee.actions";
import { getMyPayments } from "@/actions/payment.actions";
import { formatCurrency, formatRelativeDate } from "@/utils/format";
import {
  Users,
  CheckCircle2,
  Wallet,
  Clock,
  Plus,
  TrendingUp,
  UsersRound,
  UserPlus,
  History,
  Layers,
} from "lucide-react";

const QUICK_ACTION_ITEMS = [
  { label: "Pay", href: "/payments", icon: Wallet },
  { label: "Members", href: "/members", icon: UsersRound },
  { label: "Create", href: "/committees/new", icon: Plus },
  { label: "Invite", href: "/committees", icon: UserPlus },
  { label: "History", href: "/payments", icon: History },
];

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
  const totalCollection = allCommittees.reduce(
    (sum, c) => sum + c.contributionAmount * (c.memberCount ?? c.maxMembers),
    0
  );

  // Next payment = soonest unpaid due date.
  const nextPayment = pendingPayments
    .filter((p) => p.dueDate)
    .sort(
      (a, b) =>
        new Date(a.dueDate as string).getTime() -
        new Date(b.dueDate as string).getTime()
    )[0];

  const activeCommittee =
    allCommittees.find((c) => c.status === "active") ?? allCommittees[0];

  const progress =
    activeCommittee && activeCommittee.totalRounds > 0
      ? Math.round(
          (activeCommittee.currentRound / activeCommittee.totalRounds) * 100
        )
      : 0;

  // Cumulative contribution trend from the 8 most recent approved payments.
  const trend = paidPayments
    .slice(0, 8)
    .reverse()
    .reduce<number[]>((acc, p) => {
      acc.push((acc[acc.length - 1] ?? 0) + p.amount);
      return acc;
    }, []);

  const recentActivity = allPayments.slice(0, 5);
  // Pass the raw action result so the card list keeps its own populated type.
  const recentCommittees = committees.slice(0, 6);

  return (
    <>
      {/* Greeting */}
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] font-medium text-muted-foreground">
            {greeting()} 👋
          </p>
          <h1 className="mt-0.5 truncate font-heading text-xl font-extrabold tracking-tight">
            {activeCommittee?.name ?? "Your circles"}
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

      {/* Balance hero */}
      <BalanceHero
        label="Total Contributed"
        amount={stats?.totalPaid ?? 0}
        currency={primaryCurrency}
        badge={
          stats?.activeCommittees
            ? `${stats.activeCommittees} active`
            : undefined
        }
        stats={[
          {
            label: "Paid",
            value: formatCurrency(
              paidPayments.reduce((s, p) => s + p.amount, 0),
              primaryCurrency
            ),
            icon: CheckCircle2,
          },
          {
            label: "Pending",
            value: formatCurrency(pendingAmount, primaryCurrency),
            icon: Clock,
          },
          {
            label: "Circles",
            value: stats?.totalCommittees ?? 0,
            icon: Layers,
          },
        ]}
      />

      {/* Summary grid */}
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
        <StatCard
          title="Total Collection"
          value={formatCurrency(totalCollection, primaryCurrency)}
          icon={Wallet}
          description="Across all circles"
        />
        <StatCard
          title="Paid"
          value={paidPayments.length}
          icon={CheckCircle2}
          tone="success"
          description="Approved payments"
        />
        <StatCard
          title="Pending"
          value={pendingPayments.length}
          icon={Clock}
          tone="warning"
          description="Awaiting approval"
        />
        <StatCard
          title="Completed"
          value={stats?.completedCommittees ?? 0}
          icon={TrendingUp}
          tone="neutral"
          description="Finished circles"
        />
      </div>

      {/* Progress */}
      {activeCommittee && (
        <div className="rounded-2xl bg-card p-3.5 ring-1 ring-foreground/[0.06]">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate text-[0.8rem] font-bold">
                {activeCommittee.name}
              </p>
              <p className="mt-0.5 text-[11px] text-muted-foreground">
                Round {activeCommittee.currentRound} of{" "}
                {activeCommittee.totalRounds} ·{" "}
                {activeCommittee.memberCount ?? activeCommittee.maxMembers}{" "}
                members
              </p>
            </div>
            <span className="shrink-0 font-heading text-lg font-extrabold tabular text-primary">
              {progress}%
            </span>
          </div>
          <Progress value={progress} className="mt-2.5 h-1.5" />
          {trend.length > 1 && (
            <div className="mt-2.5 border-t border-border/60 pt-2.5">
              <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                Contribution trend
              </p>
              <MiniChart data={trend} className="mt-1" />
            </div>
          )}
        </div>
      )}

      {/* Upcoming payment */}
      {nextPayment && (
        <div className="flex items-center gap-3 rounded-2xl bg-card p-3.5 ring-1 ring-foreground/[0.06]">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary">
            <Clock className="h-[18px] w-[18px]" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-medium text-muted-foreground">
              Next payment
            </p>
            <p className="mt-0.5 truncate font-heading text-base font-extrabold tabular">
              {formatCurrency(
                nextPayment.amount,
                nextPayment.committee?.currency
              )}
            </p>
            {nextPayment.dueDate && (
              <div className="mt-1.5">
                <Countdown date={nextPayment.dueDate} />
              </div>
            )}
          </div>
          <Link
            href="/payments"
            className={cn(buttonVariants({ size: "sm" }), "shrink-0")}
          >
            Pay now
          </Link>
        </div>
      )}

      {/* Quick actions */}
      <QuickActions actions={QUICK_ACTION_ITEMS} />

      {/* Recent activity */}
      {recentActivity.length > 0 && (
        <div className="space-y-2">
          <SectionHeader title="Recent activity" href="/payments" />
          <div className="rounded-2xl bg-card p-1.5 ring-1 ring-foreground/[0.06]">
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

      {/* Circles */}
      <div className="space-y-2">
        <SectionHeader
          title="Your circles"
          href={allCommittees.length > 6 ? "/committees" : undefined}
        />
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
    </>
  );
}
