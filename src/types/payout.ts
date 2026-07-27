export type PayoutStatus = "scheduled" | "completed" | "skipped";

export interface IPayout {
  _id: string;
  committee: string;
  recipient: string;
  user: string;
  round: number;
  amount: number;
  status: PayoutStatus;
  scheduledDate: Date;
  completedDate?: Date;
  method?: string;
  createdAt: Date;
  updatedAt: Date;
}
