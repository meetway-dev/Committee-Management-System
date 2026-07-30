"use server";

import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Committee from "@/models/Committee";
import CommitteeMember from "@/models/CommitteeMember";
import Payment from "@/models/Payment";
import type { ApiResponse } from "@/types/api";
import fs from "fs/promises";
import mongoose from "mongoose";
import { revalidatePath } from "next/cache";
import path from "path";

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

    const existingPayment = await Payment.findOne({
      committee: committeeId,
      user: session.user.id,
      round: committee.currentRound,
      status: { $in: ["pending", "approved"] },
    });

    if (existingPayment) {
      return {
        success: false,
        error: "Payment already submitted for this round",
      };
    }

    // validate proof image if provided (max 5MB, must be image/*)
    let pendingProof: { mime: string; b64: string; ext: string } | null = null;
    if (data.proofImage && typeof data.proofImage === "string" && data.proofImage.startsWith("data:")) {
      const matches = data.proofImage.match(/^data:(.+);base64,(.+)$/);
      if (!matches) return { success: false, error: "Invalid proof image data" };
      const mime = matches[1];
      const b64 = matches[2];
      if (!mime.startsWith("image/")) return { success: false, error: "Proof must be an image" };
      const size = Buffer.byteLength(b64, "base64");
      const MAX = 5 * 1024 * 1024;
      if (size > MAX) return { success: false, error: "Proof image too large (max 5MB)" };
      const ext = mime.split("/").pop() || "png";
      pendingProof = { mime, b64, ext };
    }

    const payment = await Payment.create({
      committee: committeeId,
      member: membership._id,
      user: session.user.id,
      round: committee.currentRound,
      amount: data.amount,
      dueDate: new Date(),
      status: "pending",
      paymentMethod: data.paymentMethod,
      proofImage: undefined,
      notes: data.notes,
    });

    // If we validated a pendingProof above, write file now
    if (pendingProof) {
      try {
        const uploadsDir = path.join(process.cwd(), "public", "uploads", "payments");
        await fs.mkdir(uploadsDir, { recursive: true });
        const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${pendingProof.ext}`;
        const filePath = path.join(uploadsDir, fileName);
        await fs.writeFile(filePath, Buffer.from(pendingProof.b64, "base64"));
        payment.proofImage = `/uploads/payments/${fileName}`;
        await payment.save();
      } catch {
        // ignore file save errors but keep payment record
      }
    } else if (data.proofImage && typeof data.proofImage === "string") {
      // If caller passed a path already, store it directly
      payment.proofImage = data.proofImage;
      await payment.save();
    }

    revalidatePath(`/committees/${committeeId}`);
    revalidatePath("/payments");

    return {
      success: true,
      data: { id: payment._id.toString() },
      message: "Payment submitted successfully",
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

    const payment = await Payment.create({
      committee: committeeId,
      member: targetMember._id,
      user: data.userId,
      round: committee.currentRound,
      amount: data.amount,
      dueDate: new Date(),
      paidDate: new Date(),
      status: "approved",
      paymentMethod: data.paymentMethod,
      notes: data.notes,
      approvedBy: session.user.id,
      approvedAt: new Date(),
    });

    // validate and handle proof image if provided (max 5MB, must be image/*)
    if (data.proofImage && typeof data.proofImage === "string") {
      if (data.proofImage.startsWith("data:")) {
        const matches = data.proofImage.match(/^data:(.+);base64,(.+)$/);
        if (matches) {
          const mime = matches[1];
          const b64 = matches[2];
          if (!mime.startsWith("image/")) return { success: false, error: "Proof must be an image" };
          const size = Buffer.byteLength(b64, "base64");
          const MAX = 5 * 1024 * 1024;
          if (size > MAX) return { success: false, error: "Proof image too large (max 5MB)" };
          const ext = mime.split("/").pop() || "png";
          try {
            const uploadsDir = path.join(process.cwd(), "public", "uploads", "payments");
            await fs.mkdir(uploadsDir, { recursive: true });
            const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
            const filePath = path.join(uploadsDir, fileName);
            await fs.writeFile(filePath, Buffer.from(b64, "base64"));
            payment.proofImage = `/uploads/payments/${fileName}`;
            await payment.save();
          } catch {
            // ignore file save errors but keep payment record
          }
        }
      } else {
        payment.proofImage = data.proofImage;
        await payment.save();
      }
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
