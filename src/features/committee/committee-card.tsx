import { GradientAvatar } from "@/components/shared/gradient-avatar";
import { StatusBadge } from "@/components/shared/status-badge";
import { Progress } from "@/components/ui/progress";
import type { ICommittee } from "@/types/committee";
import { formatCurrency } from "@/utils/format";
import { ChevronRight, Users } from "lucide-react";
import Link from "next/link";

interface PopulatedCommittee extends Omit<ICommittee, "admin"> {
  admin?: string | { name?: string; image?: string };
  memberCount?: number;
}

interface CommitteeCardProps {
  committee: PopulatedCommittee;
}

export function CommitteeCard({ committee }: CommitteeCardProps) {
  const progress =
    committee.totalRounds > 0
      ? Math.round((committee.currentRound / committee.totalRounds) * 100)
      : 0;

  const members = committee.memberCount ?? committee.maxMembers;

  return (
    <Link
      href={`/committees/${committee._id}`}
      className="group flex flex-col gap-2.5 rounded-[var(--card-radius)] bg-card p-3 ring-1 ring-foreground/[0.06] shadow-[0_8px_24px_-20px_rgba(11,21,18,0.14)] transition-all duration-150 hover:ring-primary/25 active:scale-[0.99]"
    >
      <div className="flex items-center gap-2.5">
        <GradientAvatar name={committee.name} size="md" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-[0.85rem] font-bold leading-tight transition-colors group-hover:text-primary">
            {committee.name}
          </p>
          <p className="mt-0.5 truncate text-[11px] text-muted-foreground">
            {formatCurrency(committee.contributionAmount, committee.currency)}
            <span className="capitalize"> / {committee.frequency}</span>
          </p>
        </div>
        <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground/50" />
      </div>

      {committee.status === "active" && committee.totalRounds > 0 && (
        <div>
          <div className="flex items-center justify-between text-[10px] font-medium text-muted-foreground">
            <span>
              Round {committee.currentRound}/{committee.totalRounds}
            </span>
            <span className="font-bold text-primary tabular">{progress}%</span>
          </div>
          <Progress value={progress} className="mt-1 h-1" />
        </div>
      )}

      <div className="flex items-center justify-between gap-2 border-t border-border/60 pt-2">
        <span className="flex items-center gap-1 text-[11px] font-medium text-muted-foreground">
          <Users className="h-3.5 w-3.5" />
          {members} members
        </span>
        <StatusBadge status={committee.status} dot />
      </div>
    </Link>
  );
}

interface CommitteeCardListProps {
  committees: PopulatedCommittee[];
  emptyMessage?: string;
}

export function CommitteeCardList({
  committees,
  emptyMessage = "No circles yet",
}: CommitteeCardListProps) {
  if (committees.length === 0) {
    return (
      <p className="rounded-[var(--card-radius)] bg-card/60 py-8 text-center text-[0.8rem] text-muted-foreground ring-1 ring-foreground/[0.05]">
        {emptyMessage}
      </p>
    );
  }

  return (
    <div className="grid gap-2.5 sm:grid-cols-2 xl:grid-cols-3">
      {committees.map((committee) => (
        <CommitteeCard key={committee._id} committee={committee} />
      ))}
    </div>
  );
}
