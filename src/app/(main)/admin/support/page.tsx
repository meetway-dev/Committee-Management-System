import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { getSupportTickets } from "@/actions/admin.actions";
import { formatDate, getInitials } from "@/utils/format";
import { LifeBuoy } from "lucide-react";

export default async function AdminSupportPage() {
  const tickets = await getSupportTickets();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Support Tickets"
        description={`${tickets.length} total tickets`}
        icon={LifeBuoy}
      />

      <Card>
        <CardHeader>
          <CardTitle className="text-base">All Tickets</CardTitle>
        </CardHeader>
        <CardContent>
          {tickets.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No support tickets
            </p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tickets.map(
                    (ticket: {
                      _id: string;
                      user?: {
                        name: string;
                        email: string;
                        image?: string;
                      };
                      subject: string;
                      category: string;
                      priority: string;
                      status: string;
                      createdAt: string;
                    }) => (
                      <TableRow key={ticket._id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-7 w-7">
                              <AvatarImage
                                src={ticket.user?.image || ""}
                                alt={ticket.user?.name || ""}
                              />
                              <AvatarFallback className="text-[10px]">
                                {ticket.user?.name
                                  ? getInitials(ticket.user.name)
                                  : "U"}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm">
                              {ticket.user?.name || "Unknown"}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="max-w-[200px] truncate font-medium">
                          {ticket.subject}
                        </TableCell>
                        <TableCell className="capitalize text-muted-foreground">
                          {ticket.category}
                        </TableCell>
                        <TableCell>
                          <StatusBadge
                            status={
                              ticket.priority === "high"
                                ? "overdue"
                                : ticket.priority === "medium"
                                ? "pending"
                                : "active"
                            }
                          />
                        </TableCell>
                        <TableCell>
                          <StatusBadge status={ticket.status} />
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {formatDate(ticket.createdAt)}
                        </TableCell>
                      </TableRow>
                    )
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
