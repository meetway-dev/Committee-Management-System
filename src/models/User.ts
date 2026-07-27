import mongoose, { Schema, Document, Model } from "mongoose";

export interface UserDocument extends Document {
  name: string;
  email: string;
  password?: string;
  image?: string;
  phone?: string;
  whatsapp?: string;
  country?: string;
  city?: string;
  bio?: string;
  role: "user" | "superadmin";
  emailVerified?: Date | null;
  provider: "credentials" | "google";
  providerId?: string;
  status: "active" | "suspended" | "deleted";
  deletedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<UserDocument>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, select: false },
    image: { type: String },
    phone: { type: String, trim: true },
    whatsapp: { type: String, trim: true },
    country: { type: String, trim: true },
    city: { type: String, trim: true },
    bio: { type: String, maxlength: 500 },
    role: { type: String, enum: ["user", "superadmin"], default: "user" },
    emailVerified: { type: Date, default: null },
    provider: { type: String, enum: ["credentials", "google"], default: "credentials" },
    providerId: { type: String },
    status: { type: String, enum: ["active", "suspended", "deleted"], default: "active" },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

const User: Model<UserDocument> = mongoose.models.User || mongoose.model<UserDocument>("User", userSchema);
export default User;
