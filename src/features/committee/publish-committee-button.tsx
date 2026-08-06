"use client";

import { publishCommittee } from "@/actions/committee.actions";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface PublishCommitteeButtonProps {
  committeeId: string;
  className?: string;
}

export function PublishCommitteeButton({
  committeeId,
  className,
}: PublishCommitteeButtonProps) {
  const router = useRouter();
  const [showConfirm, setShowConfirm] = useState(false);
  const [publishing, setPublishing] = useState(false);

  async function handlePublish() {
    setPublishing(true);
    try {
      const result = await publishCommittee(committeeId);
      if (result.success) {
        toast.success(result.message);
        router.refresh();
      } else {
        toast.error(result.error);
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setPublishing(false);
      setShowConfirm(false);
    }
  }

  return (
    <>
      <Button
        variant="secondary"
        size="sm"
        onClick={() => setShowConfirm(true)}
        className={cn("gap-1.5", className)}
      >
        <CheckCircle2 className="h-4 w-4" />
        Publish
      </Button>

      <ConfirmDialog
        open={showConfirm}
        onOpenChange={setShowConfirm}
        title="Publish Committee"
        description="Publish this committee so members can start contributing. This will make it active immediately."
        confirmLabel="Publish"
        loading={publishing}
        onConfirm={handlePublish}
      />
    </>
  );
}
