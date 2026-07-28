"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PageHeader } from "@/components/shared/page-header";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { archiveCommittee } from "@/actions/committee.actions";
import { Settings, ArrowLeft, Archive, Loader2 } from "lucide-react";
import { use } from "react";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function CommitteeSettingsPage({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();
  const [archiving, setArchiving] = useState(false);
  const [showArchive, setShowArchive] = useState(false);

  async function handleArchive() {
    setArchiving(true);
    try {
      const result = await archiveCommittee(id);
      if (result.success) {
        toast.success(result.message);
        router.push("/committees");
      } else {
        toast.error(result.error);
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setArchiving(false);
      setShowArchive(false);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Committee Settings"
        description="Manage committee configuration"
        icon={Settings}
        action={
          <Link
            href={`/committees/${id}`}
            className={cn(
              buttonVariants({ variant: "ghost", size: "sm" }),
              "gap-1.5"
            )}
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>
        }
      />

      <Card className="border-destructive/20">
        <CardHeader>
          <CardTitle className="text-base text-destructive">
            Danger Zone
          </CardTitle>
          <CardDescription>
            These actions are irreversible. Proceed with caution.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between rounded-lg border border-destructive/20 p-4">
            <div>
              <p className="text-sm font-medium">Archive Committee</p>
              <p className="text-xs text-muted-foreground">
                Archive this committee. Members will no longer be able to make
                payments.
              </p>
            </div>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setShowArchive(true)}
              className="gap-1.5"
            >
              <Archive className="h-4 w-4" />
              Archive
            </Button>
          </div>
        </CardContent>
      </Card>

      <ConfirmDialog
        open={showArchive}
        onOpenChange={setShowArchive}
        title="Archive Committee"
        description="Are you sure you want to archive this committee? Members will no longer be able to make payments or receive payouts."
        confirmLabel="Archive"
        variant="destructive"
        loading={archiving}
        onConfirm={handleArchive}
      />
    </div>
  );
}
