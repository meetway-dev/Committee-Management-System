"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { approvePayment, rejectPayment } from "@/actions/payment.actions";
import { Check, X, Loader2 } from "lucide-react";

interface PaymentActionsProps {
  paymentId: string;
  paymentStatus: string;
  isAdmin: boolean;
}

export function PaymentActions({
  paymentId,
  paymentStatus,
  isAdmin,
}: PaymentActionsProps) {
  const router = useRouter();
  const [approving, setApproving] = useState(false);
  const [showReject, setShowReject] = useState(false);
  const [rejecting, setRejecting] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  if (!isAdmin || paymentStatus !== "pending") return null;

  async function handleApprove() {
    setApproving(true);
    try {
      const result = await approvePayment(paymentId);
      if (result.success) {
        toast.success(result.message);
        router.refresh();
      } else {
        toast.error(result.error);
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setApproving(false);
    }
  }

  async function handleReject() {
    if (!rejectReason.trim()) {
      toast.error("Please provide a reason");
      return;
    }
    setRejecting(true);
    try {
      const result = await rejectPayment(paymentId, rejectReason);
      if (result.success) {
        toast.success(result.message);
        setShowReject(false);
        router.refresh();
      } else {
        toast.error(result.error);
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setRejecting(false);
    }
  }

  return (
    <>
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleApprove}
          disabled={approving}
          className="h-7 w-7 p-0 text-success hover:bg-success/10 hover:text-success"
        >
          {approving ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Check className="h-3.5 w-3.5" />
          )}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowReject(true)}
          className="h-7 w-7 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
        >
          <X className="h-3.5 w-3.5" />
        </Button>
      </div>

      <Dialog open={showReject} onOpenChange={setShowReject}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Payment</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this payment.
            </DialogDescription>
          </DialogHeader>
          <Input
            placeholder="Reason for rejection..."
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
          />
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowReject(false)}
              disabled={rejecting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleReject}
              disabled={rejecting}
              className="gap-1.5"
            >
              {rejecting && <Loader2 className="h-4 w-4 animate-spin" />}
              Reject
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
