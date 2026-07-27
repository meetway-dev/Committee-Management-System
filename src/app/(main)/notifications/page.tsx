import Link from "next/link";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { getNotifications } from "@/actions/notification.actions";
import { formatRelativeDate } from "@/utils/format";
import {
  Bell,
  CreditCard,
  Users,
  Calendar,
  AlertCircle,
  CheckCircle2,
  XCircle,
  UserPlus,
  Megaphone,
  Info,
} from "lucide-react";
import { MarkAllReadButton } from "@/features/notification/mark-all-read-button";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  payment_due: CreditCard,
  payment_submitted: CreditCard,
  payment_approved: CheckCircle2,
  payment_rejected: XCircle,
  payment_late: AlertCircle,
  member_joined: UserPlus,
  member_removed: Users,
  committee_started: Users,
  committee_completed: CheckCircle2,
  payout_scheduled: Calendar,
  payout_completed: CheckCircle2,
  turn_reminder: Calendar,
  invitation_received: UserPlus,
  announcement: Megaphone,
  system: Info,
};

export default async function NotificationsPage() {
  const notifications = await getNotifications();

  const unreadCount = notifications.filter(
    (n: { read: boolean }) => !n.read
  ).length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Notifications"
        description={
          unreadCount > 0
            ? `${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}`
            : "You're all caught up"
        }
        icon={Bell}
        action={unreadCount > 0 ? <MarkAllReadButton /> : undefined}
      />

      {notifications.length === 0 ? (
        <EmptyState
          icon={Bell}
          title="No notifications"
          description="You'll receive notifications about payment reminders, committee updates, and more."
        />
      ) : (
        <div className="space-y-2">
          {notifications.map(
            (notification: {
              _id: string;
              type: string;
              title: string;
              body: string;
              actionUrl?: string;
              read: boolean;
              createdAt: string;
            }) => {
              const Icon = iconMap[notification.type] || Bell;

              const content = (
                <Card
                  className={cn(
                    "transition-all hover:shadow-sm",
                    !notification.read && "border-primary/20 bg-primary/5"
                  )}
                >
                  <CardContent className="flex items-start gap-3 p-4">
                    <div
                      className={cn(
                        "mt-0.5 rounded-lg p-2",
                        !notification.read
                          ? "bg-primary/10 text-primary"
                          : "bg-muted text-muted-foreground"
                      )}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <p
                          className={cn(
                            "text-sm",
                            !notification.read ? "font-semibold" : "font-medium"
                          )}
                        >
                          {notification.title}
                        </p>
                        <span className="shrink-0 text-xs text-muted-foreground">
                          {formatRelativeDate(notification.createdAt)}
                        </span>
                      </div>
                      <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">
                        {notification.body}
                      </p>
                    </div>
                    {!notification.read && (
                      <div className="mt-2 h-2 w-2 shrink-0 rounded-full bg-primary" />
                    )}
                  </CardContent>
                </Card>
              );

              if (notification.actionUrl) {
                return (
                  <Link key={notification._id} href={notification.actionUrl}>
                    {content}
                  </Link>
                );
              }

              return <div key={notification._id}>{content}</div>;
            }
          )}
        </div>
      )}
    </div>
  );
}
