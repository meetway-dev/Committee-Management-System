export type PaymentStatus = "pending" | "approved" | "rejected" | "late" | "overdue";
export type PaymentMethod =
  | "bank-transfer"
  | "easypaisa"
  | "jazzcash"
  | "cash"
  | "mobile-wallet"
  | "cheque"
  | "online"
  | "other";

export interface IPayment {
  _id: string;
  committee: string;
  member: string;
  user: string;
  round: number;
  amount: number;
  dueDate: Date;
  paidDate?: Date;
  status: PaymentStatus;
  paymentMethod?: PaymentMethod;
  proofImage?: string;
  notes?: string;
  approvedBy?: string;
  approvedAt?: Date;
  rejectionReason?: string;
  createdAt: Date;
  updatedAt: Date;
}
