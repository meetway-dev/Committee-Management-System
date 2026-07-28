"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import type { ApiResponse } from "@/types/api";

export async function getProfile() {
  try {
    const session = await auth();
    if (!session?.user) return null;

    await connectDB();

    const user = await User.findById(session.user.id)
      .select("-password")
      .lean();

    return user ? JSON.parse(JSON.stringify(user)) : null;
  } catch {
    return null;
  }
}

export async function updateProfile(data: {
  name?: string;
  phone?: string;
  whatsapp?: string;
  country?: string;
  city?: string;
  bio?: string;
}): Promise<ApiResponse> {
  try {
    const session = await auth();
    if (!session?.user) return { success: false, error: "Unauthorized" };

    await connectDB();

    await User.findByIdAndUpdate(session.user.id, {
      $set: data,
    });

    revalidatePath("/profile");

    return { success: true, message: "Profile updated successfully" };
  } catch {
    return { success: false, error: "Failed to update profile" };
  }
}

export async function changePassword(data: {
  currentPassword: string;
  newPassword: string;
}): Promise<ApiResponse> {
  try {
    const session = await auth();
    if (!session?.user) return { success: false, error: "Unauthorized" };

    await connectDB();

    const user = await User.findById(session.user.id);
    if (!user) return { success: false, error: "User not found" };
    if (!user.password) {
      return {
        success: false,
        error: "Password change not available for social logins",
      };
    }

    const isValid = await bcrypt.compare(data.currentPassword, user.password);
    if (!isValid) {
      return { success: false, error: "Current password is incorrect" };
    }

    user.password = await bcrypt.hash(data.newPassword, 12);
    await user.save();

    return { success: true, message: "Password changed successfully" };
  } catch {
    return { success: false, error: "Failed to change password" };
  }
}
