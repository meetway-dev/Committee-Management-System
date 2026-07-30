import Link from "next/link";
// removed unused imports: cn, buttonVariants
import { getAdminStats } from "@/actions/admin.actions";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { ArrowRight, Building, CreditCard, LayoutDashboard, LifeBuoy, Users } from "lucide-react";

export default async function AdminDashboardPage() {
  const stats = await getAdminStats();

  if (!stats) {
    return (
      <div className="py-16 text-center">
        <p className="text-muted-foreground">Access denied</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Admin Dashboard"
        description="System overview and management"
        icon={LayoutDashboard}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          icon={Users}
          description="Registered accounts"
        />
        <StatCard
          title="Total Committees"
          value={stats.totalCommittees}
          icon={Building}
          description="All committees"
        />
        <StatCard
          title="Total Payments"
          value={stats.totalPayments}
          icon={CreditCard}
          description="Payment records"
        />
        <StatCard
          title="Open Tickets"
          value={stats.openTickets}
          icon={LifeBuoy}
          description="Awaiting response"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Link
          href="/admin/users"
          className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-muted"
        >
          <div className="flex items-center gap-3">
            <Users className="h-5 w-5 text-primary" />
            <span className="font-medium">Manage Users</span>
          </div>
          <ArrowRight className="h-4 w-4 text-muted-foreground" />
        </Link>
        <Link
          href="/admin/committees"
          className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-muted"
        >
          <div className="flex items-center gap-3">
            <Building className="h-5 w-5 text-primary" />
            <span className="font-medium">Manage Committees</span>
          </div>
          <ArrowRight className="h-4 w-4 text-muted-foreground" />
        </Link>
        <Link
          href="/admin/support"
          className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-muted"
        >
          <div className="flex items-center gap-3">
            <LifeBuoy className="h-5 w-5 text-primary" />
            <span className="font-medium">Support Tickets</span>
          </div>
          <ArrowRight className="h-4 w-4 text-muted-foreground" />
        </Link>
      </div>
    </div>
  );
}
