import { Header } from "./header";
import { Sidebar } from "./sidebar";
import { BottomNav } from "./bottom-nav";
import { Fab } from "./fab";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 pt-14 pb-32 lg:pl-56 lg:pb-8">
          <div className="mx-auto w-full max-w-5xl space-y-4 px-3 py-4 sm:px-4 lg:px-6">
            {children}
          </div>
        </main>
      </div>
      <Fab />
      <BottomNav />
    </div>
  );
}
