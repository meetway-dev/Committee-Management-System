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
import { PublishCommitteeButton } from "@/features/committee/publish-committee-button";
import { TurnOrderManager } from "@/features/committee/turn-order-manager";
import { MemberRemoveButton } from "@/features/member/member-remove-button";
import { MonthlyCollection } from "@/features/payment/monthly-collection";
import { cn } from "@/lib/utils";
import { formatCurrency, formatDate } from "@/utils/format";
import {
    ArrowLeft,
    Calendar,
    Clock,
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
  member: string;
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

  const activeMemberCount = committee.memberCount || 0;
  const progress = activeMemberCount > 0
    ? Math.round((committee.currentRound / activeMemberCount) * 100)
    : 0;

  const poolAmount = committee.contributionAmount * committee.maxMembers;
  const isAdmin = committee.userRole === "admin";
  const assignedMembersLabel = `${activeMemberCount}/${committee.maxMembers} seats`;

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
          {committee.status === "draft" && isAdmin && (
            <PublishCommitteeButton
              committeeId={id}
              className="mt-0.5 shrink-0"
            />
          )}
        </div>
      </div>

      {!isAdmin && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-3 text-[0.8rem] text-amber-900 dark:border-amber-900/60 dark:bg-amber-950/20 dark:text-amber-200">
          Read-only access for this circle. Only the admin can manage members, settings, and payment records.
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
          {/* Key numbers — value-first pills */}
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            <StatPill
              icon={Wallet}
              label="Contribution"
              value={formatCurrency(
                committee.contributionAmount,
                committee.currency
              )}
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
              value={assignedMembersLabel}
              tone="warning"
            />
            <StatPill
              icon={Clock}
              label="Frequency"
              value={committee.frequency}
            />
          </div>

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
            caption={`${memberList.length} assigned member${memberList.length === 1 ? "" : "s"} · ${committee.maxMembers} seat capacity`}
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
          <MonthlyCollection
            committeeId={id}
            currency={committee.currency}
            contributionAmount={committee.contributionAmount}
            frequency={committee.frequency}
            startDate={committee.startDate ? String(committee.startDate) : null}
            memberCount={activeMemberCount}
            currentRound={committee.currentRound}
            isAdmin={isAdmin}
            members={memberList}
            payments={paymentList}
          />
        </TabsContent>

        {/* Turns */}
        <TabsContent value="turns" className="mt-2.5 space-y-2">
          <SectionHeader
            title="Turn schedule"
            caption={`Payout order for ${memberList.length} assigned member${memberList.length === 1 ? "" : "s"}`}
          />
          {memberList.length === 0 ? (
            <EmptyState
              icon={Calendar}
              title="No turns scheduled"
              description="Turns are scheduled once the circle starts."
            />
          ) : (
            <TurnOrderManager
              committeeId={id}
              currentRound={committee.currentRound}
              currency={committee.currency}
              contributionAmount={committee.contributionAmount}
              isAdmin={isAdmin}
              members={memberList}
            />
          )}
        </TabsContent>
      </Tabs>
    </>
  );
}
