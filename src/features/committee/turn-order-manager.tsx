"use client";

import { setCommitteeTurnOrder } from "@/actions/member.actions";
import { GradientAvatar } from "@/components/shared/gradient-avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/utils/format";
import {
  ArrowDown,
  ArrowUp,
  Dices,
  Loader2,
  Lock,
  RotateCcw,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { toast } from "sonner";

interface TurnMember {
  _id: string;
  role: string;
  turnNumber: number;
  user?: { name?: string; email?: string; image?: string };
}

interface TurnOrderManagerProps {
  committeeId: string;
  currentRound: number;
  currency: string;
  contributionAmount: number;
  isAdmin: boolean;
  turnMode: "fixed" | "random";
  members: TurnMember[];
}

/**
 * Interactive turn schedule. Past turns (already paid out) are locked in
 * place; the admin can reorder the current and upcoming turns and save.
 * In "random" mode a shuffle button randomizes the pending turns.
 * Non-admins see a read-only schedule.
 */
export function TurnOrderManager({
  committeeId,
  currentRound,
  currency,
  contributionAmount,
  isAdmin,
  turnMode,
  members,
}: TurnOrderManagerProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const lockedCount = Math.max(0, currentRound - 1);

  const originalOrder = useMemo(
    () => [...members].sort((a, b) => a.turnNumber - b.turnNumber),
    [members]
  );

  const [order, setOrder] = useState<TurnMember[]>(originalOrder);

  const hasChanges = useMemo(
    () =>
      order.some((member, index) => member._id !== originalOrder[index]?._id),
    [order, originalOrder]
  );

  function move(index: number, direction: "up" | "down") {
    if (index < lockedCount) return;
    const nextIndex = direction === "up" ? index - 1 : index + 1;
    if (nextIndex < 0 || nextIndex >= order.length) return;
    if (nextIndex < lockedCount) return;

    setOrder((current) => {
      const updated = [...current];
      [updated[index], updated[nextIndex]] = [
        updated[nextIndex],
        updated[index],
      ];
      return updated;
    });
  }

  function handleShuffle() {
    setOrder((current) => {
      const updated = [...current];
      const head = updated.slice(0, lockedCount);
      const tail = updated.slice(lockedCount);
      for (let i = tail.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [tail[i], tail[j]] = [tail[j], tail[i]];
      }
      return [...head, ...tail];
    });
  }

  function handleReset() {
    setOrder(originalOrder);
  }

  async function handleSave() {
    if (!hasChanges) return;
    setSaving(true);
    try {
      const result = await setCommitteeTurnOrder(
        committeeId,
        order.map((member) => member._id)
      );
      if (result.success) {
        toast.success(result.message);
        router.refresh();
      } else {
        toast.error(result.error);
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  if (order.length === 0) {
    return (
      <p className="rounded-[var(--card-radius)] bg-card/60 py-8 text-center text-[0.8rem] text-muted-foreground ring-1 ring-foreground/[0.05]">
        No turns scheduled yet. Turns appear once members join this circle.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {isAdmin && (
        <div className="flex items-center gap-2 rounded-xl bg-muted/50 px-3 py-2 text-[11px] font-medium text-muted-foreground">
          <Lock className="h-3.5 w-3.5 shrink-0" />
          <span>Past turns are locked. You can reorder the current and upcoming turns.</span>
          <span className="ml-auto inline-flex shrink-0 items-center gap-1 rounded-full bg-card px-2 py-0.5 font-semibold capitalize text-foreground ring-1 ring-foreground/[0.08]">
            <Dices className="h-3 w-3 text-primary" />
            {turnMode}
          </span>
        </div>
      )}

      <div className="space-y-2">
        {order.map((member, index) => {
          const turnNumber = index + 1;
          const isCurrent = turnNumber === currentRound;
          const isPast = turnNumber < currentRound;
          const isLocked = index < lockedCount;

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
                {turnNumber}
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
                  {formatCurrency(contributionAmount, currency)}
                </p>
                <p
                  className={cn(
                    "mt-0.5 text-[10px] font-medium",
                    isPast
                      ? "text-emerald-600 dark:text-emerald-400"
                      : isCurrent
                      ? "text-primary"
                      : "text-muted-foreground"
                  )}
                >
                  {isPast ? "Received" : isCurrent ? "Current" : "Upcoming"}
                </p>
              </div>
              {isAdmin && !isLocked && (
                <div className="flex shrink-0 flex-col gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-xs"
                    onClick={() => move(index, "up")}
                    disabled={index === lockedCount}
                    aria-label={`Move ${member.user?.name || "member"} up`}
                  >
                    <ArrowUp className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-xs"
                    onClick={() => move(index, "down")}
                    disabled={index === order.length - 1}
                    aria-label={`Move ${member.user?.name || "member"} down`}
                  >
                    <ArrowDown className="h-3.5 w-3.5" />
                  </Button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {isAdmin && (
        <div className="flex flex-wrap items-center justify-end gap-2">
          {hasChanges && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleReset}
              className="gap-1.5 text-muted-foreground"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Reset
            </Button>
          )}
          {turnMode === "random" && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleShuffle}
              disabled={saving}
              className="gap-1.5"
            >
              <Dices className="h-3.5 w-3.5" />
              Shuffle
            </Button>
          )}
          <Button
            type="button"
            size="sm"
            onClick={handleSave}
            disabled={saving || !hasChanges || order.length === 0}
            className="gap-1.5"
          >
            {saving && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            {saving ? "Saving..." : "Save order"}
          </Button>
        </div>
      )}
    </div>
  );
}
