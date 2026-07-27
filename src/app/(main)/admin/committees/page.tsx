import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { getAdminCommittees } from "@/actions/admin.actions";
import { formatCurrency, formatDate } from "@/utils/format";
import { Building } from "lucide-react";

export default async function AdminCommitteesPage() {
  const committees = await getAdminCommittees();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Committee Management"
        description={`${committees.length} total committees`}
        icon={Building}
      />

      <Card>
        <CardHeader>
          <CardTitle className="text-base">All Committees</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Admin</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Members</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {committees.map(
                  (committee: {
                    _id: string;
                    name: string;
                    admin?: { name: string; email: string };
                    contributionAmount: number;
                    currency: string;
                    maxMembers: number;
                    status: string;
                    createdAt: string;
                  }) => (
                    <TableRow key={committee._id}>
                      <TableCell className="font-medium">
                        {committee.name}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {committee.admin?.name || "Unknown"}
                      </TableCell>
                      <TableCell>
                        {formatCurrency(
                          committee.contributionAmount,
                          committee.currency
                        )}
                      </TableCell>
                      <TableCell>{committee.maxMembers}</TableCell>
                      <TableCell>
                        <StatusBadge status={committee.status} />
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatDate(committee.createdAt)}
                      </TableCell>
                    </TableRow>
                  )
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
