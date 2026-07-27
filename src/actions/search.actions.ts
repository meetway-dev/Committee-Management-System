"use server";

import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Committee from "@/models/Committee";
import User from "@/models/User";

export async function searchAll(query: string) {
  try {
    const session = await auth();
    if (!session?.user) return { committees: [], users: [] };

    if (!query || query.length < 2) return { committees: [], users: [] };

    await connectDB();

    const regex = new RegExp(query, "i");

    const [committees, users] = await Promise.all([
      Committee.find({
        name: regex,
        deletedAt: null,
        $or: [
          { visibility: "public" },
          { admin: session.user.id },
        ],
      })
        .select("name description status contributionAmount currency frequency")
        .limit(10)
        .lean(),
      User.find({
        $or: [{ name: regex }, { email: regex }],
        deletedAt: null,
      })
        .select("name email image")
        .limit(10)
        .lean(),
    ]);

    return {
      committees: JSON.parse(JSON.stringify(committees)),
      users: JSON.parse(JSON.stringify(users)),
    };
  } catch {
    return { committees: [], users: [] };
  }
}
