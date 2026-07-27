import mongoose, { Schema, Document, Model } from "mongoose";

export interface InvitationDocument extends Document {
  committee: mongoose.Types.ObjectId;
  invitedBy: mongoose.Types.ObjectId;
  email?: string;
  phone?: string;
  token: string;
  method: "email" | "whatsapp" | "link" | "qr";
  status: "pending" | "accepted" | "expired" | "cancelled";
  expiresAt: Date;
  acceptedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const invitationSchema = new Schema<InvitationDocument>(
  {
    committee: { type: Schema.Types.ObjectId, ref: "Committee", required: true },
    invitedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    email: { type: String, lowercase: true, trim: true },
    phone: { type: String, trim: true },
    token: { type: String, required: true, unique: true },
    method: { type: String, enum: ["email", "whatsapp", "link", "qr"], default: "link" },
    status: { type: String, enum: ["pending", "accepted", "expired", "cancelled"], default: "pending" },
    expiresAt: { type: Date, required: true },
    acceptedAt: { type: Date },
  },
  { timestamps: true }
);

invitationSchema.index({ token: 1 }, { unique: true });
invitationSchema.index({ committee: 1 });

const Invitation: Model<InvitationDocument> = mongoose.models.Invitation || mongoose.model<InvitationDocument>("Invitation", invitationSchema);
export default Invitation;
