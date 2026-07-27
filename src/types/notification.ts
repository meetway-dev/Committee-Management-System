export type NotificationType =
  | "payment_due"
  | "payment_submitted"
  | "payment_approved"
  | "payment_rejected"
  | "payment_late"
  | "member_joined"
  | "member_removed"
  | "committee_started"
  | "committee_completed"
  | "payout_scheduled"
  | "payout_completed"
  | "turn_reminder"
  | "invitation_received"
  | "announcement"
  | "system";

export interface INotification {
  _id: string;
  user: string;
  type: NotificationType;
  title: string;
  body: string;
  actionUrl?: string;
  read: boolean;
  readAt?: Date;
  committee?: string;
  createdAt: Date;
}
