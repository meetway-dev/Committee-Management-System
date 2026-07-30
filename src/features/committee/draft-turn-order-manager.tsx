"use client";

import { setCommitteeTurnOrder } from "@/actions/member.actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowDown, ArrowUp, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { toast } from "sonner";

interface TurnMember {
  _id: string;
  user?: { name?: string; email?: string };
  turnNumber: number;
}

interface DraftTurnOrderManagerProps {
  committeeId: string;
  members: TurnMember[];
}

export function DraftTurnOrderManager({ committeeId, members }: DraftTurnOrderManagerProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [order, setOrder] = useState<TurnMember[]>(() =>
    [...members].sort((a, b) => a.turnNumber - b.turnNumber)
  );

  const hasChanges = useMemo(
    () =>
      order.some((member, index) => member.turnNumber !== index + 1),
    [order]
  );

  function move(index: number, direction: "up" | "down") {
    const nextIndex = direction === "up" ? index - 1 : index + 1;
    if (nextIndex < 0 || nextIndex >= order.length) return;
    setOrder((current) => {
      const updated = [...current];
      const item = updated[index];
      updated[index] = updated[nextIndex];
      updated[nextIndex] = item;
      return updated.map((member, i) => ({ ...member, turnNumber: i + 1 }));
    });
  }

  async function handleSave() {
    if (!hasChanges) return;
    setSaving(true);
    try {
      const result = await setCommitteeTurnOrder(
        committeeId,
        order.map((member) => member._id)
      );
      if (result.success) {
        toast.success(result.message);
        router.refresh();
      } else {
        toast.error(result.error);
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Turn Order</CardTitle>
        <CardDescription>
          Drag members into the order you want them to receive payouts.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {order.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Add members to define a fixed turn order.
          </p>
        ) : (
          <div className="space-y-2">
            {order.map((member, index) => (
              <div
                key={member._id}
                className="flex items-center justify-between gap-3 rounded-lg border p-3"
              >
                <div>
                  <p className="text-sm font-medium">
                    {member.user?.name || member.user?.email || "Member"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Turn {member.turnNumber}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => move(index, "up")}
                    disabled={index === 0}
                  >
                    <ArrowUp className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => move(index, "down")}
                    disabled={index === order.length - 1}
                  >
                    <ArrowDown className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={saving || !hasChanges || order.length === 0}>
            {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Order
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
