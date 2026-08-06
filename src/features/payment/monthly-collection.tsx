"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  addDays,
  addMonths,
  addWeeks,
  endOfMonth,
  format,
  startOfDay,
} from "date-fns";
import { GradientAvatar } from "@/components/shared/gradient-avatar";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/utils/format";
import { CalendarRange, Check, CircleDollarSign, Receipt } from "lucide-react";

export interface MonthlyMember {
  _id: string;
  role: string;
  turnNumber: number;
  totalPaid: number;
  status: string;
  user?: { _id: string; name: string; email: string; image?: string };
}

export interface MonthlyPayment {
  _id: string;
  member: string;
  round: number;
  amount: number;
  status: string;
  createdAt: string;
}

interface MonthlyCollectionProps {
  committeeId: string;
  currency: string;
  contributionAmount: number;
  frequency: string;
  startDate?: string | null;
  memberCount: number;
  currentRound: number;
  isAdmin: boolean;
  members: MonthlyMember[];
  payments: MonthlyPayment[];
}

interface Period {
  round: number;
  start: Date;
  end: Date;
  label: string;
}

function buildPeriods(start: Date, count: number, frequency: string): Period[] {
  const periods: Period[] = [];
  let cursor = startOfDay(start);

  for (let i = 0; i < count; i++) {
    const round = i + 1;
    if (frequency === "daily") {
      periods.push({
        round,
        start: cursor,
        end: cursor,
        label: format(cursor, "dd MMM yyyy"),
      });
      cursor = addDays(cursor, 1);
    } else if (frequency === "weekly") {
      const end = addDays(cursor, 6);
      periods.push({
        round,
        start: cursor,
        end,
        label: `${format(cursor, "dd MMM")} – ${format(end, "dd MMM")}`,
      });
      cursor = addWeeks(cursor, 1);
    } else {
      periods.push({
        round,
        start: cursor,
        end: endOfMonth(cursor),
        label: format(cursor, "MMMM yyyy"),
      });
      cursor = addMonths(cursor, 1);
    }
  }

  return periods;
}

/**
 * Admin collection surface for a committee. A period (round) dropdown defaults
 * to the current month, and lists every assigned member with their payment
 * state for that round and a one-click route to record payment.
 */
