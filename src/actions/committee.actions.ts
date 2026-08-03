"use server";

import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Committee from "@/models/Committee";
import CommitteeMember from "@/models/CommitteeMember";
import { createCommitteeSchema, updateCommitteeSchema } from "@/schemas/committee.schema";
import type { ApiResponse } from "@/types/api";
import { revalidatePath } from "next/cache";

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
      gracePeriodDays: Number(formData.get("gracePeriodDays")) || 0,
      visibility: (formData.get("visibility") as string) || "private",
      turnMode: (formData.get("turnMode") as string) || "random",
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
      gracePeriodDays: data.gracePeriodDays,
      visibility: data.visibility as "private" | "public" | "invite-only",
      turnMode: data.turnMode as "random" | "fixed",
      rules: data.rules,
      admin: session.user.id,
      currentRound: 1,
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

export async function publishCommittee(id: string): Promise<ApiResponse> {
  try {
    const session = await auth();
    if (!session?.user) return { success: false, error: "Unauthorized" };

    await connectDB();

    const committee = await Committee.findById(id);
    if (!committee) return { success: false, error: "Committee not found" };
    if (committee.admin.toString() !== session.user.id) {
      return { success: false, error: "Only admin can publish" };
    }
    if (committee.status !== "draft") {
      return { success: false, error: "Only draft committees can be published" };
    }

    committee.status = "active";
    if (committee.currentRound < 1) {
      committee.currentRound = 1;
    }
    if (committee.totalRounds <= 0) {
      committee.totalRounds = committee.maxMembers;
    }
    await committee.save();

    revalidatePath(`/committees/${id}`);
    revalidatePath("/committees");
    revalidatePath("/dashboard");

    return { success: true, message: "Committee published successfully" };
  } catch {
    return { success: false, error: "Failed to publish committee" };
  }
}

export async function updateCommittee(
  formData: FormData
): Promise<ApiResponse<{ id: string }>> {
  try {
    const session = await auth();
    if (!session?.user) return { success: false, error: "Unauthorized" };

    await connectDB();

    const id = (formData.get("id") as string) || "";
    const committee = await Committee.findById(id);
    if (!committee) return { success: false, error: "Committee not found" };
    if (committee.admin.toString() !== session.user.id) {
      return { success: false, error: "Only admin can update settings" };
    }

    const parseNumber = (value: FormDataEntryValue | null) => {
      if (typeof value !== "string") return undefined;
      if (value.trim() === "") return undefined;
      const parsed = Number(value);
      return Number.isFinite(parsed) ? parsed : undefined;
    };

    const data = {
      name: (formData.get("name") as string) || undefined,
      description: (formData.get("description") as string) || undefined,
      contributionAmount: parseNumber(formData.get("contributionAmount")),
      currency: (formData.get("currency") as string) || undefined,
      frequency: (formData.get("frequency") as string) || undefined,
      maxMembers: parseNumber(formData.get("maxMembers")),
      minMembers: parseNumber(formData.get("minMembers")),
      startDate: (formData.get("startDate") as string) || undefined,
      paymentDueDay: parseNumber(formData.get("paymentDueDay")),
      gracePeriodDays: parseNumber(formData.get("gracePeriodDays")),
      visibility: (formData.get("visibility") as string) || undefined,
      turnMode: (formData.get("turnMode") as string) || undefined,
      rules: (formData.get("rules") as string) || undefined,
    };

    const validated = updateCommitteeSchema.safeParse(data);
    if (!validated.success) {
      return { success: false, error: validated.error.errors[0].message };
    }

    committee.set(validated.data);
    await committee.save();

    revalidatePath(`/committees/${id}`);
    revalidatePath("/committees");
    revalidatePath("/dashboard");

    return {
      success: true,
      data: { id },
      message: "Committee settings updated successfully",
    };
  } catch {
    return { success: false, error: "Failed to update committee settings" };
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
