export type UserRole = "user" | "superadmin";
export type UserStatus = "active" | "suspended" | "deleted";
export type AuthProvider = "credentials" | "google";

export interface IUser {
  _id: string;
  name: string;
  email: string;
  password?: string;
  image?: string;
  phone?: string;
  whatsapp?: string;
  country?: string;
  city?: string;
  bio?: string;
  role: UserRole;
  emailVerified?: Date | null;
  provider: AuthProvider;
  providerId?: string;
  status: UserStatus;
  deletedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}
