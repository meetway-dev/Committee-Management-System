import mongoose, { Schema, Document, Model } from "mongoose";

export interface CommitteeMemberDocument extends Document {
  committee: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  role: "admin" | "member";
  turnNumber: number;
  totalPaid: number;
  status: "active" | "removed" | "left";
  joinedAt: Date;
  removedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const committeeMemberSchema = new Schema<CommitteeMemberDocument>(
  {
    committee: { type: Schema.Types.ObjectId, ref: "Committee", required: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    role: { type: String, enum: ["admin", "member"], default: "member" },
    turnNumber: { type: Number, default: 0 },
    totalPaid: { type: Number, default: 0 },
    status: { type: String, enum: ["active", "removed", "left"], default: "active" },
    joinedAt: { type: Date, default: Date.now },
    removedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

committeeMemberSchema.index({ committee: 1, user: 1 }, { unique: true });
committeeMemberSchema.index({ committee: 1, status: 1 });

const CommitteeMember: Model<CommitteeMemberDocument> = mongoose.models.CommitteeMember || mongoose.model<CommitteeMemberDocument>("CommitteeMember", committeeMemberSchema);
export default CommitteeMember;
