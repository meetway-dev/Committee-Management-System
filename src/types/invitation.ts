export type InvitationStatus = "pending" | "accepted" | "expired" | "cancelled";
export type InvitationMethod = "email" | "whatsapp" | "link" | "qr";

export interface IInvitation {
  _id: string;
  committee: string;
  invitedBy: string;
  email?: string;
  phone?: string;
  token: string;
  method: InvitationMethod;
  status: InvitationStatus;
  expiresAt: Date;
  acceptedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
