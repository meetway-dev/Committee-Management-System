import mongoose, { Document, Model, Schema } from "mongoose";

export interface PaymentDocument extends Document {
  committee: mongoose.Types.ObjectId;
  member: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  round: number;
  amount: number;
  dueDate: Date;
  paidDate?: Date;
  status: "pending" | "approved" | "rejected" | "late" | "overdue";
  paymentMethod?: string;
  proofImage?: string;
  notes?: string;
  approvedBy?: mongoose.Types.ObjectId;
  approvedAt?: Date;
  rejectionReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

const paymentSchema = new Schema<PaymentDocument>(
  {
    committee: { type: Schema.Types.ObjectId, ref: "Committee", required: true },
    member: { type: Schema.Types.ObjectId, ref: "CommitteeMember", required: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    round: { type: Number, required: true },
    amount: { type: Number, required: true, min: 0 },
    dueDate: { type: Date, required: true },
    paidDate: { type: Date },
    status: { type: String, enum: ["pending", "approved", "rejected", "late", "overdue"], default: "pending" },
    paymentMethod: {
      type: String,
      enum: [
        "bank-transfer",
        "easypaisa",
        "jazzcash",
        "cash",
        "mobile-wallet",
        "cheque",
        "online",
        "other",
      ],
    },
    proofImage: { type: String },
    notes: { type: String },
    approvedBy: { type: Schema.Types.ObjectId, ref: "User" },
    approvedAt: { type: Date },
    rejectionReason: { type: String },
  },
  { timestamps: true }
);

paymentSchema.index({ committee: 1, member: 1, round: 1 });
paymentSchema.index({ committee: 1, status: 1 });
paymentSchema.index({ user: 1 });

const Payment: Model<PaymentDocument> = mongoose.models.Payment || mongoose.model<PaymentDocument>("Payment", paymentSchema);
export default Payment;
