"use client";

import { archiveCommittee, getCommitteeById, updateCommittee } from "@/actions/committee.actions";
import {
  addCommitteeMember,
  getCommitteeMembers,
  inviteMember,
} from "@/actions/member.actions";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { GradientAvatar } from "@/components/shared/gradient-avatar";
import { PageHeader } from "@/components/shared/page-header";
import { SectionHeader } from "@/components/shared/section-header";
import { ListGroup, ListRow } from "@/components/shared/list-row";
import { MemberRemoveButton } from "@/features/member/member-remove-button";
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { inviteMemberSchema, type InviteMemberInput } from "@/schemas/member.schema";
import { updateCommitteeSchema, type UpdateCommitteeInput } from "@/schemas/committee.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Archive,
    ArrowLeft,
    CheckCircle2,
    Copy,
    Settings,
    UserPlus,
    Loader2,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { use, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function CommitteeSettingsPage({ params }: PageProps) {
  const { id } = use(params);
  const committee = use(getCommitteeById(id));
  const router = useRouter();
  const [archiving, setArchiving] = useState(false);
  const [showArchive, setShowArchive] = useState(false);
  const [loading, setLoading] = useState(false);

  const members = use(getCommitteeMembers(id));
  const memberList = members as Array<{
    _id: string;
    user?: { _id: string; name?: string; email?: string; image?: string };
    role: string;
    turnNumber: number;
    totalPaid: number;
    status: string;
  }>;

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<UpdateCommitteeInput>({
    resolver: zodResolver(updateCommitteeSchema),
    defaultValues: {
      id,
      name: committee?.name,
      description: committee?.description ?? "",
      contributionAmount: committee?.contributionAmount,
      currency: committee?.currency,
      frequency: committee?.frequency,
      maxMembers: committee?.maxMembers,
      minMembers: committee?.minMembers,
      startDate: committee?.startDate ? new Date(committee.startDate).toISOString().slice(0, 10) : undefined,
      paymentDueDay: committee?.paymentDueDay,
      gracePeriodDays: committee?.gracePeriodDays,
      visibility: committee?.visibility,
      turnMode: committee?.turnMode,
      rules: committee?.rules ?? "",
    },
  });

  const {
    register: registerInvite,
    handleSubmit: handleSubmitInvite,
    reset: resetInvite,
    formState: { errors: inviteErrors },
  } = useForm<InviteMemberInput>({
    resolver: zodResolver(inviteMemberSchema),
    defaultValues: {
      committeeId: id,
      method: "email",
    },
  });

  const [inviteLoading, setInviteLoading] = useState(false);
  const [inviteLink, setInviteLink] = useState<string | null>(null);
  const [emailSent, setEmailSent] = useState<boolean | null>(null);
  const [copied, setCopied] = useState(false);

  if (!committee) {
    return <div>Committee not found.</div>;
  }

  async function onSubmit(data: UpdateCommitteeInput) {
    setLoading(true);
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          formData.append(key, String(value));
        }
      });
      formData.append("id", id);

      const result = await updateCommittee(formData);
      if (result.success) {
        toast.success(result.message);
        router.refresh();
      } else {
        toast.error(result.error);
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  async function handleInvite(data: InviteMemberInput) {
    if (!data.email) return;
    setInviteLoading(true);
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
        resetInvite();
        router.refresh();
      } else {
        toast.error(result.error);
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setInviteLoading(false);
    }
  }

  async function handleAddMember(data: InviteMemberInput) {
    if (!data.email) return;
    setInviteLoading(true);
    setInviteLink(null);
    setEmailSent(null);

    try {
      const result = await addCommitteeMember(id, data.email);
      if (result.success) {
        toast.success(result.message);
        resetInvite();
        router.refresh();
      } else {
        toast.error(result.error);
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setInviteLoading(false);
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
        title="Committee Settings"
        description="Update your committee configuration and member limits"
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

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="members">Members</TabsTrigger>
          <TabsTrigger value="danger">Danger</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>General Details</CardTitle>
                <CardDescription>Update the circle name, description and rules.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Committee Name</Label>
                    <Input id="name" {...register("name")} />
                    {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="currency">Currency</Label>
                    <Select
                      value={committee.currency}
                      onValueChange={(value) => setValue("currency", value)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {["PKR", "USD", "EUR"].map((currency) => (
                          <SelectItem key={currency} value={currency}>
                            {currency}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" rows={4} {...register("description")} />
                  {errors.description && <p className="text-xs text-destructive">{errors.description.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rules">Rules</Label>
                  <Textarea id="rules" rows={4} {...register("rules")} />
                  {errors.rules && <p className="text-xs text-destructive">{errors.rules.message}</p>}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Financial & Schedule</CardTitle>
                <CardDescription>Update contribution amount, frequency, and payment timing.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  <div className="space-y-2">
                    <Label htmlFor="contributionAmount">Contribution Amount</Label>
                    <Input id="contributionAmount" type="number" {...register("contributionAmount", { valueAsNumber: true })} />
                    {errors.contributionAmount && <p className="text-xs text-destructive">{errors.contributionAmount.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="frequency">Frequency</Label>
                    <Select
                      value={committee.frequency}
                      onValueChange={(value) => setValue("frequency", value as "daily" | "weekly" | "monthly")}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="paymentDueDay">Payment Due Day</Label>
                    <Input id="paymentDueDay" type="number" {...register("paymentDueDay", { valueAsNumber: true })} />
                    {errors.paymentDueDay && <p className="text-xs text-destructive">{errors.paymentDueDay.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gracePeriodDays">Grace Period Days</Label>
                    <Input id="gracePeriodDays" type="number" {...register("gracePeriodDays", { valueAsNumber: true })} />
                    {errors.gracePeriodDays && <p className="text-xs text-destructive">{errors.gracePeriodDays.message}</p>}
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="minMembers">Min Members</Label>
                    <Input id="minMembers" type="number" {...register("minMembers", { valueAsNumber: true })} />
                    {errors.minMembers && <p className="text-xs text-destructive">{errors.minMembers.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="maxMembers">Max Members</Label>
                    <Input id="maxMembers" type="number" {...register("maxMembers", { valueAsNumber: true })} />
                    {errors.maxMembers && <p className="text-xs text-destructive">{errors.maxMembers.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="turnMode">Turn Mode</Label>
                    <Select
                      value={committee.turnMode}
                      onValueChange={(value) => setValue("turnMode", value as "random" | "fixed")}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="random">Random</SelectItem>
                        <SelectItem value="fixed">Fixed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="visibility">Visibility</Label>
                    <Select
                      value={committee.visibility}
                      onValueChange={(value) => setValue("visibility", value as "private" | "public" | "invite-only")}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="private">Private</SelectItem>
                        <SelectItem value="public">Public</SelectItem>
                        <SelectItem value="invite-only">Invite Only</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div className="text-sm text-muted-foreground">Save your committee settings after changes.</div>
              <Button type="submit" loading={loading} className="min-w-[10rem]">
                Save changes
              </Button>
            </div>
          </form>
        </TabsContent>

        <TabsContent value="members">
          <Card>
            <CardHeader>
              <CardTitle>Member Management</CardTitle>
              <CardDescription>
                Invite new members, add existing accounts, and remove current members.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 lg:grid-cols-2">
                <div className="space-y-4 rounded-2xl border border-border p-4">
                  <div>
                    <p className="text-sm font-semibold">Invite or add member</p>
                    <p className="text-xs text-muted-foreground">
                      Use the member&apos;s email to send an invite or add them directly if they already have an account.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="member@example.com"
                      {...registerInvite("email")}
                    />
                    {inviteErrors.email && (
                      <p className="text-xs text-destructive">
                        {inviteErrors.email.message}
                      </p>
                    )}
                  </div>
                  <div className="grid gap-2 sm:grid-cols-2">
                    <Button
                      type="button"
                      onClick={handleSubmitInvite(handleInvite)}
                      disabled={inviteLoading}
                      className="w-full"
                    >
                      {inviteLoading && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      Send Invite
                    </Button>
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={handleSubmitInvite(handleAddMember)}
                      disabled={inviteLoading}
                      className="w-full"
                    >
                      {inviteLoading && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      Add Member
                    </Button>
                  </div>

                  {inviteLink && (
                    <div className="rounded-2xl border border-primary/20 bg-primary/5 p-3">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold text-primary">
                            Invitation ready
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Copy the link below to share with the user.
                          </p>
                        </div>
                        <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                      </div>
                      <div className="mt-3 flex items-center gap-2">
                        <Input value={inviteLink} readOnly className="text-xs" />
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={copyLink}
                          className="shrink-0"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                      {emailSent === false && (
                        <p className="mt-3 text-xs text-muted-foreground">
                          Email delivery is not configured. Copy the link and send it manually.
                        </p>
                      )}
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <SectionHeader
                    title="Current members"
                    caption={`${memberList.length} of ${committee.maxMembers} seats filled`}
                  />
                  {memberList.length === 0 ? (
                    <div className="rounded-2xl bg-card/60 p-6 text-center text-[0.8rem] text-muted-foreground ring-1 ring-foreground/[0.05]">
                      No members yet. Invite your first member to get started.
                    </div>
                  ) : (
                    <div className="rounded-2xl bg-card p-1.5 ring-1 ring-foreground/[0.06]">
                      <ListGroup>
                        {memberList.map((member) => (
                          <ListRow
                            key={member._id}
                            leading={
                              <GradientAvatar
                                name={member.user?.name || "Member"}
                                image={member.user?.image}
                                size="md"
                              />
                            }
                            title={member.user?.name || "Unknown"}
                            caption={
                              member.user?.email ? (
                                <span>{member.user.email}</span>
                              ) : (
                                "No email"
                              )
                            }
                            value={`Turn ${member.turnNumber}`}
                            valueCaption={member.role === "admin" ? "Admin" : "Member"}
                            trailing={
                              member.role !== "admin" ? (
                                <MemberRemoveButton
                                  committeeId={id}
                                  memberId={member._id}
                                  memberName={member.user?.name || "this member"}
                                />
                              ) : undefined
                            }
                          />
                        ))}
                      </ListGroup>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="danger">
          <Card className="border-destructive/20">
            <CardHeader>
              <CardTitle className="text-base text-destructive">Danger Zone</CardTitle>
              <CardDescription>
                Archive this committee to prevent members from continuing contributions.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4 rounded-lg border border-destructive/20 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-medium">Archive Committee</p>
                  <p className="text-xs text-muted-foreground">
                    This action is irreversible and removes the committee from active use.
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
        </TabsContent>
      </Tabs>

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
