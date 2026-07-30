import Link from "next/link";
// removed unused imports: cn, buttonVariants
import { StatusBadge } from "@/components/shared/status-badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { ICommittee } from "@/types/committee";
import { formatCurrency, getInitials } from "@/utils/format";
import { Calendar, Users } from "lucide-react";

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

  return (
    <Link href={`/committees/${committee._id}`}>
      <Card className="group transition-all hover:shadow-md hover:border-primary/20">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <CardTitle className="truncate text-base font-bold font-heading group-hover:text-primary transition-colors">
                {committee.name}
              </CardTitle>
              <p className="mt-0.5 text-sm text-muted-foreground">
                {formatCurrency(committee.contributionAmount, committee.currency)}{" "}
                / {committee.frequency}
              </p>
            </div>
            <StatusBadge status={committee.status} />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {committee.status === "active" && (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>
                  Round {committee.currentRound} of {committee.totalRounds}
                </span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="h-1.5" />
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Users className="h-3.5 w-3.5" />
                {committee.memberCount ?? committee.maxMembers} members
              </span>
              {committee.startDate && (
                <span className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  {new Date(committee.startDate).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              )}
            </div>

            {committee.admin && typeof committee.admin === "object" && (
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
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

interface CommitteeCardListProps {
  committees: PopulatedCommittee[];
  emptyMessage?: string;
}

export function CommitteeCardList({
  committees,
  emptyMessage = "No committees yet",
}: CommitteeCardListProps) {
  if (committees.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-muted-foreground">
        {emptyMessage}
      </p>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {committees.map((committee) => (
        <CommitteeCard key={committee._id} committee={committee} />
      ))}
    </div>
  );
}
