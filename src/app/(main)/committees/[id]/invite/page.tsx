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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { getPublicUrl } from "@/lib/public-url";
import {
    inviteMemberSchema,
    manualMemberSchema,
    type InviteMemberInput,
    type ManualMemberInput,
} from "@/schemas/member.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    ArrowLeft,
    CheckCircle2,
    Copy,
    Loader2,
    Mail,
    UserPlus,
} from "lucide-react";
import Link from "next/link";
import { use, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function InviteMemberPage({ params }: PageProps) {
  const { id } = use(params);
  const [loading, setLoading] = useState<null | "email" | "manual">(null);
  const [inviteLink, setInviteLink] = useState<string | null>(null);
  const [emailSent, setEmailSent] = useState<boolean | null>(null);
  const [copied, setCopied] = useState(false);

  const emailForm = useForm<InviteMemberInput>({
    resolver: zodResolver(inviteMemberSchema),
    defaultValues: {
      committeeId: id,
      method: "email",
    },
  });

  const manualForm = useForm<ManualMemberInput>({
    resolver: zodResolver(manualMemberSchema),
    defaultValues: {
      committeeId: id,
    },
  });

  async function handleSendInvite() {
    const email = emailForm.getValues("email");
    if (!email) return;
    setLoading("email");
    setInviteLink(null);
    setEmailSent(null);

    try {
      const result = await inviteMember(id, email);
      if (result.success && result.data) {
        const link =
          result.data.link ||
          getPublicUrl(`/invite?token=${result.data.token}`);
        setInviteLink(link);
        setEmailSent(result.data.emailSent ?? null);
        toast.success(result.message);
        emailForm.reset();
      } else {
        toast.error(result.error);
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(null);
    }
  }

  async function handleAddManual() {
    const data = manualForm.getValues();
    setLoading("manual");
    setInviteLink(null);
    setEmailSent(null);

    try {
      const result = await addCommitteeMember(id, data.email, {
        name: data.name,
        phone: data.phone,
      });
      if (result.success) {
        toast.success(result.message);
        manualForm.reset();
      } else {
        toast.error(result.error);
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(null);
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
        description="Invite by email or add a member manually"
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
        <Tabs defaultValue="email">
          <TabsList className="w-full">
            <TabsTrigger value="email" className="gap-1.5">
              <Mail className="h-3.5 w-3.5" />
              Invite by email
            </TabsTrigger>
            <TabsTrigger value="manual" className="gap-1.5">
              <UserPlus className="h-3.5 w-3.5" />
              Add manually
            </TabsTrigger>
          </TabsList>

          <TabsContent value="email" className="mt-2.5">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Invite by email</CardTitle>
                <CardDescription>
                  Send an invitation link to the member&apos;s email so they can
                  join this circle.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="member@example.com"
                    {...emailForm.register("email")}
                  />
                  {emailForm.formState.errors.email && (
                    <p className="text-xs text-destructive">
                      {emailForm.formState.errors.email.message}
                    </p>
                  )}
                </div>
                <Button
                  type="button"
                  onClick={emailForm.handleSubmit(handleSendInvite)}
                  disabled={loading !== null}
                  className="w-full"
                >
                  {loading === "email" && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Send Invite
                </Button>
              </CardContent>
            </Card>

            {inviteLink && (
              <Card className="mt-2.5">
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
                      Email delivery is not configured. Copy the link and send it
                      manually.
                    </p>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="manual" className="mt-2.5">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Add member manually</CardTitle>
                <CardDescription>
                  Create the member directly with their details. If the email
                  already has an account, they will be linked to it.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">User Name</Label>
                  <Input
                    id="name"
                    placeholder="e.g. Ali Ahmed"
                    {...manualForm.register("name")}
                  />
                  {manualForm.formState.errors.name && (
                    <p className="text-xs text-destructive">
                      {manualForm.formState.errors.name.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="manual-email">Email</Label>
                  <Input
                    id="manual-email"
                    type="email"
                    placeholder="member@example.com"
                    {...manualForm.register("email")}
                  />
                  {manualForm.formState.errors.email && (
                    <p className="text-xs text-destructive">
                      {manualForm.formState.errors.email.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+92 300 1234567"
                    {...manualForm.register("phone")}
                  />
                  {manualForm.formState.errors.phone && (
                    <p className="text-xs text-destructive">
                      {manualForm.formState.errors.phone.message}
                    </p>
                  )}
                </div>
                <Button
                  type="button"
                  onClick={manualForm.handleSubmit(handleAddManual)}
                  disabled={loading !== null}
                  className="w-full"
                >
                  {loading === "manual" && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Add Member
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
