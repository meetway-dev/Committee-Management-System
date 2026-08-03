"use client";

import { Button } from "@/components/ui/button";
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
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { changePassword, getProfile, updateProfile } from "@/actions/profile.actions";
import { GradientAvatar } from "@/components/shared/gradient-avatar";
import { PageHeader } from "@/components/shared/page-header";
import { SectionHeader } from "@/components/shared/section-header";
import { COUNTRIES } from "@/constants";
import {
    changePasswordSchema,
    updateProfileSchema,
    type ChangePasswordInput,
    type UpdateProfileInput,
} from "@/schemas/profile.schema";
import { KeyRound, Loader2, UserCircle } from "lucide-react";

export default function ProfilePage() {
  const { data: session } = useSession();
  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  const profileForm = useForm<UpdateProfileInput>({
    resolver: zodResolver(updateProfileSchema),
  });

  const passwordForm = useForm<ChangePasswordInput>({
    resolver: zodResolver(changePasswordSchema),
  });

  // Controlled country value, kept in sync with the form so the async profile
  // load below populates the Select instead of leaving it on the placeholder.
  const [countryVal, setCountryVal] = useState("");

  useEffect(() => {
    async function loadProfile() {
      const profile = await getProfile();
      if (profile) {
        profileForm.reset({
          name: profile.name || "",
          phone: profile.phone || "",
          whatsapp: profile.whatsapp || "",
          country: profile.country || "",
          city: profile.city || "",
          bio: profile.bio || "",
        });
        setCountryVal(profile.country || "");
      }
    }
    loadProfile();
  }, [profileForm]);

  async function onProfileSubmit(data: UpdateProfileInput) {
    setProfileLoading(true);
    try {
      const result = await updateProfile(data);
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.error);
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setProfileLoading(false);
    }
  }

  async function onPasswordSubmit(data: ChangePasswordInput) {
    setPasswordLoading(true);
    try {
      const result = await changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      if (result.success) {
        toast.success(result.message);
        passwordForm.reset();
      } else {
        toast.error(result.error);
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setPasswordLoading(false);
    }
  }

  const user = session?.user;

  return (
    <>
      <PageHeader
        title="Profile"
        description="Manage your account information"
        icon={UserCircle}
      />

      {/* Identity hero */}
      <div className="flex items-center gap-3 rounded-[var(--card-radius)] bg-card p-3.5 ring-1 ring-foreground/[0.06] shadow-[0_8px_24px_-20px_rgba(20,16,31,0.12)]">
        <GradientAvatar
          name={user?.name || "You"}
          image={user?.image}
          size="lg"
        />
        <div className="min-w-0">
          <p className="truncate font-heading text-base font-bold tracking-tight">
            {user?.name || "Your account"}
          </p>
          <p className="truncate text-[0.8rem] text-muted-foreground">
            {user?.email}
          </p>
        </div>
      </div>

      <form
        onSubmit={profileForm.handleSubmit(onProfileSubmit)}
        className="space-y-2"
      >
        <SectionHeader
          title="Personal information"
          caption="Update your personal details"
        />
        <div className="space-y-3.5 rounded-[var(--card-radius)] bg-card p-3.5 ring-1 ring-foreground/[0.06] shadow-[0_8px_24px_-20px_rgba(20,16,31,0.12)]">
          <div className="grid gap-3.5 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" {...profileForm.register("name")} />
              {profileForm.formState.errors.name && (
                <p className="text-[11px] text-destructive">
                  {profileForm.formState.errors.name.message}
                </p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                placeholder="+92 300 1234567"
                {...profileForm.register("phone")}
              />
            </div>
          </div>
          <div className="grid gap-3.5 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="whatsapp">WhatsApp</Label>
              <Input
                id="whatsapp"
                placeholder="+92 300 1234567"
                {...profileForm.register("whatsapp")}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="country">Country</Label>
              <Select
                value={countryVal}
                onValueChange={(v) => {
                  setCountryVal(v ?? "");
                  profileForm.setValue("country", v ?? "");
                }}
              >
                <SelectTrigger id="country">
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent>
                  {COUNTRIES.map((country) => (
                    <SelectItem key={country} value={country}>
                      {country}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              placeholder="Your city"
              {...profileForm.register("city")}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              placeholder="Tell us about yourself..."
              rows={3}
              {...profileForm.register("bio")}
            />
          </div>
          <Button
            type="submit"
            disabled={profileLoading}
            className="w-full sm:w-auto"
          >
            {profileLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Changes
          </Button>
        </div>
      </form>

      <form
        onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}
        className="space-y-2"
      >
        <SectionHeader
          title="Change password"
          caption="Keep your account secure"
        />
        <div className="space-y-3.5 rounded-[var(--card-radius)] bg-card p-3.5 ring-1 ring-foreground/[0.06] shadow-[0_8px_24px_-20px_rgba(20,16,31,0.12)]">
          <div className="space-y-1.5">
            <Label htmlFor="currentPassword">Current Password</Label>
            <Input
              id="currentPassword"
              type="password"
              {...passwordForm.register("currentPassword")}
            />
            {passwordForm.formState.errors.currentPassword && (
              <p className="text-[11px] text-destructive">
                {passwordForm.formState.errors.currentPassword.message}
              </p>
            )}
          </div>
          <div className="grid gap-3.5 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                {...passwordForm.register("newPassword")}
              />
              {passwordForm.formState.errors.newPassword && (
                <p className="text-[11px] text-destructive">
                  {passwordForm.formState.errors.newPassword.message}
                </p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                {...passwordForm.register("confirmPassword")}
              />
              {passwordForm.formState.errors.confirmPassword && (
                <p className="text-[11px] text-destructive">
                  {passwordForm.formState.errors.confirmPassword.message}
                </p>
              )}
            </div>
          </div>
          <Button
            type="submit"
            variant="outline"
            disabled={passwordLoading}
            className="w-full gap-1.5 sm:w-auto"
          >
            {passwordLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <KeyRound className="h-4 w-4" />
            )}
            Change Password
          </Button>
        </div>
      </form>
    </>
  );
}
