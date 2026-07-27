import Link from "next/link";
import { Sparkles } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-primary/5 via-background to-primary/5 px-4 py-8">
      <Link
        href="/"
        className="mb-8 flex items-center gap-2.5"
      >
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/25">
          <Sparkles className="h-4.5 w-4.5 text-white" />
        </div>
        <span className="text-2xl font-extrabold tracking-tight font-heading">
          Committies
        </span>
      </Link>
      <div className="w-full max-w-md">{children}</div>
    </div>
  );
}
