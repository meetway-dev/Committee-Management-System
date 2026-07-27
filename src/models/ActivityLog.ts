import mongoose, { Schema, Document, Model } from "mongoose";

export interface ActivityLogDocument extends Document {
  committee: mongoose.Types.ObjectId;
  actor: mongoose.Types.ObjectId;
  action: string;
  metadata?: Record<string, unknown>;
  description: string;
  createdAt: Date;
}

const activityLogSchema = new Schema<ActivityLogDocument>(
  {
    committee: { type: Schema.Types.ObjectId, ref: "Committee", required: true },
    actor: { type: Schema.Types.ObjectId, ref: "User", required: true },
    action: { type: String, required: true },
    metadata: { type: Schema.Types.Mixed },
    description: { type: String, required: true },
  },
  { timestamps: true }
);

activityLogSchema.index({ committee: 1, createdAt: -1 });

const ActivityLog: Model<ActivityLogDocument> = mongoose.models.ActivityLog || mongoose.model<ActivityLogDocument>("ActivityLog", activityLogSchema);
export default ActivityLog;
