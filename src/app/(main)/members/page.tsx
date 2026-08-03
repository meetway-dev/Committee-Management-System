import { PageHeader } from "@/components/shared/page-header";
import { SectionHeader } from "@/components/shared/section-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { EmptyState } from "@/components/shared/empty-state";
import { ListRow, ListGroup } from "@/components/shared/list-row";
import { GradientAvatar } from "@/components/shared/gradient-avatar";
import { StatPill } from "@/components/shared/stat-pill";
import { getAllMyMembers } from "@/actions/member.actions";
import { formatCurrency } from "@/utils/format";
import { UsersRound, ShieldCheck, Wallet } from "lucide-react";

interface MemberView {
  _id: string;
  role: "admin" | "member";
  status: string;
  turnNumber: number;
  totalPaid: number;
  user?: { name?: string; email?: string; image?: string | null };
}

interface MemberGroup {
  committee: {
    _id: string;
    name: string;
    currency?: string;
    status: string;
  };
  members: MemberView[];
}

export default async function MembersPage() {
  const groups = (await getAllMyMembers()) as MemberGroup[];

  const allMembers = groups.flatMap((g) => g.members);
  const admins = allMembers.filter((m) => m.role === "admin");
  const totalPaid = allMembers.reduce((sum, m) => sum + (m.totalPaid || 0), 0);
  const primaryCurrency = groups[0]?.committee.currency ?? "PKR";

  return (
    <>
      <PageHeader
        title="Members"
        description="Everyone across your circles"
        icon={UsersRound}
      />

      {groups.length === 0 ? (
        <EmptyState
          icon={UsersRound}
          title="No members yet"
          description="Join or create a circle, then invite members to see them here."
          actionLabel="Create Circle"
          actionHref="/committees/new"
        />
      ) : (
        <>
          <div className="grid grid-cols-3 gap-2">
            <StatPill
              icon={UsersRound}
              label="Members"
              value={allMembers.length}
              tone="primary"
            />
            <StatPill
              icon={ShieldCheck}
              label="Admins"
              value={admins.length}
              tone="success"
            />
            <StatPill
              icon={Wallet}
              label="Collected"
              value={formatCurrency(totalPaid, primaryCurrency)}
              tone="default"
            />
          </div>

          {groups.map((group) => (
            <div key={group.committee._id} className="space-y-2">
              <SectionHeader
                title={group.committee.name}
                caption={`${group.members.length} member${
                  group.members.length === 1 ? "" : "s"
                }`}
                href={`/committees/${group.committee._id}`}
                linkLabel="Open"
              />
              {group.members.length === 0 ? (
                <p className="rounded-[var(--card-radius)] bg-card/60 py-6 text-center text-[0.8rem] text-muted-foreground ring-1 ring-foreground/[0.05]">
                  No members in this circle yet
                </p>
              ) : (
                <div className="rounded-[var(--card-radius)] bg-card p-1.5 ring-1 ring-foreground/[0.06] shadow-[0_10px_26px_-20px_rgba(20,16,31,0.1)]">
                  <ListGroup>
                    {group.members.map((member) => (
                      <ListRow
                        key={member._id}
                        leading={
                          <GradientAvatar
                            name={member.user?.name || "Member"}
                            image={member.user?.image}
                            size="md"
                          />
                        }
                        title={member.user?.name || "Unknown member"}
                        caption={
                          member.turnNumber > 0
                            ? `Turn ${member.turnNumber} · ${member.user?.email ?? ""}`
                            : member.user?.email
                        }
                        value={formatCurrency(
                          member.totalPaid || 0,
                          group.committee.currency
                        )}
                        valueCaption="paid"
                        trailing={
                          <StatusBadge
                            status={
                              member.role === "admin" ? "admin" : member.status
                            }
                            dot
                          />
                        }
                      />
                    ))}
                  </ListGroup>
                </div>
              )}
            </div>
          ))}
        </>
      )}
    </>
  );
}
