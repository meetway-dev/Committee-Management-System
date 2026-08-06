"use server";

import { getBaseUrl } from "@/lib/app-url";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { sendInvitationEmail } from "@/lib/email";
import Committee from "@/models/Committee";
import CommitteeMember from "@/models/CommitteeMember";
import Invitation from "@/models/Invitation";
import User from "@/models/User";
import type { ApiResponse } from "@/types/api";
import { randomBytes } from "crypto";
import { revalidatePath } from "next/cache";

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

/**
 * Read-only: every member of every committee the current user belongs to,
 * grouped client-side by committee. Used by the /members directory.
 */
export async function getAllMyMembers() {
  try {
    const session = await auth();
    if (!session?.user) return [];

    await connectDB();

    const myMemberships = await CommitteeMember.find({
      user: session.user.id,
      status: "active",
    }).select("committee");

    const committeeIds = myMemberships.map((m) => m.committee);
    if (committeeIds.length === 0) return [];

    const committees = await Committee.find({
      _id: { $in: committeeIds },
      deletedAt: null,
    })
      .select("name currency contributionAmount status")
      .lean();

    const members = await CommitteeMember.find({
      committee: { $in: committees.map((c) => c._id) },
      status: { $ne: "removed" },
    })
      .populate("user", "name email image")
      .sort({ turnNumber: 1 })
      .lean();

    const grouped = committees.map((committee) => ({
      committee: JSON.parse(JSON.stringify(committee)),
      members: JSON.parse(
        JSON.stringify(
          members.filter(
            (m) => m.committee.toString() === committee._id.toString()
          )
        )
      ),
    }));

    return JSON.parse(JSON.stringify(grouped));
  } catch {
    return [];
  }
}

export async function setCommitteeTurnOrder(
  committeeId: string,
  memberIds: string[]
): Promise<ApiResponse> {
  try {
    const session = await auth();
    if (!session?.user) return { success: false, error: "Unauthorized" };

    await connectDB();

    const committee = await Committee.findById(committeeId);
    if (!committee) return { success: false, error: "Committee not found" };
    if (committee.status !== "draft" && committee.status !== "active") {
      return {
        success: false,
        error: "Turn order can only be updated while committee is in draft or active",
      };
    }

    const membership = await CommitteeMember.findOne({
      committee: committeeId,
      user: session.user.id,
      role: "admin",
      status: "active",
    });
    if (!membership && session.user.role !== "superadmin") {
      return { success: false, error: "Only admin can update turn order" };
    }

    const members = await CommitteeMember.find({
      committee: committeeId,
      status: "active",
    }).sort({ turnNumber: 1 });

    if (members.length !== memberIds.length) {
      return { success: false, error: "Member list mismatch" };
    }

    const memberSet = new Set(members.map((member) => member._id.toString()));
    for (const id of memberIds) {
      if (!memberSet.has(id)) {
        return { success: false, error: "Invalid member order" };
      }
    }

    const lockedCount = Math.max(0, committee.currentRound - 1);
    const lockedMembers = members.slice(0, lockedCount);

    for (let i = 0; i < lockedMembers.length; i++) {
      if (memberIds[i] !== lockedMembers[i]._id.toString()) {
        return { success: false, error: "Past turns cannot be changed" };
      }
    }

    const movableSet = new Set(
      members.slice(lockedCount).map((member) => member._id.toString())
    );
    for (let i = lockedCount; i < memberIds.length; i++) {
      if (!movableSet.has(memberIds[i])) {
        return { success: false, error: "Invalid member order" };
      }
    }

    await Promise.all(
      memberIds.map((memberId, index) =>
        CommitteeMember.findByIdAndUpdate(memberId, { turnNumber: index + 1 })
      )
    );

    revalidatePath(`/committees/${committeeId}`);
    revalidatePath("/committees");

    return { success: true, message: "Turn order updated successfully" };
  } catch {
    return { success: false, error: "Failed to update turn order" };
  }
}

export async function inviteMember(
  committeeId: string,
  email: string
): Promise<ApiResponse<{ token: string; link?: string; emailSent?: boolean }>> {
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

    const inviteUrl = await getBaseUrl(`/invite?token=${token}`);
    const emailSent = await sendInvitationEmail(email, inviteUrl, committee.name || "Committee");

    revalidatePath(`/committees/${committeeId}`);

    return {
      success: true,
      data: { token, link: inviteUrl, emailSent },
      message: emailSent
        ? "Invitation sent successfully"
        : "Invitation created. Email delivery is not configured yet.",
    };
  } catch {
    return { success: false, error: "Failed to send invitation" };
  }
}

export async function addCommitteeMember(
  committeeId: string,
  email: string
): Promise<ApiResponse<{ memberId: string; userCreated: boolean }>> {
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
      return { success: false, error: "Only admin can add members" };
    }

    const memberCount = await CommitteeMember.countDocuments({
      committee: committeeId,
      status: "active",
    });

    if (memberCount >= committee.maxMembers) {
      return { success: false, error: "Committee is full" };
    }

    const normalizedEmail = email.trim().toLowerCase();
    let user = await User.findOne({ email: normalizedEmail });
    let userCreated = false;

    if (!user) {
      const displayName = normalizedEmail.split("@")[0];
      user = await User.create({
        email: normalizedEmail,
        name: displayName,
        provider: "credentials",
        status: "active",
      });
      userCreated = true;
    } else if (user.status !== "active") {
      return { success: false, error: "User account is not active" };
    }

    const existingMember = await CommitteeMember.findOne({
      committee: committeeId,
      user: user._id,
      status: "active",
    });

    if (existingMember) {
      return { success: false, error: "User is already a member" };
    }

    const committeeMember = await CommitteeMember.create({
      committee: committeeId,
      user: user._id,
      role: "member",
      turnNumber: memberCount + 1,
      status: "active",
    });

    revalidatePath(`/committees/${committeeId}`);
    revalidatePath("/dashboard");

    return {
      success: true,
      data: { memberId: committeeMember._id.toString(), userCreated },
      message: userCreated
        ? "Member added and account created successfully."
        : "Member added successfully.",
    };
  } catch {
    return { success: false, error: "Failed to add member" };
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
