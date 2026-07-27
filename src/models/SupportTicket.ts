import mongoose, { Schema, Document, Model } from "mongoose";

export interface SupportTicketDocument extends Document {
  user: mongoose.Types.ObjectId;
  subject: string;
  description: string;
  status: "open" | "in-progress" | "resolved" | "closed";
  priority: "low" | "medium" | "high" | "urgent";
  messages: Array<{
    sender: mongoose.Types.ObjectId;
    body: string;
    createdAt: Date;
  }>;
  assignedTo?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const supportTicketSchema = new Schema<SupportTicketDocument>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    subject: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    status: { type: String, enum: ["open", "in-progress", "resolved", "closed"], default: "open" },
    priority: { type: String, enum: ["low", "medium", "high", "urgent"], default: "medium" },
    messages: [
      {
        sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
        body: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    assignedTo: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

supportTicketSchema.index({ user: 1 });
supportTicketSchema.index({ status: 1 });

const SupportTicket: Model<SupportTicketDocument> = mongoose.models.SupportTicket || mongoose.model<SupportTicketDocument>("SupportTicket", supportTicketSchema);
export default SupportTicket;
