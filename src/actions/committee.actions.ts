"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Committee from "@/models/Committee";
import CommitteeMember from "@/models/CommitteeMember";
import { createCommitteeSchema } from "@/schemas/committee.schema";
import type { ApiResponse } from "@/types/api";

export async function createCommittee(
  formData: FormData
): Promise<ApiResponse<{ id: string }>> {
  try {
    const session = await auth();
    if (!session?.user) return { success: false, error: "Unauthorized" };

    await connectDB();

    const data = {
      name: formData.get("name") as string,
      description: (formData.get("description") as string) || undefined,
      contributionAmount: Number(formData.get("contributionAmount")),
      currency: (formData.get("currency") as string) || "PKR",
      frequency: formData.get("frequency") as string,
      maxMembers: Number(formData.get("maxMembers")),
      minMembers: Number(formData.get("minMembers")),
      startDate: (formData.get("startDate") as string) || undefined,
      paymentDueDay: Number(formData.get("paymentDueDay")) || 1,
      lateFee: Number(formData.get("lateFee")) || 0,
      gracePeriodDays: Number(formData.get("gracePeriodDays")) || 0,
      visibility: (formData.get("visibility") as string) || "private",
      rules: (formData.get("rules") as string) || undefined,
    };

    const validated = createCommitteeSchema.safeParse(data);
    if (!validated.success) {
      return { success: false, error: validated.error.errors[0].message };
    }

    const committee = await Committee.create({
      name: data.name,
      description: data.description,
      contributionAmount: data.contributionAmount,
      currency: data.currency,
      frequency: data.frequency as "daily" | "weekly" | "monthly",
      maxMembers: data.maxMembers,
      minMembers: data.minMembers,
      startDate: data.startDate,
      paymentDueDay: data.paymentDueDay,
      lateFee: data.lateFee,
      gracePeriodDays: data.gracePeriodDays,
      visibility: data.visibility as "private" | "public" | "invite-only",
      rules: data.rules,
      admin: session.user.id,
      totalRounds: data.maxMembers,
      status: "draft" as const,
    });

    await CommitteeMember.create({
      committee: committee._id,
      user: session.user.id,
      role: "admin",
      turnNumber: 1,
      status: "active",
    });

    revalidatePath("/committees");
    revalidatePath("/dashboard");

    return {
      success: true,
      data: { id: committee._id.toString() },
      message: "Committee created successfully",
    };
  } catch {
    return { success: false, error: "Failed to create committee" };
  }
}

export async function getMyCommittees() {
  try {
    const session = await auth();
    if (!session?.user) return [];

    await connectDB();

    const memberships = await CommitteeMember.find({
      user: session.user.id,
      status: "active",
    }).select("committee");

    const committeeIds = memberships.map((m) => m.committee);

    const committees = await Committee.find({
      _id: { $in: committeeIds },
      deletedAt: null,
    })
      .populate("admin", "name image")
      .sort({ updatedAt: -1 })
      .lean();

    return JSON.parse(JSON.stringify(committees));
  } catch {
    return [];
  }
}

export async function getCommitteeById(id: string) {
  try {
    const session = await auth();
    if (!session?.user) return null;

    await connectDB();

    const committee = await Committee.findOne({ _id: id, deletedAt: null })
      .populate("admin", "name image email")
      .lean();

    if (!committee) return null;

    const membership = await CommitteeMember.findOne({
      committee: id,
      user: session.user.id,
      status: "active",
    });

    if (!membership && session.user.role !== "superadmin") return null;

    const memberCount = await CommitteeMember.countDocuments({
      committee: id,
      status: "active",
    });

    return JSON.parse(
      JSON.stringify({
        ...committee,
        memberCount,
        userRole: membership?.role,
      })
    );
  } catch {
    return null;
  }
}

export async function getDashboardStats() {
  try {
    const session = await auth();
    if (!session?.user) return null;

    await connectDB();

    const memberships = await CommitteeMember.find({
      user: session.user.id,
      status: "active",
    });

    const committeeIds = memberships.map((m) => m.committee);

    const [activeCount, completedCount, totalPaid] = await Promise.all([
      Committee.countDocuments({
        _id: { $in: committeeIds },
        status: "active",
        deletedAt: null,
      }),
      Committee.countDocuments({
        _id: { $in: committeeIds },
        status: "completed",
        deletedAt: null,
      }),
      CommitteeMember.aggregate([
        { $match: { user: session.user.id, status: "active" } },
        { $group: { _id: null, total: { $sum: "$totalPaid" } } },
      ]),
    ]);

    return {
      activeCommittees: activeCount,
      completedCommittees: completedCount,
      totalCommittees: committeeIds.length,
      totalPaid: totalPaid[0]?.total || 0,
    };
  } catch {
    return null;
  }
}

export async function archiveCommittee(id: string): Promise<ApiResponse> {
  try {
    const session = await auth();
    if (!session?.user) return { success: false, error: "Unauthorized" };

    await connectDB();

    const committee = await Committee.findById(id);
    if (!committee) return { success: false, error: "Committee not found" };
    if (committee.admin.toString() !== session.user.id) {
      return { success: false, error: "Only admin can archive" };
    }

    committee.status = "archived";
    await committee.save();

    revalidatePath("/committees");
    revalidatePath("/dashboard");

    return { success: true, message: "Committee archived" };
  } catch {
    return { success: false, error: "Failed to archive committee" };
  }
}
