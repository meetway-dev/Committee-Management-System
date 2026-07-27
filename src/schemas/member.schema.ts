import { z } from "zod";

export const inviteMemberSchema = z
  .object({
    committeeId: z.string().min(1, "Committee is required"),
    email: z.string().email("Invalid email address").optional(),
    phone: z.string().optional(),
    method: z.enum(["email", "whatsapp", "link", "qr"]).optional(),
  })
  .refine((data) => data.email || data.phone, {
    message: "Either email or phone is required",
    path: ["email"],
  });

export type InviteMemberInput = z.infer<typeof inviteMemberSchema>;
