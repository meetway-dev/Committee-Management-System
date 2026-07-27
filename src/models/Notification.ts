import mongoose, { Schema, Document, Model } from "mongoose";

export interface NotificationDocument extends Document {
  user: mongoose.Types.ObjectId;
  type: string;
  title: string;
  body: string;
  actionUrl?: string;
  read: boolean;
  readAt?: Date;
  committee?: mongoose.Types.ObjectId;
  createdAt: Date;
}

const notificationSchema = new Schema<NotificationDocument>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    type: { type: String, required: true },
    title: { type: String, required: true },
    body: { type: String, required: true },
    actionUrl: { type: String },
    read: { type: Boolean, default: false },
    readAt: { type: Date },
    committee: { type: Schema.Types.ObjectId, ref: "Committee" },
  },
  { timestamps: true }
);

notificationSchema.index({ user: 1, read: 1 });
notificationSchema.index({ user: 1, createdAt: -1 });

const Notification: Model<NotificationDocument> = mongoose.models.Notification || mongoose.model<NotificationDocument>("Notification", notificationSchema);
export default Notification;
