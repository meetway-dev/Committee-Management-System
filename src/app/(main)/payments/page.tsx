import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { EmptyState } from "@/components/shared/empty-state";
import { getMyPayments } from "@/actions/payment.actions";
import { formatCurrency, formatDate } from "@/utils/format";
import { CreditCard } from "lucide-react";

export default async function PaymentsPage() {
  const payments = await getMyPayments();

  const pending = payments.filter(
    (p: { status: string }) => p.status === "pending"
  );
  const approved = payments.filter(
    (p: { status: string }) => p.status === "approved"
  );
  const rejected = payments.filter(
    (p: { status: string }) => p.status === "rejected"
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Payments"
        description="Track your payment history"
        icon={CreditCard}
      />

      {payments.length === 0 ? (
        <EmptyState
          icon={CreditCard}
          title="No payments yet"
          description="Your payment history will appear here once you make contributions."
        />
      ) : (
        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">All ({payments.length})</TabsTrigger>
            <TabsTrigger value="pending">
              Pending ({pending.length})
            </TabsTrigger>
            <TabsTrigger value="approved">
              Approved ({approved.length})
            </TabsTrigger>
            <TabsTrigger value="rejected">
              Rejected ({rejected.length})
            </TabsTrigger>
          </TabsList>

          {["all", "pending", "approved", "rejected"].map((tab) => {
            const filtered =
              tab === "all"
                ? payments
                : payments.filter(
                    (p: { status: string }) => p.status === tab
                  );

            return (
              <TabsContent key={tab} value={tab}>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">
                      {tab === "all" ? "All" : tab.charAt(0).toUpperCase() + tab.slice(1)} Payments
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {filtered.length === 0 ? (
                      <p className="py-8 text-center text-sm text-muted-foreground">
                        No {tab} payments
                      </p>
                    ) : (
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Committee</TableHead>
                              <TableHead>Amount</TableHead>
                              <TableHead>Round</TableHead>
                              <TableHead>Method</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead>Date</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {filtered.map(
                              (payment: {
                                _id: string;
                                committee?: {
                                  name: string;
                                  currency: string;
                                };
                                amount: number;
                                round: number;
                                paymentMethod?: string;
                                status: string;
                                createdAt: string;
                              }) => (
                                <TableRow key={payment._id}>
                                  <TableCell className="font-medium">
                                    {payment.committee?.name || "Unknown"}
                                  </TableCell>
                                  <TableCell>
                                    {formatCurrency(
                                      payment.amount,
                                      payment.committee?.currency
                                    )}
                                  </TableCell>
                                  <TableCell>{payment.round}</TableCell>
                                  <TableCell className="capitalize">
                                    {payment.paymentMethod?.replace("-", " ") ||
                                      "—"}
                                  </TableCell>
                                  <TableCell>
                                    <StatusBadge status={payment.status} />
                                  </TableCell>
                                  <TableCell className="text-muted-foreground">
                                    {formatDate(payment.createdAt)}
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
              </TabsContent>
            );
          })}
        </Tabs>
      )}
    </div>
  );
}
