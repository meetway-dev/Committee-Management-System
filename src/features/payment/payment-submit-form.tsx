"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { submitPayment } from "@/actions/payment.actions";
import { formatCurrency } from "@/utils/format";
import { CreditCard, Loader2 } from "lucide-react";

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
      const result = await submitPayment(committeeId, {
        amount: data.amount,
        paymentMethod: data.paymentMethod,
        notes: data.notes,
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
                <SelectItem value="cash">Cash</SelectItem>
                <SelectItem value="bank-transfer">Bank Transfer</SelectItem>
                <SelectItem value="mobile-wallet">Mobile Wallet</SelectItem>
                <SelectItem value="cheque">Cheque</SelectItem>
                <SelectItem value="online">Online Payment</SelectItem>
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

          <Button type="submit" disabled={submitting} className="w-full gap-2">
            {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
            Submit Payment
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
