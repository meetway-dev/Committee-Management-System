"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { markAllAsRead } from "@/actions/notification.actions";
import { toast } from "sonner";
import { CheckCheck, Loader2 } from "lucide-react";

export function MarkAllReadButton() {
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);
    try {
      const result = await markAllAsRead();
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.error);
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleClick}
      disabled={loading}
      className="gap-1.5"
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <CheckCheck className="h-4 w-4" />
      )}
      Mark all read
    </Button>
  );
}
