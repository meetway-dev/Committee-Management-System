"use client";

import { removeMember } from "@/actions/member.actions";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { Button } from "@/components/ui/button";
import { UserMinus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface MemberRemoveButtonProps {
  committeeId: string;
  memberId: string;
  memberName: string;
}

export function MemberRemoveButton({
  committeeId,
  memberId,
  memberName,
}: MemberRemoveButtonProps) {
  const router = useRouter();
  const [showConfirm, setShowConfirm] = useState(false);
  const [removing, setRemoving] = useState(false);

  async function handleRemove() {
    setRemoving(true);
    try {
      const result = await removeMember(committeeId, memberId);
      if (result.success) {
        toast.success(result.message);
        setShowConfirm(false);
        router.refresh();
      } else {
        toast.error(result.error);
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setRemoving(false);
    }
  }

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setShowConfirm(true)}
        className="h-7 w-7 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
      >
        <UserMinus className="h-3.5 w-3.5" />
      </Button>

      <ConfirmDialog
        open={showConfirm}
        onOpenChange={setShowConfirm}
        title="Remove Member"
        description={`Are you sure you want to remove ${memberName} from this committee? This action cannot be undone.`}
        confirmLabel="Remove"
        variant="destructive"
        loading={removing}
        onConfirm={handleRemove}
      />
    </>
  );
}
