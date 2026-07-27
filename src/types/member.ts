export type MemberRole = "admin" | "member";
export type MemberStatus = "active" | "removed" | "left";

export interface ICommitteeMember {
  _id: string;
  committee: string;
  user: string;
  role: MemberRole;
  turnNumber: number;
  totalPaid: number;
  status: MemberStatus;
  joinedAt: Date;
  removedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}
