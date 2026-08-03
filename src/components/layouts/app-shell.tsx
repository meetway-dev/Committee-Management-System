import { BottomNav } from "./bottom-nav";
import { Header } from "./header";
import { Sidebar } from "./sidebar";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      <div className="hidden lg:block">
        <Sidebar />
      </div>

      <main className="pb-28 pt-14 lg:pb-8 lg:pl-56">
        <div className="mx-auto w-full max-w-6xl px-3 py-3 sm:px-4 lg:px-6">
          <div className="space-y-3">{children}</div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
