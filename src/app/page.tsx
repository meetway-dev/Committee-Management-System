import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
    ArrowRight,
    Check,
    CircleDollarSign,
    ShieldCheck,
    Sparkles,
    Users,
} from "lucide-react";
import Link from "next/link";

const features = [
  {
    icon: Users,
    title: "Organize circle members",
    description:
      "Invite members, manage turns, and keep the group structure clear without spreadsheets or WhatsApp confusion.",
  },
  {
    icon: CircleDollarSign,
    title: "Track contributions cleanly",
    description:
      "Log payments, view history, and keep every contribution visible and easy to verify.",
  },
  {
    icon: ShieldCheck,
    title: "Stay accountable",
    description:
      "Every action is recorded with a clear audit trail, making payments and approvals easier to trust.",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-50 border-b border-border/70 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="mesh-brand flex h-9 w-9 items-center justify-center rounded-2xl shadow-brand">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight font-heading">
              BachatZone
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
            >
              Sign in
            </Link>
            <Link
              href="/register"
              className={cn(buttonVariants({ size: "sm" }))}
            >
              Get started
            </Link>
          </div>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(124,58,237,0.12),transparent_45%)]" />
          <div className="relative mx-auto max-w-6xl px-4 pb-20 pt-16 sm:px-6 lg:px-8 lg:pb-28 lg:pt-20">
            <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
              <div>
                <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card/80 px-3 py-1.5 text-sm text-muted-foreground shadow-sm">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  Built for trusted committee groups
                </div>

                <h1 className="max-w-xl text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                  Professional committee management for modern groups.
                </h1>

                <p className="mt-5 max-w-lg text-base leading-7 text-muted-foreground sm:text-lg">
                  Manage circles, collect payments, assign turns, and keep every member aligned in one clear, secure place.
                </p>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Link
                    href="/register"
                    className={cn(
                      buttonVariants({ size: "lg" }),
                      "w-full sm:w-auto"
                    )}
                  >
                    Start free
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                  <Link
                    href="/login"
                    className={cn(
                      buttonVariants({ variant: "outline", size: "lg" }),
                      "w-full sm:w-auto"
                    )}
                  >
                    Sign in
                  </Link>
                </div>

                <div className="mt-8 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  <span className="inline-flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    Secure records
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    Transparent payments
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    Easy member access
                  </span>
                </div>
              </div>

              <div className="relative">
                <div className="rounded-[var(--card-radius)] border border-border bg-card p-5 shadow-[0_24px_80px_-40px_rgba(124,58,237,0.28)]">
                  <div className="rounded-[var(--card-radius)] border border-border bg-muted/40 p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                          Active circle
                        </p>
                        <h2 className="mt-2 text-2xl font-bold">C1</h2>
                      </div>
                      <div className="rounded-xl bg-emerald-500/10 px-2.5 py-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                        Active
                      </div>
                    </div>

                    <div className="mt-6 space-y-3">
                      <div className="rounded-[var(--card-radius)] bg-background p-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Members</span>
                          <span className="font-semibold">3 / 10</span>
                        </div>
                      </div>

                      <div className="rounded-[var(--card-radius)] bg-background p-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Contribution</span>
                          <span className="font-semibold">Rs 15,000</span>
                        </div>
                      </div>

                      <div className="rounded-[var(--card-radius)] bg-background p-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Current round</span>
                          <span className="font-semibold">2 of 5</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-t border-border bg-muted/30">
          <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
                Why teams use it
              </p>
              <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
                Everything needed to run a circular group with clarity.
              </h2>
            </div>

            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="rounded-[var(--card-radius)] border border-border bg-card p-6 shadow-sm transition-transform duration-200 hover:-translate-y-0.5"
                >
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <feature.icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-xl font-semibold">{feature.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="rounded-[28px] border border-border bg-card p-8 text-center shadow-sm sm:p-12">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
              Ready to begin
            </p>
            <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
              Start your next committee with a cleaner, simpler process.
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-muted-foreground">
              Create a new circle, invite your members, and keep everything organized from day one.
            </p>
            <Link
              href="/register"
              className={cn(
                buttonVariants({ size: "lg" }),
                "mt-8 inline-flex"
              )}
            >
              Create account
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-border bg-background">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 text-sm text-muted-foreground sm:flex-row sm:px-6 lg:px-8">
          <div className="flex items-center gap-2.5">
            <div className="mesh-brand flex h-7 w-7 items-center justify-center rounded-xl">
              <Sparkles className="h-3.5 w-3.5 text-white" />
            </div>
            <span className="font-semibold text-foreground">BachatZone</span>
          </div>
          <p>© {new Date().getFullYear()} BachatZone</p>
        </div>
      </footer>
    </div>
  );
}
