export type CommitteeStatus = "draft" | "active" | "completed" | "archived";
export type CommitteeFrequency = "daily" | "weekly" | "monthly";
export type CommitteeVisibility = "private" | "public" | "invite-only";

export interface ICommittee {
  _id: string;
  name: string;
  description?: string;
  image?: string;
  admin: string;
  contributionAmount: number;
  currency: string;
  frequency: CommitteeFrequency;
  maxMembers: number;
  minMembers: number;
  startDate?: Date;
  paymentDueDay: number;
  gracePeriodDays: number;
  visibility: CommitteeVisibility;
  turnMode: "random" | "fixed";
  rules?: string;
  status: CommitteeStatus;
  currentRound: number;
  totalRounds: number;
  deletedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}
