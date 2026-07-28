import { notFound } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { EmptyState } from "@/components/shared/empty-state";
import { getCommitteeById } from "@/actions/committee.actions";
import { getCommitteeMembers } from "@/actions/member.actions";
import { getCommitteePayments } from "@/actions/payment.actions";
import { PaymentSubmitForm } from "@/features/payment/payment-submit-form";
import { PaymentActions } from "@/features/payment/payment-actions";
import { MemberRemoveButton } from "@/features/member/member-remove-button";
import { formatCurrency, formatDate, getInitials } from "@/utils/format";
import {
  Users,
  ArrowLeft,
  Calendar,
  Wallet,
  Clock,
  UserPlus,
  CreditCard,
  Shield,
  Settings,
  TrendingUp,
  Crown,
} from "lucide-react";

interface PageProps {
  params: Promise<{ id: string }>;
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

  const progress =
    committee.totalRounds > 0
      ? Math.round((committee.currentRound / committee.totalRounds) * 100)
      : 0;

  const poolAmount = committee.contributionAmount * committee.maxMembers;

  return (
    <div className="space-y-6">
      <PageHeader
        title={committee.name}
        description={committee.description || "No description"}
        icon={Users}
        action={
          <div className="flex items-center gap-2">
            <Link
              href="/committees"
              className={cn(
                buttonVariants({ variant: "ghost", size: "sm" }),
                "gap-1.5"
              )}
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Link>
            {committee.userRole === "admin" && (
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
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-primary/10 p-2.5 text-primary">
                <Wallet className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Contribution</p>
                <p className="text-lg font-extrabold tracking-tight font-heading">
                  {formatCurrency(committee.contributionAmount, committee.currency)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-blue-100 p-2.5 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300">
                <TrendingUp className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Pool Amount</p>
                <p className="text-lg font-extrabold tracking-tight font-heading">
                  {formatCurrency(poolAmount, committee.currency)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-emerald-100 p-2.5 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Members</p>
                <p className="text-lg font-extrabold tracking-tight font-heading">
                  {committee.memberCount} / {committee.maxMembers}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-yellow-100 p-2.5 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-300">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Frequency</p>
                <p className="text-lg font-extrabold tracking-tight font-heading capitalize">
                  {committee.frequency}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {committee.status === "active" && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                Round {committee.currentRound} of {committee.totalRounds}
              </span>
              <span className="font-medium">{progress}%</span>
            </div>
            <Progress value={progress} className="mt-2 h-2" />
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="w-full justify-start overflow-x-auto">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="members">Members ({members.length})</TabsTrigger>
          <TabsTrigger value="payments">Payments ({payments.length})</TabsTrigger>
          <TabsTrigger value="turns">Turns</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Committee Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Status</span>
                <StatusBadge status={committee.status} />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Created by</span>
                <div className="flex items-center gap-2">
                  {committee.admin && typeof committee.admin === "object" && (
                    <>
                      <Avatar className="h-6 w-6">
                        <AvatarImage
                          src={committee.admin.image || ""}
                          alt={committee.admin.name || ""}
                        />
                        <AvatarFallback className="text-[10px]">
                          {committee.admin.name
                            ? getInitials(committee.admin.name)
                            : "A"}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium">
                        {committee.admin.name}
                      </span>
                    </>
                  )}
                </div>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Visibility</span>
                <span className="text-sm font-medium capitalize">
                  {committee.visibility}
                </span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Payment Due Day</span>
                <span className="text-sm font-medium">
                  {committee.paymentDueDay}
                  {committee.paymentDueDay === 1
                    ? "st"
                    : committee.paymentDueDay === 2
                    ? "nd"
                    : committee.paymentDueDay === 3
                    ? "rd"
                    : "th"}{" "}
                  of each period
                </span>
              </div>
              {committee.lateFee > 0 && (
                <>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Late Fee</span>
                    <span className="text-sm font-medium">
                      {formatCurrency(committee.lateFee, committee.currency)}
                    </span>
                  </div>
                </>
              )}
              {committee.gracePeriodDays > 0 && (
                <>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Grace Period</span>
                    <span className="text-sm font-medium">
                      {committee.gracePeriodDays} days
                    </span>
                  </div>
                </>
              )}
              {committee.startDate && (
                <>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Start Date</span>
                    <span className="text-sm font-medium">
                      {formatDate(committee.startDate)}
                    </span>
                  </div>
                </>
              )}
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Created</span>
                <span className="text-sm font-medium">
                  {formatDate(committee.createdAt)}
                </span>
              </div>
            </CardContent>
          </Card>

          {committee.rules && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Committee Rules
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {committee.rules}
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Members Tab */}
        <TabsContent value="members">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Members</CardTitle>
                {committee.userRole === "admin" && (
                  <Link
                    href={`/committees/${id}/invite`}
                    className={cn(buttonVariants({ size: "sm" }), "gap-1.5")}
                  >
                    <UserPlus className="h-4 w-4" />
                    Invite
                  </Link>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {members.length === 0 ? (
                <EmptyState
                  icon={Users}
                  title="No members yet"
                  description="Invite members to join this committee."
                />
              ) : (
                <div className="space-y-3">
                  {members.map(
                    (member: {
                      _id: string;
                      user?: { _id: string; name: string; email: string; image?: string };
                      role: string;
                      turnNumber: number;
                      totalPaid: number;
                      status: string;
                    }) => (
                      <div
                        key={member._id}
                        className="flex items-center justify-between rounded-lg border p-3"
                      >
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9">
                            <AvatarImage
                              src={member.user?.image || ""}
                              alt={member.user?.name || ""}
                            />
                            <AvatarFallback className="text-xs">
                              {member.user?.name
                                ? getInitials(member.user.name)
                                : "U"}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium">
                                {member.user?.name || "Unknown"}
                              </span>
                              {member.role === "admin" && (
                                <Badge
                                  variant="secondary"
                                  className="gap-1 px-1.5 py-0 text-[10px]"
                                >
                                  <Crown className="h-2.5 w-2.5" />
                                  Admin
                                </Badge>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {member.user?.email}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <p className="text-xs text-muted-foreground">
                              Turn #{member.turnNumber}
                            </p>
                            <p className="text-xs font-medium">
                              Paid: {formatCurrency(member.totalPaid, committee.currency)}
                            </p>
                          </div>
                          {committee.userRole === "admin" &&
                            member.role !== "admin" && (
                              <MemberRemoveButton
                                committeeId={id}
                                memberId={member._id}
                                memberName={member.user?.name || "this member"}
                              />
                            )}
                        </div>
                      </div>
                    )
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payments Tab */}
        <TabsContent value="payments" className="space-y-4">
          {committee.status === "active" && (
            <PaymentSubmitForm
              committeeId={id}
              contributionAmount={committee.contributionAmount}
              currency={committee.currency}
              currentRound={committee.currentRound}
            />
          )}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Payments</CardTitle>
            </CardHeader>
            <CardContent>
              {payments.length === 0 ? (
                <EmptyState
                  icon={CreditCard}
                  title="No payments yet"
                  description="Payments will appear here once members start contributing."
                />
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Member</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Round</TableHead>
                        <TableHead>Method</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date</TableHead>
                        {committee.userRole === "admin" && (
                          <TableHead className="w-[80px]">Actions</TableHead>
                        )}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {payments.map(
                        (payment: {
                          _id: string;
                          user?: { name: string; image?: string };
                          amount: number;
                          round: number;
                          paymentMethod?: string;
                          status: string;
                          createdAt: string;
                        }) => (
                          <TableRow key={payment._id}>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Avatar className="h-7 w-7">
                                  <AvatarImage
                                    src={payment.user?.image || ""}
                                    alt={payment.user?.name || ""}
                                  />
                                  <AvatarFallback className="text-[10px]">
                                    {payment.user?.name
                                      ? getInitials(payment.user.name)
                                      : "U"}
                                  </AvatarFallback>
                                </Avatar>
                                <span className="text-sm">
                                  {payment.user?.name || "Unknown"}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell className="font-medium">
                              {formatCurrency(payment.amount, committee.currency)}
                            </TableCell>
                            <TableCell>{payment.round}</TableCell>
                            <TableCell className="capitalize text-muted-foreground">
                              {payment.paymentMethod?.replace("-", " ") || "—"}
                            </TableCell>
                            <TableCell>
                              <StatusBadge status={payment.status} />
                            </TableCell>
                            <TableCell className="text-muted-foreground">
                              {formatDate(payment.createdAt)}
                            </TableCell>
                            {committee.userRole === "admin" && (
                              <TableCell>
                                <PaymentActions
                                  paymentId={payment._id}
                                  paymentStatus={payment.status}
                                  isAdmin={true}
                                />
                              </TableCell>
                            )}
                          </TableRow>
                        )
                      )}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Turns Tab */}
        <TabsContent value="turns">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Turn Schedule</CardTitle>
              <CardDescription>
                View the payout schedule for all members
              </CardDescription>
            </CardHeader>
            <CardContent>
              {members.length === 0 ? (
                <EmptyState
                  icon={Calendar}
                  title="No turns scheduled"
                  description="Turns will be scheduled once the committee starts."
                />
              ) : (
                <div className="space-y-2">
                  {members
                    .sort(
                      (a: { turnNumber: number }, b: { turnNumber: number }) =>
                        a.turnNumber - b.turnNumber
                    )
                    .map(
                      (member: {
                        _id: string;
                        user?: { name: string; image?: string };
                        turnNumber: number;
                      }) => (
                        <div
                          key={member._id}
                          className={cn(
                            "flex items-center justify-between rounded-lg border p-3",
                            member.turnNumber === committee.currentRound &&
                              "border-primary/30 bg-primary/5"
                          )}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={cn(
                                "flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold",
                                member.turnNumber === committee.currentRound
                                  ? "bg-primary text-primary-foreground"
                                  : member.turnNumber < committee.currentRound
                                  ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300"
                                  : "bg-muted text-muted-foreground"
                              )}
                            >
                              {member.turnNumber}
                            </div>
                            <div className="flex items-center gap-2">
                              <Avatar className="h-7 w-7">
                                <AvatarImage
                                  src={member.user?.image || ""}
                                  alt={member.user?.name || ""}
                                />
                                <AvatarFallback className="text-[10px]">
                                  {member.user?.name
                                    ? getInitials(member.user.name)
                                    : "U"}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-sm font-medium">
                                {member.user?.name || "Unknown"}
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-semibold">
                              {formatCurrency(poolAmount, committee.currency)}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {member.turnNumber < committee.currentRound
                                ? "Received"
                                : member.turnNumber === committee.currentRound
                                ? "Current"
                                : "Upcoming"}
                            </p>
                          </div>
                        </div>
                      )
                    )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
