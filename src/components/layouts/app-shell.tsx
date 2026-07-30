import { Header } from "./header";
import { Sidebar } from "./sidebar";
import { BottomNav } from "./bottom-nav";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 pt-16 pb-24 lg:pl-64 lg:pb-8">
          <div className="mx-auto max-w-7xl px-2 py-3 sm:px-4 lg:px-6">
            <div className="rounded-2xl border border-border/60 bg-card/80 p-2 shadow-[0_8px_24px_rgba(15,23,42,0.04)] backdrop-blur-sm sm:p-3">
              {children}
            </div>
          </div>
        </main>
      </div>
      <BottomNav />
    </div>
  );
}
