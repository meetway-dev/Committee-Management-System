"use server";

import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import Committee from "@/models/Committee";
import Payment from "@/models/Payment";
import SupportTicket from "@/models/SupportTicket";
import type { ApiResponse } from "@/types/api";

export async function getAdminStats() {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "superadmin") return null;

    await connectDB();

    const [totalUsers, totalCommittees, totalPayments, openTickets] =
      await Promise.all([
        User.countDocuments({ deletedAt: null }),
        Committee.countDocuments({ deletedAt: null }),
        Payment.countDocuments({}),
        SupportTicket.countDocuments({ status: { $in: ["open", "in-progress"] } }),
      ]);

    return { totalUsers, totalCommittees, totalPayments, openTickets };
  } catch {
    return null;
  }
}

export async function getAdminUsers() {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "superadmin") return [];

    await connectDB();

    const users = await User.find({ deletedAt: null })
      .select("name email image role status createdAt")
      .sort({ createdAt: -1 })
      .lean();

    return JSON.parse(JSON.stringify(users));
  } catch {
    return [];
  }
}

export async function getAdminCommittees() {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "superadmin") return [];

    await connectDB();

    const committees = await Committee.find({ deletedAt: null })
      .populate("admin", "name email")
      .sort({ createdAt: -1 })
      .lean();

    return JSON.parse(JSON.stringify(committees));
  } catch {
    return [];
  }
}

export async function getSupportTickets() {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "superadmin") return [];

    await connectDB();

    const tickets = await SupportTicket.find({})
      .populate("user", "name email image")
      .sort({ createdAt: -1 })
      .lean();

    return JSON.parse(JSON.stringify(tickets));
  } catch {
    return [];
  }
}

export async function updateUserRole(
  userId: string,
  role: string
): Promise<ApiResponse> {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "superadmin") {
      return { success: false, error: "Unauthorized" };
    }

    await connectDB();

    await User.findByIdAndUpdate(userId, { role });

    return { success: true, message: "User role updated" };
  } catch {
    return { success: false, error: "Failed to update role" };
  }
}

export async function updateTicketStatus(
  ticketId: string,
  status: string,
  response?: string
): Promise<ApiResponse> {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "superadmin") {
      return { success: false, error: "Unauthorized" };
    }

    await connectDB();

    const update: Record<string, unknown> = { status };
    if (response) {
      update.$push = {
        responses: {
          message: response,
          respondedBy: session.user.id,
          respondedAt: new Date(),
        },
      };
    }

    await SupportTicket.findByIdAndUpdate(ticketId, update);

    return { success: true, message: "Ticket updated" };
  } catch {
    return { success: false, error: "Failed to update ticket" };
  }
}
