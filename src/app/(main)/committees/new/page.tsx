"use client";

import { createCommittee } from "@/actions/committee.actions";
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
    COMMITTEE_FREQUENCIES,
    COMMITTEE_VISIBILITIES,
    CURRENCIES,
} from "@/constants";
import { cn } from "@/lib/utils";
import {
    createCommitteeSchema,
    type CreateCommitteeInput,
} from "@/schemas/committee.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Loader2, Users } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function CreateCommitteePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<CreateCommitteeInput>({
    resolver: zodResolver(createCommitteeSchema),
    defaultValues: {
      currency: "PKR",
      frequency: "monthly",
      visibility: "private",
      maxMembers: 10,
      minMembers: 2,
      paymentDueDay: 1,
      gracePeriodDays: 3,
    },
  });

  // Controlled values synced with the form to avoid passing `watch()` directly
  const [currencyVal, setCurrencyVal] = useState<string>(() => getValues("currency") || "PKR");
  const [frequencyVal, setFrequencyVal] = useState<string>(() => getValues("frequency") || "monthly");
  const [turnModeVal, setTurnModeVal] = useState<string>(() => getValues("turnMode") || "random");
  const [visibilityVal, setVisibilityVal] = useState<string>(() => getValues("visibility") || "private");

  async function onSubmit(data: CreateCommitteeInput) {
    setLoading(true);
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          formData.append(key, String(value));
        }
      });
      const result = await createCommittee(formData);
      if (result.success) {
        toast.success(result.message);
        router.push(`/committees/${result.data?.id}`);
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
    <div className="space-y-6 max-w-5xl px-4 sm:px-6 mx-auto">
      <PageHeader
        title="Create Committee"
        description="Set up a new savings committee"
        icon={Users}
        action={
          <Link
            href="/committees"
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

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Basic Details</CardTitle>
            <CardDescription>
              Give your committee a name and description
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="name">Committee Name *</Label>
              <Input
                id="name"
                placeholder="e.g., Family Savings Group"
                {...register("name")}
              />
              {errors.name && (
                <p className="text-xs text-destructive">
                  {errors.name.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe the purpose and rules of your committee..."
                rows={3}
                {...register("description")}
              />
              {errors.description && (
                <p className="text-xs text-destructive">
                  {errors.description.message}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Financial Details</CardTitle>
            <CardDescription>
              Set contribution amount and frequency
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <div className="space-y-2">
                <Label htmlFor="contributionAmount">
                  Contribution Amount *
                </Label>
                <Input
                  id="contributionAmount"
                  type="number"
                  placeholder="10000"
                  {...register("contributionAmount", { valueAsNumber: true })}
                />
                {errors.contributionAmount && (
                  <p className="text-xs text-destructive">
                    {errors.contributionAmount.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <Select
                  value={currencyVal}
                  onValueChange={(v) => { if (v) { setCurrencyVal(v); setValue("currency", v); } }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CURRENCIES.map((c) => (
                      <SelectItem key={c.value} value={c.value}>
                        {c.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="frequency">Frequency *</Label>
                <Select
                  value={frequencyVal}
                  onValueChange={(v) => {
                    if (v) { setFrequencyVal(v); setValue("frequency", v as "daily" | "weekly" | "monthly"); }
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {COMMITTEE_FREQUENCIES.map((f) => (
                      <SelectItem key={f.value} value={f.value}>
                        {f.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="turnMode">Turn Order</Label>
                <Select
                  value={turnModeVal}
                  onValueChange={(v) => {
                    if (v) { setTurnModeVal(v); setValue("turnMode", v as "random" | "fixed"); }
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="random">Random</SelectItem>
                    <SelectItem value="fixed">Fixed</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Random is assigned when the committee starts. Fixed shows turn order immediately.
                </p>
              </div>
            </div>

          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card className="border-border bg-card/80">
            <CardHeader className="pb-4">
              <CardTitle className="text-base">Members & Schedule</CardTitle>
              <CardDescription className="text-sm">
                Set the membership limits and payment timing for the committee.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="minMembers">Min Members *</Label>
                  <Input
                    id="minMembers"
                    type="number"
                    {...register("minMembers", { valueAsNumber: true })}
                  />
                  {errors.minMembers && (
                    <p className="text-xs text-destructive">
                      {errors.minMembers.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxMembers">Max Members *</Label>
                  <Input
                    id="maxMembers"
                    type="number"
                    {...register("maxMembers", { valueAsNumber: true })}
                  />
                  {errors.maxMembers && (
                    <p className="text-xs text-destructive">
                      {errors.maxMembers.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="paymentDueDay">Payment Due Day</Label>
                  <Input
                    id="paymentDueDay"
                    type="number"
                    min={1}
                    max={28}
                    {...register("paymentDueDay", { valueAsNumber: true })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gracePeriodDays">Grace Period (Days)</Label>
                  <Input
                    id="gracePeriodDays"
                    type="number"
                    min={0}
                    {...register("gracePeriodDays", { valueAsNumber: true })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input id="startDate" type="date" {...register("startDate")} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border bg-card/80">
            <CardHeader className="pb-4">
              <CardTitle className="text-base">Settings</CardTitle>
              <CardDescription className="text-sm">
                Configure visibility and add the committee rules.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="visibility">Visibility</Label>
                  <Select
                    value={visibilityVal}
                    onValueChange={(v) => {
                      if (v) { setVisibilityVal(v); setValue("visibility", v as "private" | "public" | "invite-only"); }
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {COMMITTEE_VISIBILITIES.map((vis) => (
                        <SelectItem key={vis.value} value={vis.value}>
                          {vis.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="rules">Rules</Label>
                  <Textarea
                    id="rules"
                    placeholder="Committee rules and guidelines..."
                    rows={4}
                    {...register("rules")}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
          <Link
            href="/committees"
            className={cn(buttonVariants({ variant: "outline" }), "w-full sm:w-auto")}
          >
            Cancel
          </Link>
          <Button type="submit" disabled={loading} className="w-full sm:w-auto">
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create Committee
          </Button>
        </div>
      </form>
    </div>
  );
}
