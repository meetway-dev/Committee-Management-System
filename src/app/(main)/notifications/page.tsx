import Link from "next/link";
import { cn } from "@/lib/utils";
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

interface NotificationView {
  _id: string;
  type: string;
  title: string;
  body: string;
  actionUrl?: string;
  read: boolean;
  createdAt: string;
}

export default async function NotificationsPage() {
  const notifications = (await getNotifications()) as NotificationView[];

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <>
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
          description="You'll get notified about payment reminders, circle updates, and more."
        />
      ) : (
        <div className="space-y-2">
          {notifications.map((notification) => {
            const Icon = iconMap[notification.type] || Bell;

            const body = (
              <div
                className={cn(
                  "flex items-start gap-3 rounded-2xl p-3 ring-1 transition-colors",
                  notification.read
                    ? "bg-card ring-foreground/[0.06]"
                    : "bg-primary-soft ring-primary/25",
                  notification.actionUrl && "hover:bg-muted/60 active:bg-muted"
                )}
              >
                <div
                  className={cn(
                    "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl",
                    notification.read
                      ? "bg-muted text-muted-foreground"
                      : "bg-primary text-primary-foreground"
                  )}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <p
                      className={cn(
                        "text-[0.8rem] leading-tight",
                        notification.read ? "font-medium" : "font-bold"
                      )}
                    >
                      {notification.title}
                    </p>
                    <span className="shrink-0 text-[10px] text-muted-foreground">
                      {formatRelativeDate(notification.createdAt)}
                    </span>
                  </div>
                  <p className="mt-1 line-clamp-2 text-[11px] leading-relaxed text-muted-foreground">
                    {notification.body}
                  </p>
                </div>
                {!notification.read && (
                  <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary" />
                )}
              </div>
            );

            if (notification.actionUrl) {
              return (
                <Link
                  key={notification._id}
                  href={notification.actionUrl}
                  className="block"
                >
                  {body}
                </Link>
              );
            }

            return <div key={notification._id}>{body}</div>;
          })}
        </div>
      )}
    </>
  );
}
