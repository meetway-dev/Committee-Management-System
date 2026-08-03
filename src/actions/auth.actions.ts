"use server";

import { getBaseUrl, normalizeRedirectPath } from "@/lib/app-url";
import { signIn, signOut } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { sendPasswordResetEmail } from "@/lib/email";
import User from "@/models/User";
import {
    forgotPasswordSchema,
    loginSchema,
    registerSchema,
    resetPasswordSchema,
} from "@/schemas/auth.schema";
import type { ApiResponse } from "@/types/api";
import bcrypt from "bcryptjs";
import crypto from "crypto";

async function getAppUrl(path = "/") {
  return getBaseUrl(path);
}

export async function registerUser(
  formData: FormData
): Promise<ApiResponse<{ id: string }>> {
  try {
    const data = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      confirmPassword: formData.get("confirmPassword") as string,
      phone: (formData.get("phone") as string) || undefined,
      whatsapp: (formData.get("whatsapp") as string) || undefined,
      country: (formData.get("country") as string) || undefined,
      city: (formData.get("city") as string) || undefined,
    };

    const validated = registerSchema.safeParse(data);
    if (!validated.success) {
      return {
        success: false,
        error: validated.error.errors[0].message,
      };
    }

    await connectDB();

    const existingUser = await User.findOne({ email: data.email });
    if (existingUser) {
      return { success: false, error: "Email already registered" };
    }

    const hashedPassword = await bcrypt.hash(data.password, 12);

    const user = await User.create({
      name: data.name,
      email: data.email,
      password: hashedPassword,
      phone: data.phone,
      whatsapp: data.whatsapp,
      country: data.country,
      city: data.city,
      provider: "credentials",
      status: "active",
    });

    return {
      success: true,
      data: { id: user._id.toString() },
      message: "Account created successfully",
    };
  } catch {
    return { success: false, error: "Something went wrong. Please try again." };
  }
}

export async function loginUser(
  formData: FormData,
  redirectTo = "/dashboard"
): Promise<ApiResponse> {
  try {
    const data = {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    };

    const validated = loginSchema.safeParse(data);
    if (!validated.success) {
      return {
        success: false,
        error: validated.error.errors[0].message,
      };
    }

    await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    return {
      success: true,
      message: "Logged in successfully",
      data: { redirectTo: normalizeRedirectPath(redirectTo, "/dashboard") },
    };
  } catch {
    return { success: false, error: "Invalid email or password" };
  }
}

export async function loginWithGoogle(redirectTo?: string) {
  const safeRedirect = normalizeRedirectPath(redirectTo, "/dashboard");
  await signIn("google", {
    redirectTo: safeRedirect,
  });
}

export async function requestPasswordReset(
  email: string
): Promise<ApiResponse> {
  const validated = forgotPasswordSchema.safeParse({ email });

  if (!validated.success) {
    return {
      success: false,
      error: validated.error.errors[0].message,
    };
  }

  try {
    await connectDB();

    const normalizedEmail = validated.data.email.toLowerCase();
    const user = await User.findOne({
      email: normalizedEmail,
      status: "active",
    });

    if (user) {
      const token = crypto.randomBytes(32).toString("hex");
      const expiresAt = new Date(Date.now() + 30 * 60 * 1000);

      user.resetToken = token;
      user.resetTokenExpiresAt = expiresAt;
      await user.save();

      const baseUrl = await getBaseUrl();
      const resetUrl = new URL("/reset-password", baseUrl);
      resetUrl.searchParams.set("token", token);

      const emailSent = await sendPasswordResetEmail(user.email, resetUrl.toString());
      if (!emailSent) {
        console.warn("Password reset email was not delivered. Configure real Gmail SMTP keys in .env to enable email sending.");
      }
    }

    return {
      success: true,
      message: "If an account exists with this email, a reset link has been sent.",
    };
  } catch {
    return {
      success: false,
      error: "Unable to send password reset email. Please try again.",
    };
  }
}

export async function resetUserPassword(data: {
  token: string;
  password: string;
  confirmPassword: string;
}): Promise<ApiResponse> {
  const validated = resetPasswordSchema.safeParse(data);

  if (!validated.success) {
    return {
      success: false,
      error: validated.error.errors[0].message,
    };
  }

  try {
    await connectDB();

    const user = await User.findOne({
      resetToken: validated.data.token,
      resetTokenExpiresAt: { $gt: new Date() },
    });

    if (!user) {
      return {
        success: false,
        error: "This reset link is invalid or has expired.",
      };
    }

    user.password = await bcrypt.hash(validated.data.password, 12);
    user.resetToken = null;
    user.resetTokenExpiresAt = null;
    await user.save();

    return {
      success: true,
      message: "Your password has been reset successfully.",
    };
  } catch {
    return {
      success: false,
      error: "Failed to reset password. Please try again.",
    };
  }
}

export async function logoutUser() {
  await signOut({ redirectTo: "/login" });
}
