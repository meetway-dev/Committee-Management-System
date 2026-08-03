import { getCommitteeById } from "@/actions/committee.actions";
import { getCommitteeMembers } from "@/actions/member.actions";
import { getCommitteePayments } from "@/actions/payment.actions";
import { EmptyState } from "@/components/shared/empty-state";
import { GradientAvatar } from "@/components/shared/gradient-avatar";
import { ListGroup, ListRow } from "@/components/shared/list-row";
import { SectionHeader } from "@/components/shared/section-header";
import { StatPill } from "@/components/shared/stat-pill";
import { StatusBadge } from "@/components/shared/status-badge";
import { buttonVariants } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DraftTurnOrderManager } from "@/features/committee/draft-turn-order-manager";
import { PublishCommitteeButton } from "@/features/committee/publish-committee-button";
import { MemberRemoveButton } from "@/features/member/member-remove-button";
import { AdminRecordPayment } from "@/features/payment/admin-record-payment";
import { PaymentActions } from "@/features/payment/payment-actions";
import { cn } from "@/lib/utils";
import { formatCurrency, formatDate } from "@/utils/format";
import {
    ArrowLeft,
    Calendar,
    Clock,
    CreditCard,
    Settings,
    Shield,
    TrendingUp,
    UserPlus,
    Users,
    Wallet,
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ id: string }>;
}

interface DetailMember {
  _id: string;
  user?: { _id: string; name: string; email: string; image?: string };
  role: string;
  turnNumber: number;
  totalPaid: number;
  status: string;
}

interface DetailPayment {
  _id: string;
  user?: { name: string; image?: string };
  amount: number;
  round: number;
  paymentMethod?: string;
  status: string;
  createdAt: string;
  proofImage?: string;
}

/** Compact label/value row used by the overview spec sheet. */
function SpecRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-3 py-2.5">
      <span className="text-[0.8rem] text-muted-foreground">{label}</span>
      <div className="text-right text-[0.8rem] font-semibold capitalize">
        {children}
      </div>
    </div>
  );
}

function ordinal(day: number) {
  if (day === 1) return "st";
  if (day === 2) return "nd";
  if (day === 3) return "rd";
  return "th";
}

