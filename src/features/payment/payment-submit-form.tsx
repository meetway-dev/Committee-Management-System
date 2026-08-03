"use client";

import { submitPayment } from "@/actions/payment.actions";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { PAYMENT_METHODS } from "@/constants";
import { formatCurrency } from "@/utils/format";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreditCard, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const paymentSchema = z.object({
  amount: z.number().min(1, "Amount must be greater than 0"),
  paymentMethod: z.string().min(1, "Payment method is required"),
  notes: z.string().optional(),
});

type PaymentFormData = z.infer<typeof paymentSchema>;

interface PaymentSubmitFormProps {
  committeeId: string;
  contributionAmount: number;
  currency: string;
  currentRound: number;
}

export function PaymentSubmitForm({
  committeeId,
  contributionAmount,
  currency,
  currentRound,
}: PaymentSubmitFormProps) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [proofPreview, setProofPreview] = useState<string | null>(null);
  const [proofUrl, setProofUrl] = useState("");
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      amount: contributionAmount,
      paymentMethod: "",
      notes: "",
    },
  });

  async function onSubmit(data: PaymentFormData) {
    setSubmitting(true);
    try {
      const normalizedUrl = proofUrl.trim();
      if (normalizedUrl) {
        try {
          const url = new URL(normalizedUrl);
          if (url.protocol !== "http:" && url.protocol !== "https:") {
            throw new Error("Invalid protocol");
          }
        } catch {
          toast.error("Please enter a valid public image URL starting with http:// or https://");
          setSubmitting(false);
          return;
        }
      }

      const result = await submitPayment(committeeId, {
        amount: data.amount,
        paymentMethod: data.paymentMethod,
        notes: data.notes,
        proofImage: normalizedUrl || undefined,
      });

      if (result.success) {
        toast.success(result.message);
        router.refresh();
      } else {
        toast.error(result.error);
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <CreditCard className="h-4 w-4" />
          Submit Payment
        </CardTitle>
        <CardDescription>
          Round {currentRound} — {formatCurrency(contributionAmount, currency)}{" "}
          due
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              {...register("amount", { valueAsNumber: true })}
            />
            {errors.amount && (
              <p className="text-xs text-destructive">{errors.amount.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="paymentMethod">Payment Method</Label>
            <Select
              onValueChange={(v: string | null) => {
                if (v) setValue("paymentMethod", v);
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select method" />
              </SelectTrigger>
              <SelectContent>
                {PAYMENT_METHODS.map((method) => (
                  <SelectItem key={method.value} value={method.value}>
                    {method.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.paymentMethod && (
              <p className="text-xs text-destructive">
                {errors.paymentMethod.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (optional)</Label>
            <Textarea
              id="notes"
              placeholder="Any additional notes..."
              {...register("notes")}
              className="resize-none"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="proof-url">Proof URL (optional)</Label>
            <Input
              id="proof-url"
              type="url"
              placeholder="https://example.com/payment-proof.jpg"
              value={proofUrl}
              onChange={(e) => setProofUrl(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Free-tier-safe option: use a public image URL. Local file previews are kept in-browser only and are not persisted on Vercel.
            </p>
            <input
              id="proof"
              type="file"
              accept="image/*"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                if (!file.type.startsWith("image/")) {
                  toast.error("Please select an image file");
                  return;
                }
                if (file.size > MAX_FILE_SIZE) {
                  toast.error("Image too large (max 5MB)");
                  return;
                }
                const reader = new FileReader();
                reader.onload = () => {
                  const result = reader.result as string | null;
                  if (result) setProofPreview(result);
                };
                reader.readAsDataURL(file);
              }}
            />
            {proofPreview && (
              <img src={proofPreview} alt="preview" className="mt-2 max-h-40 object-contain" />
            )}
          </div>

          <Button type="submit" disabled={submitting} className="w-full gap-2">
            {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
            Submit Payment
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
