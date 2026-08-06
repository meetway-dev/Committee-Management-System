import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
    ArrowRight,
    CircleDollarSign,
    ShieldCheck,
    Sparkles,
    Users,
} from "lucide-react";
import Link from "next/link";

const features = [
  {
    icon: Users,
    title: "Circles",
    description:
      "Create a committee, invite members, and assign turns in minutes.",
  },
  {
    icon: CircleDollarSign,
    title: "Payments",
    description:
      "Collect and record contributions every round with a clear history.",
  },
  {
    icon: ShieldCheck,
    title: "Trust",
    description:
      "Transparent records keep everyone accountable from day one.",
  },
];

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <header className="sticky top-0 z-50 border-b border-border/70 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="mesh-brand flex h-8 w-8 items-center justify-center rounded-xl shadow-brand">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <span className="font-heading text-lg font-bold tracking-tight">
              BachatZone
            </span>
          </Link>

          <div className="flex items-center gap-2">
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

      <main className="flex-1">
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(124,58,237,0.12),transparent_45%)]" />
          <div className="relative mx-auto max-w-3xl px-4 py-20 text-center sm:px-6 lg:py-28">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-border bg-card/80 px-3 py-1 text-xs font-medium text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Committee savings, made simple
            </div>

            <h1 className="font-heading text-4xl font-bold tracking-tight sm:text-5xl">
              Run your committee without the confusion.
            </h1>

            <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
              Create a circle, invite members, collect payments, and assign
              turns — all in one clean place.
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
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
          </div>
        </section>

        <section className="border-t border-border bg-muted/30">
          <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
            <div className="grid gap-4 sm:grid-cols-3">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="rounded-[var(--card-radius)] border border-border bg-card p-5"
                >
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <feature.icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-semibold">{feature.title}</h3>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border bg-background">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 px-4 py-6 text-sm text-muted-foreground sm:flex-row sm:px-6">
          <div className="flex items-center gap-2">
            <div className="mesh-brand flex h-6 w-6 items-center justify-center rounded-lg">
              <Sparkles className="h-3 w-3 text-white" />
            </div>
            <span className="font-semibold text-foreground">BachatZone</span>
          </div>
          <p>© {new Date().getFullYear()} BachatZone</p>
        </div>
      </footer>
    </div>
  );
}
