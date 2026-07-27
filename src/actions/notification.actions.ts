"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Notification from "@/models/Notification";
import type { ApiResponse } from "@/types/api";

export async function getNotifications() {
  try {
    const session = await auth();
    if (!session?.user) return [];

    await connectDB();

    const notifications = await Notification.find({
      user: session.user.id,
    })
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    return JSON.parse(JSON.stringify(notifications));
  } catch {
    return [];
  }
}

export async function getUnreadCount() {
  try {
    const session = await auth();
    if (!session?.user) return 0;

    await connectDB();

    return await Notification.countDocuments({
      user: session.user.id,
      read: false,
    });
  } catch {
    return 0;
  }
}

export async function markAsRead(notificationId: string): Promise<ApiResponse> {
  try {
    const session = await auth();
    if (!session?.user) return { success: false, error: "Unauthorized" };

    await connectDB();

    await Notification.findOneAndUpdate(
      { _id: notificationId, user: session.user.id },
      { read: true, readAt: new Date() }
    );

    revalidatePath("/notifications");

    return { success: true };
  } catch {
    return { success: false, error: "Failed to mark as read" };
  }
}

export async function markAllAsRead(): Promise<ApiResponse> {
  try {
    const session = await auth();
    if (!session?.user) return { success: false, error: "Unauthorized" };

    await connectDB();

    await Notification.updateMany(
      { user: session.user.id, read: false },
      { read: true, readAt: new Date() }
    );

    revalidatePath("/notifications");

    return { success: true, message: "All notifications marked as read" };
  } catch {
    return { success: false, error: "Failed to update notifications" };
  }
}

export async function createNotification(data: {
  userId: string;
  type: string;
  title: string;
  body: string;
  actionUrl?: string;
  committeeId?: string;
}) {
  try {
    await connectDB();

    await Notification.create({
      user: data.userId,
      type: data.type,
      title: data.title,
      body: data.body,
      actionUrl: data.actionUrl,
      committee: data.committeeId,
      read: false,
    });
  } catch {
    // Silent fail for notification creation
  }
}
