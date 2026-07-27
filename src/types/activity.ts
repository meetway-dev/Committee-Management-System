export type ActivityAction =
  | "committee_created"
  | "committee_updated"
  | "committee_started"
  | "committee_completed"
  | "committee_archived"
  | "member_joined"
  | "member_removed"
  | "member_left"
  | "ownership_transferred"
  | "payment_submitted"
  | "payment_approved"
  | "payment_rejected"
  | "payout_completed"
  | "turn_assigned"
  | "rules_updated"
  | "announcement_posted";

export interface IActivityLog {
  _id: string;
  committee: string;
  actor: string;
  action: ActivityAction;
  metadata?: Record<string, unknown>;
  description: string;
  createdAt: Date;
}
