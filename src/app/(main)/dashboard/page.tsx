import { getDashboardStats, getMyCommittees } from "@/actions/committee.actions";
import { getMyPayments } from "@/actions/payment.actions";
import { BalanceHero } from "@/components/shared/balance-hero";
import { Countdown } from "@/components/shared/countdown";
import { EmptyState } from "@/components/shared/empty-state";
import { GradientAvatar } from "@/components/shared/gradient-avatar";
import { InstallAppBanner } from "@/components/shared/install-app";
import { ListGroup, ListRow } from "@/components/shared/list-row";
import { MiniChart } from "@/components/shared/mini-chart";
import { QuickActions } from "@/components/shared/quick-actions";
import { SectionHeader } from "@/components/shared/section-header";
import { StatCard } from "@/components/shared/stat-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { buttonVariants } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { auth } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { formatCurrency, formatDate, formatRelativeDate } from "@/utils/format";
import {
    Activity,
    CalendarDays,
    CheckCircle2,
    Clock,
    CreditCard,
    History,
    Layers,
    Plus,
    Receipt,
    TrendingUp,
    UserPlus,
    Users,
    UsersRound,
    Wallet,
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

function getMonthlyTrend(payments: DashboardPayment[], months = 6) {
  const now = new Date();
  const buckets: { label: string; total: number }[] = [];

  for (let i = months - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const total = payments
      .filter((p) => p.status === "approved")
      .filter((p) => {
        const pd = new Date(p.createdAt);
        return (
          pd.getFullYear() === d.getFullYear() && pd.getMonth() === d.getMonth()
        );
      })
      .reduce((sum, p) => sum + p.amount, 0);
    buckets.push({
      label: d.toLocaleString("en", { month: "short" }),
      total,
    });
  }

  return buckets;
}

const pendingStatuses = ["pending", "late", "overdue"];

export default async function DashboardPage() {
  const [session, stats, committees, payments] = await Promise.all([
    auth(),
    getDashboardStats(),
    getMyCommittees(),
    getMyPayments(),
  ]);

  const allCommittees = committees as DashboardCommittee[];
  const allPayments = payments as DashboardPayment[];

  const primaryCurrency = allCommittees[0]?.currency ?? "PKR";

  const approvedPayments = allPayments.filter((p) => p.status === "approved");
  const pendingPayments = allPayments.filter((p) =>
    pendingStatuses.includes(p.status)
  );

  const pendingAmount = pendingPayments.reduce((sum, p) => sum + p.amount, 0);
  const totalContribution = approvedPayments.reduce(
    (sum, p) => sum + p.amount,
    0
  );

  const heroAmount = stats?.totalPaid ?? totalContribution;
  const pendingCount = pendingPayments.length;

  const nextPayment = pendingPayments
    .filter((p) => p.dueDate)
    .sort(
      (a, b) =>
        new Date(a.dueDate as string).getTime() -
        new Date(b.dueDate as string).getTime()
    )[0];

  const upcomingPayments = pendingPayments
    .filter((p) => p.dueDate)
    .sort(
      (a, b) =>
        new Date(a.dueDate as string).getTime() -
        new Date(b.dueDate as string).getTime()
    )
    .slice(0, 3);

  const recentActivity = allPayments.slice(0, 5);
  const recentCommittees = allCommittees.slice(0, 4);

  const trend = getMonthlyTrend(allPayments);
  const trendValues = trend.map((t) => t.total);
  const periodTotal = trendValues.reduce((sum, v) => sum + v, 0);

  const last = trend[trend.length - 1]?.total ?? 0;
  const prev = trend[trend.length - 2]?.total ?? 0;
  const delta = prev > 0 ? Math.round(((last - prev) / prev) * 100) : 0;
  const trendDirection =
    delta === 0 ? "neutral" : delta > 0 ? "up" : "down";

  const todayLabel = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(new Date());

  const quickActions = [
    { label: "Pay", href: "/payments", icon: Wallet },
    { label: "Create", href: "/committees/new", icon: Plus },
    { label: "Invite", href: "/committees", icon: UserPlus },
    { label: "History", href: "/payments", icon: History },
    { label: "Members", href: "/members", icon: UsersRound },
  ];

  return (
    <>
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] font-medium text-muted-foreground">
            {greeting()}
            {session?.user?.name ? `, ${session.user.name.split(" ")[0]}` : ""} ·
            <span className="hidden sm:inline"> {todayLabel}</span>
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
          <span className="hidden sm:inline">New circle</span>
          <span className="sm:hidden">New</span>
        </Link>
      </div>

      <InstallAppBanner />

      <BalanceHero
        label="Total saved"
        amount={heroAmount}
        currency={primaryCurrency}
        caption={`Across ${allCommittees.length} ${
          allCommittees.length === 1 ? "circle" : "circles"
        }`}
        badge={todayLabel}
        stats={[
          { label: "Active", value: stats?.activeCommittees ?? 0, icon: Activity },
          { label: "Completed", value: stats?.completedCommittees ?? 0, icon: CheckCircle2 },
          { label: "Pending", value: pendingCount, icon: Clock },
        ]}
      />

      <div className="grid grid-cols-2 gap-2.5 lg:grid-cols-4">
        <StatCard
          title="Total contribution"
          value={formatCurrency(totalContribution, primaryCurrency)}
          icon={Wallet}
          tone="primary"
          trend={{ value: Math.abs(delta), direction: trendDirection }}
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
        <StatCard
          title="Completed"
          value={stats?.completedCommittees ?? 0}
          icon={CheckCircle2}
          tone="success"
          description="Finished circles"
        />
      </div>

      <QuickActions actions={quickActions} />

      {nextPayment && (
        <div className="flex flex-col gap-3 rounded-[var(--card-radius)] border border-amber-500/20 bg-amber-50/60 p-3.5 dark:border-amber-400/20 dark:bg-amber-400/[0.07] sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">
              <CalendarDays className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <p className="truncate text-[0.8rem] font-semibold">
                Next payment due ·{" "}
                {nextPayment.committee?.name || "Circle"}
              </p>
              <p className="mt-0.5 truncate text-[11px] text-muted-foreground">
                Round {nextPayment.round} ·{" "}
                {nextPayment.dueDate ? formatDate(nextPayment.dueDate) : ""}
              </p>
            </div>
          </div>
          <div className="flex shrink-0 items-center justify-between gap-3 sm:gap-4">
            <p className="font-heading text-base font-extrabold tabular">
              {formatCurrency(nextPayment.amount, nextPayment.committee?.currency)}
            </p>
            {nextPayment.dueDate && <Countdown date={nextPayment.dueDate} />}
          </div>
        </div>
      )}

      <div className="grid gap-3 lg:grid-cols-3">
        <div className="space-y-3 lg:col-span-2">
          <div className="rounded-[var(--card-radius)] bg-card p-4 ring-1 ring-foreground/[0.06] shadow-[0_10px_26px_-20px_rgba(20,16,31,0.1)]">
            <SectionHeader
              title="Contributions"
              caption="Approved payments · last 6 months"
            />
            <div className="mt-3">
              <div className="flex items-end justify-between gap-2">
                <div>
                  <p className="font-heading text-2xl font-extrabold leading-none tracking-tight tabular">
                    {formatCurrency(periodTotal, primaryCurrency)}
                  </p>
                  <p className="mt-1 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                    6-month total
                  </p>
                </div>
                {delta !== 0 && (
                  <span
                    className={cn(
                      "flex items-center gap-0.5 text-[11px] font-bold",
                      delta > 0 ? "text-success" : "text-danger"
                    )}
                  >
                    <TrendingUp
                      className={cn("h-3 w-3", delta < 0 && "rotate-180")}
                    />
                    {Math.abs(delta)}% vs last month
                  </span>
                )}
              </div>
              {periodTotal > 0 ? (
                <div className="mt-4">
                  <MiniChart
                    data={trendValues}
                    stroke="var(--primary)"
                    className="h-12"
                  />
                  <div className="mt-2 flex justify-between text-[10px] font-medium text-muted-foreground">
                    {trend.map((t) => (
                      <span key={t.label} className="capitalize">
                        {t.label}
                      </span>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="mt-4 flex flex-col items-center gap-2 rounded-xl border border-dashed border-border bg-muted/40 py-6 text-center">
                  <Receipt className="h-5 w-5 text-muted-foreground/70" />
                  <p className="text-[0.8rem] text-muted-foreground">
                    No contributions yet
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <SectionHeader title="Recent activity" href="/payments" />
            {recentActivity.length > 0 ? (
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
            ) : (
              <EmptyState
                icon={CreditCard}
                title="No activity yet"
                description="Your payment activity will show up here."
              />
            )}
          </div>
        </div>

        <div className="space-y-3">
          <div className="space-y-2">
            <SectionHeader title="Upcoming" href="/payments" linkLabel="View all" />
            {upcomingPayments.length > 0 ? (
              <div className="rounded-[var(--card-radius)] bg-card p-1.5 ring-1 ring-foreground/[0.06] shadow-[0_10px_26px_-20px_rgba(20,16,31,0.1)]">
                <ListGroup>
                  {upcomingPayments.map((payment) => (
                    <ListRow
                      key={payment._id}
                      leading={
                        <GradientAvatar
                          name={payment.committee?.name || "Committee"}
                          size="sm"
                        />
                      }
                      title={payment.committee?.name || "Unknown circle"}
                      caption={`Round ${payment.round} · ${payment.dueDate ? formatRelativeDate(payment.dueDate) : ""}`}
                      value={formatCurrency(
                        payment.amount,
                        payment.committee?.currency
                      )}
                      trailing={
                        payment.dueDate ? (
                          <Countdown date={payment.dueDate} />
                        ) : undefined
                      }
                    />
                  ))}
                </ListGroup>
              </div>
            ) : (
              <div className="flex items-center gap-3 rounded-[var(--card-radius)] border border-success/20 bg-success/[0.06] p-3.5">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-success/15 text-success">
                  <CheckCircle2 className="h-5 w-5" />
                </span>
                <div className="min-w-0">
                  <p className="text-[0.8rem] font-semibold">All caught up</p>
                  <p className="mt-0.5 text-[11px] text-muted-foreground">
                    No payments due right now.
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <SectionHeader
              title="Your circles"
              href="/committees"
              linkLabel="View all"
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
              <div className="rounded-[var(--card-radius)] bg-card p-1.5 ring-1 ring-foreground/[0.06] shadow-[0_10px_26px_-20px_rgba(20,16,31,0.1)]">
                <ListGroup>
                  {recentCommittees.map((committee) => {
                    const activeMemberCount =
                      committee.memberCount ?? committee.totalRounds;
                    const progress =
                      activeMemberCount > 0
                        ? Math.round(
                            (committee.currentRound / activeMemberCount) * 100
                          )
                        : 0;
                    return (
                      <Link
                        key={committee._id}
                        href={`/committees/${committee._id}`}
                        className="flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-muted/60"
                      >
                        <GradientAvatar name={committee.name} size="sm" />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-[0.8rem] font-semibold">
                            {committee.name}
                          </p>
                          <div className="mt-1.5 flex items-center gap-2">
                            <Progress
                              value={progress}
                              className="h-1 flex-1"
                            />
                            <span className="shrink-0 text-[10px] font-bold text-primary tabular">
                              {progress}%
                            </span>
                          </div>
                        </div>
                        <span className="shrink-0 text-[10px] font-medium text-muted-foreground tabular">
                          R{committee.currentRound}/{activeMemberCount}
                        </span>
                      </Link>
                    );
                  })}
                </ListGroup>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
