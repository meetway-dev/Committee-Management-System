"use server";

import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Committee from "@/models/Committee";
import CommitteeMember from "@/models/CommitteeMember";
import Payment from "@/models/Payment";
import type { ApiResponse } from "@/types/api";
import mongoose from "mongoose";
import { revalidatePath } from "next/cache";

function normalizeProofImage(value?: string): string | undefined {
  if (!value) return undefined;

  const trimmed = value.trim();
  if (!trimmed) return undefined;

  if (trimmed.startsWith("data:")) return undefined;

  try {
    const url = new URL(trimmed);
    if (url.protocol !== "http:" && url.protocol !== "https:") {
      return undefined;
    }
    return url.toString();
  } catch {
    return undefined;
  }
}

export async function submitPayment(
  committeeId: string,
  data: {
    amount: number;
    paymentMethod?: string;
    proofImage?: string;
    notes?: string;
  }
): Promise<ApiResponse<{ id: string }>> {
  try {
    const session = await auth();
    if (!session?.user) return { success: false, error: "Unauthorized" };

    await connectDB();

    const committee = await Committee.findById(committeeId);
    if (!committee) return { success: false, error: "Committee not found" };

    if (committee.status !== "active") {
      return { success: false, error: "Committee is not active" };
    }

    const membership = await CommitteeMember.findOne({
      committee: committeeId,
      user: session.user.id,
      status: "active",
    });

    if (!membership) {
      return { success: false, error: "You are not a member" };
    }

    return {
      success: false,
      error: "Payment submission is disabled. The admin records payments manually for this circle.",
    };
  } catch {
    return { success: false, error: "Failed to submit payment" };
  }
}

export async function approvePayment(
  paymentId: string
): Promise<ApiResponse> {
  try {
    const session = await auth();
    if (!session?.user) return { success: false, error: "Unauthorized" };

    await connectDB();

    const payment = await Payment.findById(paymentId);
    if (!payment) return { success: false, error: "Payment not found" };

    const adminMembership = await CommitteeMember.findOne({
      committee: payment.committee,
      user: session.user.id,
      role: "admin",
      status: "active",
    });

    if (!adminMembership && session.user.role !== "superadmin") {
      return { success: false, error: "Only admin can approve payments" };
    }

    payment.status = "approved";
    payment.approvedBy = new mongoose.Types.ObjectId(session.user.id);
    payment.approvedAt = new Date();
    payment.paidDate = new Date();
    await payment.save();

    const member = await CommitteeMember.findById(payment.member);
    if (member) {
      member.totalPaid += payment.amount;
      await member.save();
    }

    revalidatePath(`/committees/${payment.committee}`);
    revalidatePath("/payments");

    return { success: true, message: "Payment approved" };
  } catch {
    return { success: false, error: "Failed to approve payment" };
  }
}

export async function rejectPayment(
  paymentId: string,
  reason: string
): Promise<ApiResponse> {
  try {
    const session = await auth();
    if (!session?.user) return { success: false, error: "Unauthorized" };

    await connectDB();

    const payment = await Payment.findById(paymentId);
    if (!payment) return { success: false, error: "Payment not found" };

    const adminMembership = await CommitteeMember.findOne({
      committee: payment.committee,
      user: session.user.id,
      role: "admin",
      status: "active",
    });

    if (!adminMembership && session.user.role !== "superadmin") {
      return { success: false, error: "Only admin can reject payments" };
    }

    payment.status = "rejected";
    payment.rejectionReason = reason;
    await payment.save();

    revalidatePath(`/committees/${payment.committee}`);
    revalidatePath("/payments");

    return { success: true, message: "Payment rejected" };
  } catch {
    return { success: false, error: "Failed to reject payment" };
  }
}

export async function getMyPayments() {
  try {
    const session = await auth();
    if (!session?.user) return [];

    await connectDB();

    const payments = await Payment.find({
      user: session.user.id,
    })
      .populate("committee", "name currency contributionAmount frequency")
      .sort({ createdAt: -1 })
      .lean();

    return JSON.parse(JSON.stringify(payments));
  } catch {
    return [];
  }
}

export async function getCommitteePayments(committeeId: string) {
  try {
    const session = await auth();
    if (!session?.user) return [];

    await connectDB();

    const payments = await Payment.find({
      committee: committeeId,
    })
      .populate("user", "name email image")
      .populate("approvedBy", "name")
      .sort({ createdAt: -1 })
      .lean();

    return JSON.parse(JSON.stringify(payments));
  } catch {
    return [];
  }
}

export async function adminRecordPayment(
  committeeId: string,
  data: {
    userId: string;
    amount: number;
    paymentMethod?: string;
    proofImage?: string;
    notes?: string;
    paidDate?: string;
  }
): Promise<ApiResponse<{ id: string }>> {
  try {
    const session = await auth();
    if (!session?.user) return { success: false, error: "Unauthorized" };

    await connectDB();

    const committee = await Committee.findById(committeeId);
    if (!committee) return { success: false, error: "Committee not found" };

    const adminMembership = await CommitteeMember.findOne({
      committee: committeeId,
      user: session.user.id,
      role: "admin",
      status: "active",
    });

    if (!adminMembership && session.user.role !== "superadmin") {
      return { success: false, error: "Only admin can record payments" };
    }

    const targetMember = await CommitteeMember.findOne({
      committee: committeeId,
      user: data.userId,
    });

    if (!targetMember) return { success: false, error: "Member not found" };

    const paymentDate = data.paidDate ? new Date(data.paidDate) : new Date();
    if (Number.isNaN(paymentDate.getTime())) {
      return { success: false, error: "Invalid payment date" };
    }

    const payment = await Payment.create({
      committee: committeeId,
      member: targetMember._id,
      user: data.userId,
      round: committee.currentRound,
      amount: data.amount,
      dueDate: paymentDate,
      paidDate: paymentDate,
      status: "approved",
      paymentMethod: data.paymentMethod || "cash",
      notes: data.notes,
      approvedBy: session.user.id,
      approvedAt: paymentDate,
    });

    const proofImageUrl = normalizeProofImage(data.proofImage);
    if (proofImageUrl) {
      payment.proofImage = proofImageUrl;
      await payment.save();
    }

    // update member total
    targetMember.totalPaid = (targetMember.totalPaid || 0) + data.amount;
    await targetMember.save();

    revalidatePath(`/committees/${committeeId}`);
    revalidatePath(`/payments`);

    return { success: true, data: { id: payment._id.toString() }, message: "Payment recorded" };
  } catch {
    return { success: false, error: "Failed to record payment" };
  }
}
