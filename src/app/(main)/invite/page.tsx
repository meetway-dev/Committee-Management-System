"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
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
import { acceptInvitation } from "@/actions/member.actions";
import { Users, Loader2, CheckCircle2, XCircle } from "lucide-react";

export default function InvitePage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      }
    >
      <InviteContent />
    </Suspense>
  );
}

function InviteContent() {
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();
  const token = searchParams.get("token");

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    message?: string;
    committeeId?: string;
  } | null>(null);

  async function handleAccept() {
    if (!token) return;
    setLoading(true);
    try {
      const res = await acceptInvitation(token);
      if (res.success) {
        setResult({
          success: true,
          message: res.message,
          committeeId: res.data?.committeeId,
        });
        toast.success(res.message);
      } else {
        setResult({ success: false, message: res.error });
        toast.error(res.error);
      }
    } catch {
      setResult({ success: false, message: "Something went wrong" });
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  if (!token) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center py-12 text-center">
            <XCircle className="h-12 w-12 text-destructive" />
            <h2 className="mt-4 text-lg font-semibold">Invalid Invitation</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              This invitation link is invalid or has expired.
            </p>
            <Link
              href="/dashboard"
              className={cn(buttonVariants(), "mt-6")}
            >
              Go to Dashboard
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center py-12 text-center">
            <Users className="h-12 w-12 text-primary" />
            <h2 className="mt-4 text-lg font-semibold">
              Sign in to Accept Invitation
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Please sign in or create an account to join this committee.
            </p>
            <Link
              href={`/login?callbackUrl=/invite?token=${token}`}
              className={cn(buttonVariants(), "mt-6")}
            >
              Sign In
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (result) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center py-12 text-center">
            {result.success ? (
              <>
                <CheckCircle2 className="h-12 w-12 text-emerald-600" />
                <h2 className="mt-4 text-lg font-semibold">
                  You&apos;re In!
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {result.message}
                </p>
                <Link
                  href={`/committees/${result.committeeId}`}
                  className={cn(buttonVariants(), "mt-6")}
                >
                  View Committee
                </Link>
              </>
            ) : (
              <>
                <XCircle className="h-12 w-12 text-destructive" />
                <h2 className="mt-4 text-lg font-semibold">Unable to Join</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {result.message}
                </p>
                <Link
                  href="/dashboard"
                  className={cn(buttonVariants(), "mt-6")}
                >
                  Go to Dashboard
                </Link>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 rounded-2xl bg-primary/10 p-4">
            <Users className="h-8 w-8 text-primary" />
          </div>
          <CardTitle>Committee Invitation</CardTitle>
          <CardDescription>
            You&apos;ve been invited to join a committee
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4">
          <Button onClick={handleAccept} disabled={loading} className="w-full">
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Accept Invitation
          </Button>
          <Link
            href="/dashboard"
            className={cn(
              buttonVariants({ variant: "ghost" }),
              "w-full"
            )}
          >
            Decline
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
