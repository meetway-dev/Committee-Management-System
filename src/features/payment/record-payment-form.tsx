"use client";

import { adminRecordPayment } from "@/actions/payment.actions";
import { Button } from "@/components/ui/button";
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
import { Loader2, Lock, Wallet } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const recordSchema = z.object({
  paidDate: z.string().min(1, "Payment date is required"),
  paymentMethod: z.string().min(1, "Payment method is required"),
  notes: z.string().optional(),
});

type RecordForm = z.infer<typeof recordSchema>;

interface RecordPaymentFormProps {
  committeeId: string;
  memberId: string;
  round: number;
  contributionAmount: number;
  currency: string;
}

export function RecordPaymentForm({
  committeeId,
  memberId,
  round,
  contributionAmount,
  currency,
}: RecordPaymentFormProps) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const today = new Date().toISOString().slice(0, 10);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<RecordForm>({
    resolver: zodResolver(recordSchema),
    defaultValues: {
      paidDate: today,
      paymentMethod: "cash",
      notes: "",
    },
  });

  async function onSubmit(data: RecordForm) {
    setSubmitting(true);
    try {
      const result = await adminRecordPayment(committeeId, {
        userId: memberId,
        amount: contributionAmount,
        round,
        paymentMethod: data.paymentMethod,
        notes: data.notes,
        paidDate: data.paidDate || today,
      });

      if (result.success) {
        toast.success(result.message);
        router.push(`/committees/${committeeId}`);
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
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 rounded-[var(--card-radius)] bg-card p-4 ring-1 ring-foreground/[0.06] shadow-[0_10px_26px_-20px_rgba(20,16,31,0.1)]"
    >
      <div className="rounded-2xl border border-dashed border-primary/30 bg-primary-soft/50 p-4">
        <div className="flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground">
          <Lock className="h-3.5 w-3.5" />
          Contribution amount · fixed by circle
        </div>
        <p className="mt-2 font-heading text-3xl font-extrabold tracking-tight tabular">
          {formatCurrency(contributionAmount, currency)}
        </p>
        <p className="mt-1.5 text-[11px] text-muted-foreground">
          Round {round} contribution
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="paidDate">Payment date</Label>
        <Input
          id="paidDate"
          type="date"
          className="h-11"
          {...register("paidDate")}
        />
        {errors.paidDate && (
          <p className="text-xs text-destructive">{errors.paidDate.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="paymentMethod">Payment method</Label>
        <Select
          defaultValue="cash"
          onValueChange={(v: string | null) => {
            if (v) setValue("paymentMethod", v, { shouldValidate: true });
          }}
        >
          <SelectTrigger id="paymentMethod" className="w-full">
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
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes (optional)</Label>
        <Textarea
          id="notes"
          placeholder="Payment notes, reference, etc."
          rows={3}
          className="resize-none"
          {...register("notes")}
        />
      </div>

      <Button
        type="submit"
        disabled={submitting}
        className="w-full gap-2 rounded-xl"
      >
        {submitting ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Wallet className="h-4 w-4" />
        )}
        {submitting ? "Recording..." : "Confirm payment"}
      </Button>
    </form>
  );
}
