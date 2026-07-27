import mongoose, { Schema, Document, Model } from "mongoose";

export interface PayoutDocument extends Document {
  committee: mongoose.Types.ObjectId;
  recipient: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  round: number;
  amount: number;
  status: "scheduled" | "completed" | "skipped";
  scheduledDate: Date;
  completedDate?: Date;
  method?: string;
  createdAt: Date;
  updatedAt: Date;
}

const payoutSchema = new Schema<PayoutDocument>(
  {
    committee: { type: Schema.Types.ObjectId, ref: "Committee", required: true },
    recipient: { type: Schema.Types.ObjectId, ref: "CommitteeMember", required: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    round: { type: Number, required: true },
    amount: { type: Number, required: true, min: 0 },
    status: { type: String, enum: ["scheduled", "completed", "skipped"], default: "scheduled" },
    scheduledDate: { type: Date, required: true },
    completedDate: { type: Date },
    method: { type: String },
  },
  { timestamps: true }
);

payoutSchema.index({ committee: 1, round: 1 });

const Payout: Model<PayoutDocument> = mongoose.models.Payout || mongoose.model<PayoutDocument>("Payout", payoutSchema);
export default Payout;
