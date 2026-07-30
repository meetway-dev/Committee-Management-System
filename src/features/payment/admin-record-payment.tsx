"use client";

import { adminRecordPayment } from "@/actions/payment.actions";
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
import { zodResolver } from "@hookform/resolvers/zod";
import { CreditCard, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const recordSchema = z.object({
  userId: z.string().min(1, "Member is required"),
  amount: z.number().min(1, "Amount must be greater than 0"),
  paymentMethod: z.string().optional(),
  notes: z.string().optional(),
});

type RecordForm = z.infer<typeof recordSchema>;

interface AdminRecordPaymentProps {
  committeeId: string;
  members: { _id: string; user?: { _id: string; name?: string; email?: string } }[];
  contributionAmount: number;
}

export function AdminRecordPayment({ committeeId, members, contributionAmount }: AdminRecordPaymentProps) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [proofPreview, setProofPreview] = useState<string | null>(null);
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<RecordForm>({
    resolver: zodResolver(recordSchema),
    defaultValues: { amount: contributionAmount },
  });

  async function onSubmit(data: RecordForm) {
    setSubmitting(true);
    try {
      const result = await adminRecordPayment(committeeId, {
        userId: data.userId,
        amount: data.amount,
        paymentMethod: data.paymentMethod,
        notes: data.notes,
        proofImage: proofPreview ?? undefined,
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
          Record Payment (Admin)
        </CardTitle>
        <CardDescription>
          Record a manual payment for a member
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="userId">Member</Label>
            <Select onValueChange={(v: string | null) => { if (v) setValue("userId", v); }}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select member" />
              </SelectTrigger>
              <SelectContent>
                {members.map((m) => (
                  <SelectItem key={m._id} value={String(m.user?._id ?? m._id)}>
                    {m.user?.name || m.user?.email || "Member"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.userId && <p className="text-xs text-destructive">{errors.userId.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <Input id="amount" type="number" step="0.01" {...register("amount", { valueAsNumber: true })} />
            {errors.amount && <p className="text-xs text-destructive">{errors.amount.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="paymentMethod">Payment Method</Label>
            <Select onValueChange={(v: string | null) => { if (v) setValue("paymentMethod", v ?? ""); }}>
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
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (optional)</Label>
            <Textarea id="notes" placeholder="Notes" {...register("notes")} rows={3} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="proof">Proof / Screenshot (optional)</Label>
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
            <p className="text-xs text-muted-foreground">Image hosting migration coming soon — current uploads are saved locally for demo purposes.</p>
            {proofPreview && <img src={proofPreview} alt="preview" className="mt-2 max-h-40 object-contain" />}
          </div>

          <Button type="submit" disabled={submitting} className="w-full gap-2">
            {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
            Record Payment
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
