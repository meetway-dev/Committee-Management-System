"use server";

import bcrypt from "bcryptjs";
import { signIn, signOut } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { loginSchema, registerSchema } from "@/schemas/auth.schema";
import type { ApiResponse } from "@/types/api";

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

export async function loginUser(formData: FormData): Promise<ApiResponse> {
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

    return { success: true, message: "Logged in successfully" };
  } catch {
    return { success: false, error: "Invalid email or password" };
  }
}

export async function loginWithGoogle() {
  await signIn("google", { redirectTo: "/dashboard" });
}

export async function logoutUser() {
  await signOut({ redirectTo: "/login" });
}
