import { z } from "zod";

const committeeBaseSchema = z.object({
    name: z
      .string()
      .min(3, "Name must be at least 3 characters")
      .max(100, "Name must be under 100 characters"),
    description: z.string().max(500, "Description must be under 500 characters").optional(),
    image: z.string().url().optional(),
    contributionAmount: z.number().positive("Amount must be greater than 0"),
    currency: z.string().min(3).max(3),
    frequency: z.enum(["daily", "weekly", "monthly"]),
    maxMembers: z.number().int().min(2, "Minimum 2 members required"),
    minMembers: z.number().int().min(2, "Minimum 2 members required"),
    startDate: z.string().optional(),
    paymentDueDay: z.number().int().min(1).max(28).optional(),
    gracePeriodDays: z.number().int().min(0).optional(),
    visibility: z.enum(["private", "public", "invite-only"]).optional(),
    turnMode: z.enum(["random", "fixed"]).optional(),
    rules: z.string().max(2000).optional(),
  });

export const createCommitteeSchema = committeeBaseSchema
  .refine((data) => data.minMembers <= data.maxMembers, {
    message: "Minimum members cannot exceed maximum members",
    path: ["minMembers"],
  });

export const updateCommitteeSchema = committeeBaseSchema.partial();

export type CreateCommitteeInput = z.infer<typeof createCommitteeSchema>;
export type UpdateCommitteeInput = z.infer<typeof updateCommitteeSchema>;
