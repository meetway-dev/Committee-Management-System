import { z } from "zod";

export const submitPaymentSchema = z.object({
  committeeId: z.string().min(1, "Committee is required"),
  amount: z.number().positive("Amount must be greater than 0"),
  paymentMethod: z
    .enum([
      "bank-transfer",
      "easypaisa",
      "jazzcash",
      "cash",
      "mobile-wallet",
      "cheque",
      "online",
      "other",
    ])
    .optional(),
  proofImage: z.string().url().optional(),
  notes: z.string().max(500).optional(),
});

export const approvePaymentSchema = z.object({
  paymentId: z.string().min(1, "Payment is required"),
});

export const rejectPaymentSchema = z.object({
  paymentId: z.string().min(1, "Payment is required"),
  reason: z.string().min(1, "Reason is required").max(500),
});

export type SubmitPaymentInput = z.infer<typeof submitPaymentSchema>;
export type ApprovePaymentInput = z.infer<typeof approvePaymentSchema>;
export type RejectPaymentInput = z.infer<typeof rejectPaymentSchema>;
