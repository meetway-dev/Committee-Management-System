import mongoose, { Schema, Document, Model } from "mongoose";

export interface SettingsDocument extends Document {
  user: mongoose.Types.ObjectId;
  theme: "light" | "dark" | "system";
  language: string;
  notifications: {
    email: boolean;
    push: boolean;
    whatsapp: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}

const settingsSchema = new Schema<SettingsDocument>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    theme: { type: String, enum: ["light", "dark", "system"], default: "system" },
    language: { type: String, default: "en" },
    notifications: {
      email: { type: Boolean, default: true },
      push: { type: Boolean, default: true },
      whatsapp: { type: Boolean, default: false },
    },
  },
  { timestamps: true }
);

const Settings: Model<SettingsDocument> = mongoose.models.Settings || mongoose.model<SettingsDocument>("Settings", settingsSchema);
export default Settings;
