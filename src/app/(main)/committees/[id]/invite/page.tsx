"use client";

import { addCommitteeMember, inviteMember } from "@/actions/member.actions";
import { PageHeader } from "@/components/shared/page-header";
import { Button, buttonVariants } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { inviteMemberSchema, type InviteMemberInput } from "@/schemas/member.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, CheckCircle2, Copy, Loader2, UserPlus } from "lucide-react";
import Link from "next/link";
import { use, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function InviteMemberPage({ params }: PageProps) {
  const { id } = use(params);
  const [loading, setLoading] = useState(false);
  const [inviteLink, setInviteLink] = useState<string | null>(null);
  const [emailSent, setEmailSent] = useState<boolean | null>(null);
  const [copied, setCopied] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<InviteMemberInput>({
    resolver: zodResolver(inviteMemberSchema),
    defaultValues: {
      committeeId: id,
      method: "email",
    },
  });

  async function handleInvite(data: InviteMemberInput) {
    if (!data.email) return;
    setLoading(true);
    setInviteLink(null);
    setEmailSent(null);

    try {
      const result = await inviteMember(id, data.email);
      if (result.success && result.data) {
        const link =
          result.data.link ||
          `${window.location.origin}/invite?token=${result.data.token}`;
        setInviteLink(link);
        setEmailSent(result.data.emailSent ?? null);
        toast.success(result.message);
        reset();
      } else {
        toast.error(result.error);
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  async function handleAddMember(data: InviteMemberInput) {
    if (!data.email) return;
    setLoading(true);
    setInviteLink(null);
    setEmailSent(null);

    try {
      const result = await addCommitteeMember(id, data.email);
      if (result.success) {
        toast.success(result.message);
        reset();
      } else {
        toast.error(result.error);
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  async function copyLink() {
    if (!inviteLink) return;
    try {
      await navigator.clipboard.writeText(inviteLink);
      setCopied(true);
      toast.success("Link copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy");
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Invite Member"
        description="Send an invitation to join this committee"
        icon={UserPlus}
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

      <div className="mx-auto max-w-lg space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Invite or add a member</CardTitle>
            <CardDescription>
              Use the email below to either send an invitation link or add an existing user directly.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="rounded-2xl border border-muted/20 bg-muted/5 p-4">
              <p className="text-sm font-medium text-muted-foreground">
                Enter the member's email and choose an action. If the user has an account, use "Add Member"; otherwise use "Send Invite".
              </p>
              <div className="mt-4 space-y-4">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="member@example.com"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-xs text-destructive">
                    {errors.email.message}
                  </p>
                )}
                <div className="grid gap-2 sm:grid-cols-2">
                  <Button
                    type="button"
                    onClick={handleSubmit(handleInvite)}
                    disabled={loading}
                    className="w-full"
                  >
                    {loading && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Send Invite
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={handleSubmit(handleAddMember)}
                    disabled={loading}
                    className="w-full"
                  >
                    {loading && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Add Member
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {inviteLink && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                Invitation Created
              </CardTitle>
              <CardDescription>
                Share this link with the member to join
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <Input value={inviteLink} readOnly className="text-xs" />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={copyLink}
                  className="shrink-0"
                >
                  {copied ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
              {emailSent === false && (
                <p className="text-sm text-muted-foreground">
                  Email delivery is not configured. Copy the link and send it manually.
                </p>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
