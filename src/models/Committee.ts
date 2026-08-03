import mongoose, { Document, Model, Schema } from "mongoose";

export interface CommitteeDocument extends Document {
  name: string;
  description?: string;
  image?: string;
  admin: mongoose.Types.ObjectId;
  contributionAmount: number;
  currency: string;
  frequency: "daily" | "weekly" | "monthly";
  maxMembers: number;
  minMembers: number;
  startDate?: Date;
  paymentDueDay: number;
  gracePeriodDays: number;
  visibility: "private" | "public" | "invite-only";
  rules?: string;
  status: "draft" | "active" | "completed" | "archived";
  turnMode: "random" | "fixed";
  currentRound: number;
  totalRounds: number;
  deletedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const committeeSchema = new Schema<CommitteeDocument>(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    image: { type: String },
    admin: { type: Schema.Types.ObjectId, ref: "User", required: true },
    contributionAmount: { type: Number, required: true, min: 0 },
    currency: { type: String, required: true, default: "PKR" },
    frequency: { type: String, enum: ["daily", "weekly", "monthly"], required: true },
    maxMembers: { type: Number, required: true, min: 2 },
    minMembers: { type: Number, required: true, min: 2 },
    startDate: { type: Date },
    paymentDueDay: { type: Number, min: 1, max: 28, default: 1 },
    gracePeriodDays: { type: Number, default: 0, min: 0 },
    visibility: { type: String, enum: ["private", "public", "invite-only"], default: "private" },
    rules: { type: String },
    status: { type: String, enum: ["draft", "active", "completed", "archived"], default: "draft" },
    turnMode: { type: String, enum: ["random", "fixed"], default: "random" },
    currentRound: { type: Number, default: 1 },
    totalRounds: { type: Number, default: 1 },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

committeeSchema.index({ admin: 1 });
committeeSchema.index({ status: 1 });

const Committee: Model<CommitteeDocument> = mongoose.models.Committee || mongoose.model<CommitteeDocument>("Committee", committeeSchema);
export default Committee;
