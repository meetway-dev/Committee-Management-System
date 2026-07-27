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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { EmptyState } from "@/components/shared/empty-state";
import { getCommitteeById } from "@/actions/committee.actions";
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
} from "lucide-react";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function CommitteeDetailPage({ params }: PageProps) {
  const { id } = await params;
  const committee = await getCommitteeById(id);

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
                  {formatCurrency(
                    committee.contributionAmount,
                    committee.currency
                  )}
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
          <TabsTrigger value="members">Members</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="turns">Turns</TabsTrigger>
        </TabsList>

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
                <span className="text-sm text-muted-foreground">
                  Payment Due Day
                </span>
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
                    <span className="text-sm text-muted-foreground">
                      Late Fee
                    </span>
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
                    <span className="text-sm text-muted-foreground">
                      Grace Period
                    </span>
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
                    <span className="text-sm text-muted-foreground">
                      Start Date
                    </span>
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

        <TabsContent value="members">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Members</CardTitle>
                {committee.userRole === "admin" && (
                  <Link
                    href={`/committees/${id}/invite`}
                    className={cn(
                      buttonVariants({ size: "sm" }),
                      "gap-1.5"
                    )}
                  >
                    <UserPlus className="h-4 w-4" />
                    Invite
                  </Link>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <EmptyState
                icon={Users}
                title="Members will appear here"
                description="Invite members to join this committee."
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Payments</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <EmptyState
                icon={CreditCard}
                title="No payments yet"
                description="Payments will appear here once the committee is active."
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="turns">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Turn Schedule</CardTitle>
              <CardDescription>
                View the payout schedule for all members
              </CardDescription>
            </CardHeader>
            <CardContent>
              <EmptyState
                icon={Calendar}
                title="No turns scheduled"
                description="Turns will be scheduled once the committee starts."
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