export function MonthlyCollection({
  committeeId,
  currency,
  contributionAmount,
  frequency,
  startDate,
  memberCount,
  currentRound,
  isAdmin,
  members,
  payments,
}: MonthlyCollectionProps) {
  const periods = useMemo(() => {
    const base = startDate ? new Date(startDate) : new Date();
    if (Number.isNaN(base.getTime())) return [];
    return buildPeriods(base, Math.max(memberCount, 1), frequency);
  }, [startDate, memberCount, frequency]);

  const today = startOfDay(new Date());

  const defaultRound = useMemo(() => {
    if (periods.length === 0) return 1;
    const inRange = periods.find((p) => today >= p.start && today <= p.end);
    if (inRange) return inRange.round;
    const byProgress = periods.find((p) => p.round === currentRound);
    if (byProgress) return byProgress.round;
    return periods[periods.length - 1]?.round ?? 1;
  }, [periods, today, currentRound]);

  const [selectedRound, setSelectedRound] = useState(defaultRound);
  const selectedPeriod = periods.find((p) => p.round === selectedRound);

  const paymentByKey = useMemo(() => {
    const map = new Map<string, MonthlyPayment>();
    for (const p of payments) map.set(`${p.member}:${p.round}`, p);
    return map;
  }, [payments]);

  const rows = useMemo(() => {
    const activeMembers = members.filter((m) => m.status === "active");
    return activeMembers.map((member) => {
      const payment = paymentByKey.get(`${member._id}:${selectedRound}`);
      return { member, paid: payment?.status === "approved" };
    });
  }, [members, paymentByKey, selectedRound]);

  const paidCount = rows.filter((r) => r.paid).length;
  const progress = rows.length > 0 ? Math.round((paidCount / rows.length) * 100) : 0;

  if (periods.length === 0) return null;

  return (
    <div className="rounded-[var(--card-radius)] bg-card p-4 ring-1 ring-foreground/[0.06] shadow-[0_10px_26px_-20px_rgba(20,16,31,0.1)]">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2.5">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary">
            <Receipt className="h-4 w-4" />
          </span>
          <div className="min-w-0">
            <h2 className="truncate font-heading text-[0.95rem] font-bold tracking-tight">
              Monthly collection
            </h2>
            <p className="mt-0.5 truncate text-[11px] text-muted-foreground">
              Select a period and record each member&apos;s contribution
            </p>
          </div>
        </div>

        <Select
          value={String(selectedRound)}
          onValueChange={(v) => {
            if (v) setSelectedRound(Number(v));
          }}
        >
          <SelectTrigger className="w-auto shrink-0 gap-2 px-3">
            <CalendarRange className="size-4 text-muted-foreground" />
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent align="end" className="min-w-56">
            {periods.map((period) => (
              <SelectItem key={period.round} value={String(period.round)}>
                <span className="capitalize">{period.label}</span>
                <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-bold text-muted-foreground">
                  Round {period.round}
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedPeriod && (
        <div className="mt-3.5">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate text-[0.8rem] font-semibold capitalize">
                {selectedPeriod.label}
              </p>
              <p className="mt-0.5 text-[11px] text-muted-foreground">
                Round {selectedPeriod.round} of {periods.length} ·{" "}
                {paidCount} of {rows.length} paid
              </p>
            </div>
            <p className="shrink-0 font-heading text-base font-extrabold tabular">
              {formatCurrency(contributionAmount, currency)}
              <span className="ml-1 text-[10px] font-semibold text-muted-foreground">
                / member
              </span>
            </p>
          </div>
          <Progress value={progress} className="mt-2 h-1.5" />
        </div>
      )}

      {rows.length === 0 ? (
        <div className="mt-3.5 flex flex-col items-center gap-2 rounded-xl border border-dashed border-border bg-muted/40 py-6 text-center">
          <CircleDollarSign className="h-5 w-5 text-muted-foreground/70" />
          <p className="text-[0.8rem] text-muted-foreground">
            No members assigned yet
          </p>
          <p className="text-[11px] text-muted-foreground/70">
            Payments can be recorded once members join this circle.
          </p>
        </div>
      ) : (
        <div className="mt-3.5 divide-y divide-border/60 border-t border-border/60">
          {rows.map(({ member, paid }) => {
            const isAdminMember = member.role === "admin";
            return (
              <div key={member._id} className="flex items-center gap-3 py-3">
                <GradientAvatar
                  name={member.user?.name || "Member"}
                  image={member.user?.image}
                  size="md"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[0.8rem] font-semibold">
                    {member.user?.name || "Unknown"}
                    {isAdminMember && (
                      <span className="ml-1.5 rounded-full bg-primary-soft px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-primary">
                        Admin
                      </span>
                    )}
                  </p>
                  <p className="mt-0.5 truncate text-[11px] text-muted-foreground">
                    {member.user?.email || "No email"}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  {paid ? (
                    <>
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
                        <Check className="h-3 w-3" />
                        Paid
                      </span>
                      {isAdmin && member.user && (
                        <Link
                          href={`/committees/${committeeId}/pay/${selectedRound}/${member.user._id}`}
                        >
                          <Button
                            variant="ghost"
                            size="xs"
                            className="text-muted-foreground"
                          >
                            View
                          </Button>
                        </Link>
                      )}
                    </>
                  ) : isAdmin && member.user ? (
                    <Link
                      href={`/committees/${committeeId}/pay/${selectedRound}/${member.user._id}`}
                    >
                      <Button size="sm" className="gap-1.5">
                        <CircleDollarSign className="h-3.5 w-3.5" />
                        Pay
                      </Button>
                    </Link>
                  ) : (
                    <span
                      className={cn(
                        "inline-flex items-center rounded-full bg-amber-100 px-2.5 py-1 text-[11px] font-semibold text-amber-700 dark:bg-amber-900/40 dark:text-amber-300"
                      )}
                    >
                      Pending
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
