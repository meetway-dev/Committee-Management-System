import { getCommitteeById } from "@/actions/committee.actions";
import { getCommitteeMembers } from "@/actions/member.actions";
import { getCommitteePayments } from "@/actions/payment.actions";
import { GradientAvatar } from "@/components/shared/gradient-avatar";
import { StatusBadge } from "@/components/shared/status-badge";
import { buttonVariants } from "@/components/ui/button";
import { RecordPaymentForm } from "@/features/payment/record-payment-form";
import { auth } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { formatCurrency, formatDate } from "@/utils/format";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

interface PageProps {
  params: Promise<{ id: string; round: string; userId: string }>;
}

interface PayMember {
  _id: string;
  role: string;
  turnNumber: number;
  user?: { _id: string; name: string; email: string; image?: string };
}

interface PayPayment {
  _id: string;
  member: string;
  round: number;
  amount: number;
  status: string;
  paymentMethod?: string;
  paidDate?: string;
  createdAt: string;
}

export default async function RecordPaymentPage({ params }: PageProps) {
  const { id, round, userId } = await params;

  const [session, committee, members, payments] = await Promise.all([
    auth(),
    getCommitteeById(id),
    getCommitteeMembers(id),
    getCommitteePayments(id),
  ]);

  if (!committee) notFound();

  const roundNum = Number(round);
  const isAdmin =
    committee.userRole === "admin" || session?.user?.role === "superadmin";

  if (!isAdmin) redirect(`/committees/${id}`);

  const activeMemberCount = committee.memberCount || 0;
  if (
    !Number.isInteger(roundNum) ||
    roundNum < 1 ||
    roundNum > activeMemberCount
  ) {
    notFound();
  }

  const memberList = members as PayMember[];
  const member = memberList.find((m) => m.user?._id === userId);
  if (!member) notFound();

  const paymentList = payments as PayPayment[];
  const existingPayment = paymentList.find(
    (p) => p.member === member._id && p.round === roundNum
  );

  return (
    <>
      <div className="flex items-center justify-between gap-3">
        <Link
          href={`/committees/${id}`}
          className={cn(
            buttonVariants({ variant: "ghost", size: "sm" }),
            "-ml-2 gap-1.5 text-muted-foreground"
          )}
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="max-w-40 truncate">{committee.name}</span>
        </Link>
        <StatusBadge status={existingPayment ? "approved" : "pending"} dot />
      </div>

      <div className="flex items-center gap-3 rounded-[var(--card-radius)] bg-card p-4 ring-1 ring-foreground/[0.06] shadow-[0_10px_26px_-20px_rgba(20,16,31,0.1)]">
        <GradientAvatar
          name={member.user?.name || "Member"}
          image={member.user?.image}
          size="lg"
        />
        <div className="min-w-0 flex-1">
          <p className="truncate font-heading text-lg font-extrabold tracking-tight">
            {member.user?.name || "Unknown member"}
          </p>
          <p className="mt-0.5 truncate text-[11px] text-muted-foreground">
            {member.user?.email || "No email"}
          </p>
        </div>
        <div className="shrink-0 text-right">
          <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
            Turn
          </p>
          <p className="font-heading text-lg font-extrabold tabular">
            {member.turnNumber}
          </p>
        </div>
      </div>

      {existingPayment ? (
        <div className="flex flex-col gap-3 rounded-[var(--card-radius)] bg-card p-5 ring-1 ring-foreground/[0.06] shadow-[0_10px_26px_-20px_rgba(20,16,31,0.1)] sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
              <CheckCircle2 className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <p className="text-[0.85rem] font-semibold">
                Payment already recorded
              </p>
              <p className="mt-0.5 truncate text-[11px] text-muted-foreground">
                {formatCurrency(existingPayment.amount, committee.currency)}
                {existingPayment.paymentMethod
                  ? ` · ${existingPayment.paymentMethod.replace(/-/g, " ")}`
                  : ""}
                {" · "}
                {existingPayment.paidDate
                  ? formatDate(existingPayment.paidDate)
                  : formatDate(existingPayment.createdAt)}
              </p>
            </div>
          </div>
          <Link
            href={`/committees/${id}`}
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              "shrink-0"
            )}
          >
            Back to circle
          </Link>
        </div>
      ) : (
        <RecordPaymentForm
          committeeId={id}
          memberId={userId}
          round={roundNum}
          contributionAmount={committee.contributionAmount}
          currency={committee.currency}
        />
      )}
    </>
  );
}
