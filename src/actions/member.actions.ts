"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Committee from "@/models/Committee";
import CommitteeMember from "@/models/CommitteeMember";
import Invitation from "@/models/Invitation";
import User from "@/models/User";
import { randomBytes } from "crypto";
import type { ApiResponse } from "@/types/api";

export async function getCommitteeMembers(committeeId: string) {
  try {
    const session = await auth();
    if (!session?.user) return [];

    await connectDB();

    const members = await CommitteeMember.find({
      committee: committeeId,
      status: { $ne: "removed" },
    })
      .populate("user", "name email image phone")
      .sort({ turnNumber: 1 })
      .lean();

    return JSON.parse(JSON.stringify(members));
  } catch {
    return [];
  }
}

export async function inviteMember(
  committeeId: string,
  email: string
): Promise<ApiResponse<{ token: string }>> {
  try {
    const session = await auth();
    if (!session?.user) return { success: false, error: "Unauthorized" };

    await connectDB();

    const committee = await Committee.findById(committeeId);
    if (!committee) return { success: false, error: "Committee not found" };

    const membership = await CommitteeMember.findOne({
      committee: committeeId,
      user: session.user.id,
      role: "admin",
      status: "active",
    });

    if (!membership && session.user.role !== "superadmin") {
      return { success: false, error: "Only admin can invite members" };
    }

    const memberCount = await CommitteeMember.countDocuments({
      committee: committeeId,
      status: "active",
    });

    if (memberCount >= committee.maxMembers) {
      return { success: false, error: "Committee is full" };
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      const existingMember = await CommitteeMember.findOne({
        committee: committeeId,
        user: existingUser._id,
        status: "active",
      });
      if (existingMember) {
        return { success: false, error: "User is already a member" };
      }
    }

    const existingInvite = await Invitation.findOne({
      committee: committeeId,
      email,
      status: "pending",
    });

    if (existingInvite) {
      return { success: false, error: "Invitation already sent to this email" };
    }

    const token = randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    await Invitation.create({
      committee: committeeId,
      invitedBy: session.user.id,
      email,
      token,
      method: "email",
      status: "pending",
      expiresAt,
    });

    revalidatePath(`/committees/${committeeId}`);

    return {
      success: true,
      data: { token },
      message: "Invitation sent successfully",
    };
  } catch {
    return { success: false, error: "Failed to send invitation" };
  }
}

export async function acceptInvitation(
  token: string
): Promise<ApiResponse<{ committeeId: string }>> {
  try {
    const session = await auth();
    if (!session?.user) return { success: false, error: "Unauthorized" };

    await connectDB();

    const invitation = await Invitation.findOne({
      token,
      status: "pending",
      expiresAt: { $gt: new Date() },
    });

    if (!invitation) {
      return { success: false, error: "Invalid or expired invitation" };
    }

    const existingMember = await CommitteeMember.findOne({
      committee: invitation.committee,
      user: session.user.id,
      status: "active",
    });

    if (existingMember) {
      return { success: false, error: "You are already a member" };
    }

    const committee = await Committee.findById(invitation.committee);
    if (!committee) return { success: false, error: "Committee not found" };

    const memberCount = await CommitteeMember.countDocuments({
      committee: invitation.committee,
      status: "active",
    });

    if (memberCount >= committee.maxMembers) {
      return { success: false, error: "Committee is full" };
    }

    await CommitteeMember.create({
      committee: invitation.committee,
      user: session.user.id,
      role: "member",
      turnNumber: memberCount + 1,
      status: "active",
    });

    invitation.status = "accepted";
    invitation.acceptedAt = new Date();
    await invitation.save();

    const committeeId = invitation.committee.toString();
    revalidatePath(`/committees/${committeeId}`);
    revalidatePath("/dashboard");

    return {
      success: true,
      data: { committeeId },
      message: "You have joined the committee",
    };
  } catch {
    return { success: false, error: "Failed to accept invitation" };
  }
}

export async function removeMember(
  committeeId: string,
  memberId: string
): Promise<ApiResponse> {
  try {
    const session = await auth();
    if (!session?.user) return { success: false, error: "Unauthorized" };

    await connectDB();

    const adminMembership = await CommitteeMember.findOne({
      committee: committeeId,
      user: session.user.id,
      role: "admin",
      status: "active",
    });

    if (!adminMembership && session.user.role !== "superadmin") {
      return { success: false, error: "Only admin can remove members" };
    }

    const member = await CommitteeMember.findById(memberId);
    if (!member) return { success: false, error: "Member not found" };
    if (member.role === "admin") {
      return { success: false, error: "Cannot remove the admin" };
    }

    member.status = "removed";
    member.removedAt = new Date();
    await member.save();

    revalidatePath(`/committees/${committeeId}`);

    return { success: true, message: "Member removed" };
  } catch {
    return { success: false, error: "Failed to remove member" };
  }
}

export async function getCommitteeInvitations(committeeId: string) {
  try {
    const session = await auth();
    if (!session?.user) return [];

    await connectDB();

    const invitations = await Invitation.find({
      committee: committeeId,
      status: "pending",
    })
      .populate("invitedBy", "name")
      .sort({ createdAt: -1 })
      .lean();

    return JSON.parse(JSON.stringify(invitations));
  } catch {
    return [];
  }
}
