import { Header } from "./header";
import { BottomNav } from "./bottom-nav";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="pt-14 pb-28 lg:pb-8">
        <div className="mx-auto w-full max-w-5xl space-y-3 px-3 py-3 sm:px-4 lg:px-6">
          {children}
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