export default async function CommitteeDetailPage({ params }: PageProps) {
  const { id } = await params;
  const [committee, members, payments] = await Promise.all([
    getCommitteeById(id),
    getCommitteeMembers(id),
    getCommitteePayments(id),
  ]);

  if (!committee) {
    notFound();
  }

  const memberList = members as DetailMember[];
  const paymentList = payments as DetailPayment[];

  const progress =
    committee.totalRounds > 0
      ? Math.round((committee.currentRound / committee.totalRounds) * 100)
      : 0;

  const poolAmount = committee.contributionAmount * committee.maxMembers;
  const isAdmin = committee.userRole === "admin";

  return (
    <>
      {/* Compact hero: back link, name, status, admin settings */}
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <Link
            href="/committees"
            className={cn(
              buttonVariants({ variant: "ghost", size: "sm" }),
              "-ml-2 gap-1.5 text-muted-foreground"
            )}
          >
            <ArrowLeft className="h-4 w-4" />
            Circles
          </Link>
          {isAdmin && (
            <Link
              href={`/committees/${id}/settings`}
              className={cn(
                buttonVariants({ variant: "outline", size: "sm" }),
                "gap-1.5"
              )}
            >
              <Settings className="h-4 w-4" />
              Settings
            </Link>
          )}
        </div>

        <div className="flex items-start gap-3">
          <GradientAvatar name={committee.name} size="lg" />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <h1 className="min-w-0 truncate font-heading text-xl font-bold tracking-tight">
                {committee.name}
              </h1>
              <StatusBadge status={committee.status} dot />
            </div>
            <p className="mt-0.5 line-clamp-2 text-[0.8rem] text-muted-foreground">
              {committee.description || "No description"}
            </p>
          </div>
        </div>
      </div>

      {!isAdmin && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-3 text-[0.8rem] text-amber-900 dark:border-amber-900/60 dark:bg-amber-950/20 dark:text-amber-200">
          Read-only access for this circle. Only the admin can manage members, settings, and payment records.
        </div>
      )}

      {/* Key numbers — value-first pills */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        <StatPill
          icon={Wallet}
          label="Contribution"
          value={formatCurrency(committee.contributionAmount, committee.currency)}
          tone="primary"
        />
        <StatPill
          icon={TrendingUp}
          label="Pool"
          value={formatCurrency(poolAmount, committee.currency)}
          tone="success"
        />
        <StatPill
          icon={Users}
          label="Members"
          value={`${committee.memberCount}/${committee.maxMembers}`}
        />
        <StatPill icon={Clock} label="Cycle" value={committee.frequency} />
      </div>

      {committee.status === "draft" && isAdmin && (
        <div className="rounded-2xl bg-amber-50 p-3.5 ring-1 ring-amber-200/70 dark:bg-amber-950/30 dark:ring-amber-900/50">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <p className="text-[0.8rem] font-semibold text-amber-900 dark:text-amber-200">
                Draft circle
              </p>
              <p className="mt-0.5 text-[11px] text-amber-800/80 dark:text-amber-300/80">
                Publish this circle before members can contribute.
              </p>
            </div>
            <PublishCommitteeButton committeeId={id} />
          </div>
        </div>
      )}

      {committee.status === "draft" &&
        committee.turnMode === "fixed" &&
        isAdmin && (
          <DraftTurnOrderManager committeeId={id} members={members} />
        )}

      {committee.status === "active" && (
        <div className="rounded-[var(--card-radius)] bg-card p-3.5 ring-1 ring-foreground/[0.06] shadow-[0_10px_26px_-20px_rgba(20,16,31,0.1)]">
          <div className="flex items-baseline justify-between">
            <p className="text-[0.8rem] font-semibold">
              Round {committee.currentRound}
              <span className="text-muted-foreground">
                {" "}
                of {committee.totalRounds}
              </span>
            </p>
            <p className="font-heading text-lg font-bold tabular text-primary">
              {progress}%
            </p>
          </div>
          <Progress value={progress} className="mt-2 h-1.5" />
        </div>
      )}

      <Tabs defaultValue="overview">
        <TabsList className="w-full">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="members">Members ({memberList.length})</TabsTrigger>
          <TabsTrigger value="payments">
            Payments ({paymentList.length})
          </TabsTrigger>
          <TabsTrigger value="turns">Turns</TabsTrigger>
        </TabsList>

        {/* Overview */}
        <TabsContent value="overview" className="mt-2.5 space-y-3">
          <div className="rounded-2xl bg-card px-3.5 ring-1 ring-foreground/[0.06]">
            <div className="divide-y divide-border/60">
              {committee.admin && typeof committee.admin === "object" && (
                <SpecRow label="Created by">
                  <div className="flex items-center justify-end gap-1.5">
                    <GradientAvatar
                      name={committee.admin.name || "Admin"}
                      image={committee.admin.image}
                      size="xs"
                    />
                    <span>{committee.admin.name}</span>
                  </div>
                </SpecRow>
              )}
              <SpecRow label="Visibility">{committee.visibility}</SpecRow>
              <SpecRow label="Turn order">
                {committee.turnMode || "random"}
              </SpecRow>
              <SpecRow label="Payment due">
                {committee.paymentDueDay}
                {ordinal(committee.paymentDueDay)} of each period
              </SpecRow>
              {committee.lateFee > 0 && (
                <SpecRow label="Late fee">
                  {formatCurrency(committee.lateFee, committee.currency)}
                </SpecRow>
              )}
              {committee.gracePeriodDays > 0 && (
                <SpecRow label="Grace period">
                  {committee.gracePeriodDays} days
                </SpecRow>
              )}
              {committee.startDate && (
                <SpecRow label="Start date">
                  {formatDate(committee.startDate)}
                </SpecRow>
              )}
              <SpecRow label="Created">{formatDate(committee.createdAt)}</SpecRow>
            </div>
          </div>

          {committee.rules && (
            <div className="space-y-2">
              <SectionHeader title="Circle rules" />
              <div className="rounded-2xl bg-card p-3.5 ring-1 ring-foreground/[0.06]">
                <div className="flex gap-2.5">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary">
                    <Shield className="h-4 w-4" />
                  </div>
                  <p className="whitespace-pre-wrap text-[0.8rem] leading-relaxed text-muted-foreground">
                    {committee.rules}
                  </p>
                </div>
              </div>
            </div>
          )}
        </TabsContent>

        {/* Members */}
        <TabsContent value="members" className="mt-2.5 space-y-2">
          <SectionHeader
            title="Members"
            caption={`${memberList.length} of ${committee.maxMembers} seats filled`}
            action={
              isAdmin ? (
                <Link
                  href={`/committees/${id}/invite`}
                  className={cn(buttonVariants({ size: "sm" }), "gap-1.5")}
                >
                  <UserPlus className="h-4 w-4" />
                  Invite
                </Link>
              ) : undefined
            }
          />
          {memberList.length === 0 ? (
            <EmptyState
              icon={Users}
              title="No members yet"
              description="Invite members to join this circle."
            />
          ) : (
            <div className="rounded-2xl bg-card p-1.5 ring-1 ring-foreground/[0.06]">
              <ListGroup>
                {memberList.map((member) => (
                  <ListRow
                    key={member._id}
                    leading={
                      <GradientAvatar
                        name={member.user?.name || "Member"}
                        image={member.user?.image}
                        size="md"
                      />
                    }
                    title={member.user?.name || "Unknown"}
                    caption={
                      member.turnNumber > 0
                        ? `Turn ${member.turnNumber} · ${member.user?.email ?? ""}`
                        : member.user?.email
                    }
                    value={formatCurrency(member.totalPaid, committee.currency)}
                    valueCaption="paid"
                    trailing={
                      <div className="flex items-center gap-1.5">
                        <StatusBadge
                          status={
                            member.role === "admin" ? "admin" : member.status
                          }
                          dot
                        />
                        {isAdmin && member.role !== "admin" && (
                          <MemberRemoveButton
                            committeeId={id}
                            memberId={member._id}
                            memberName={member.user?.name || "this member"}
                          />
                        )}
                      </div>
                    }
                  />
                ))}
              </ListGroup>
            </div>
          )}
        </TabsContent>

        {/* Payments */}
        <TabsContent value="payments" className="mt-2.5 space-y-3">
          {isAdmin && (
            <AdminRecordPayment
              committeeId={id}
              members={members}
              contributionAmount={committee.contributionAmount}
            />
          )}

          <div className="space-y-2">
            <SectionHeader
              title="Payment history"
              caption={`${paymentList.length} record${
                paymentList.length === 1 ? "" : "s"
              }`}
            />
            {paymentList.length === 0 ? (
              <EmptyState
                icon={CreditCard}
                title="No payments yet"
                description="Payments appear here once members start contributing."
              />
            ) : (
              <div className="rounded-2xl bg-card p-1.5 ring-1 ring-foreground/[0.06]">
                <ListGroup>
                  {paymentList.map((payment) => (
                    <ListRow
                      key={payment._id}
                      leading={
                        <GradientAvatar
                          name={payment.user?.name || "Member"}
                          image={payment.user?.image}
                          size="md"
                        />
                      }
                      title={payment.user?.name || "Unknown"}
                      caption={
                        <span className="capitalize">
                          {`Round ${payment.round}${
                            payment.paymentMethod
                              ? ` · ${payment.paymentMethod.replace(/-/g, " ")}`
                              : ""
                          } · ${formatDate(payment.createdAt)}`}
                        </span>
                      }
                      value={formatCurrency(payment.amount, committee.currency)}
                      trailing={
                        <div className="flex items-center gap-1.5">
                          {payment.proofImage && (
                            <a
                              href={payment.proofImage}
                              target="_blank"
                              rel="noreferrer"
                              className="shrink-0 overflow-hidden rounded-lg ring-1 ring-foreground/10 transition-opacity hover:opacity-80"
                              aria-label={`View payment proof from ${
                                payment.user?.name || "member"
                              }`}
                            >
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={payment.proofImage}
                                alt=""
                                className="h-8 w-8 object-cover"
                              />
                            </a>
                          )}
                          <StatusBadge status={payment.status} dot />
                          {isAdmin && (
                            <PaymentActions
                              paymentId={payment._id}
                              paymentStatus={payment.status}
                              isAdmin={true}
                            />
                          )}
                        </div>
                      }
                    />
                  ))}
                </ListGroup>
              </div>
            )}
          </div>
        </TabsContent>

        {/* Turns */}
        <TabsContent value="turns" className="mt-2.5 space-y-2">
          <SectionHeader
            title="Turn schedule"
            caption="Payout order for all members"
          />
          {memberList.length === 0 ? (
            <EmptyState
              icon={Calendar}
              title="No turns scheduled"
              description="Turns are scheduled once the circle starts."
            />
          ) : (
            <div className="space-y-2">
              {[...memberList]
                .sort((a, b) => a.turnNumber - b.turnNumber)
                .map((member) => {
                  const isCurrent = member.turnNumber === committee.currentRound;
                  const isPast = member.turnNumber < committee.currentRound;

                  return (
                    <div
                      key={member._id}
                      className={cn(
                        "flex items-center gap-2.5 rounded-2xl p-2.5 ring-1",
                        isCurrent
                          ? "bg-primary-soft ring-primary/40"
                          : "bg-card ring-foreground/[0.06]"
                      )}
                    >
                      <div
                        className={cn(
                          "flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-[0.8rem] font-bold tabular",
                          isCurrent
                            ? "bg-primary text-primary-foreground"
                            : isPast
                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300"
                            : "bg-muted text-muted-foreground"
                        )}
                      >
                        {member.turnNumber}
                      </div>
                      <GradientAvatar
                        name={member.user?.name || "Member"}
                        image={member.user?.image}
                        size="sm"
                      />
                      <p className="min-w-0 flex-1 truncate text-[0.8rem] font-semibold">
                        {member.user?.name || "Unknown"}
                      </p>
                      <div className="shrink-0 text-right">
                        <p className="text-[0.8rem] font-bold leading-tight tabular">
                          {formatCurrency(poolAmount, committee.currency)}
                        </p>
                        <p className="mt-0.5 text-[10px] text-muted-foreground">
                          {isPast
                            ? "Received"
                            : isCurrent
                            ? "Current"
                            : "Upcoming"}
                        </p>
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </>
  );
}
