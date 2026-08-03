import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { EmptyState } from "@/components/shared/empty-state";
import { ListRow, ListGroup } from "@/components/shared/list-row";
import { GradientAvatar } from "@/components/shared/gradient-avatar";
import { StatPill } from "@/components/shared/stat-pill";
import { getMyPayments } from "@/actions/payment.actions";
import { formatCurrency, formatDate } from "@/utils/format";
import { CreditCard, CheckCircle2, Clock, XCircle } from "lucide-react";

interface PaymentView {
  _id: string;
  amount: number;
  round: number;
  status: string;
  paymentMethod?: string;
  createdAt: string;
  committee?: { name: string; currency: string };
}

export default async function PaymentsPage() {
  const payments = (await getMyPayments()) as PaymentView[];

  const pending = payments.filter((p) => p.status === "pending");
  const approved = payments.filter((p) => p.status === "approved");
  const rejected = payments.filter((p) => p.status === "rejected");

  const methodLabel = (method?: string) =>
    method ? method.replace(/-/g, " ") : undefined;

  return (
    <>
      <PageHeader
        title="Payments"
        description="Track your contribution history"
        icon={CreditCard}
      />

      {payments.length === 0 ? (
        <EmptyState
          icon={CreditCard}
          title="No payments yet"
          description="Your payment history will appear here once you make contributions."
        />
      ) : (
        <Tabs defaultValue="all">
          <div className="flex flex-col gap-2.5">
            <div className="grid grid-cols-3 gap-2">
              <StatPill
                icon={CheckCircle2}
                label="Paid"
                value={approved.length}
                tone="success"
              />
              <StatPill
                icon={Clock}
                label="Pending"
                value={pending.length}
                tone="warning"
              />
              <StatPill
                icon={XCircle}
                label="Rejected"
                value={rejected.length}
                tone="danger"
              />
            </div>

            <TabsList className="w-full">
              <TabsTrigger value="all">All ({payments.length})</TabsTrigger>
              <TabsTrigger value="pending">
                Pending ({pending.length})
              </TabsTrigger>
              <TabsTrigger value="approved">
                Paid ({approved.length})
              </TabsTrigger>
              <TabsTrigger value="rejected">
                Rejected ({rejected.length})
              </TabsTrigger>
            </TabsList>
          </div>

          {["all", "pending", "approved", "rejected"].map((tab) => {
            const filtered =
              tab === "all"
                ? payments
                : payments.filter((p) => p.status === tab);

            return (
              <TabsContent key={tab} value={tab} className="mt-2.5">
                {filtered.length === 0 ? (
                  <p className="rounded-[var(--card-radius)] bg-card/60 py-8 text-center text-[0.8rem] text-muted-foreground ring-1 ring-foreground/[0.05]">
                    No {tab} payments
                  </p>
                ) : (
                  <div className="rounded-[var(--card-radius)] bg-card p-1.5 ring-1 ring-foreground/[0.06] shadow-[0_10px_26px_-20px_rgba(20,16,31,0.1)]">
                    <ListGroup>
                      {filtered.map((payment) => (
                        <ListRow
                          key={payment._id}
                          leading={
                            <GradientAvatar
                              name={payment.committee?.name || "Committee"}
                              size="md"
                            />
                          }
                          title={payment.committee?.name || "Unknown circle"}
                          caption={
                            <span className="capitalize">
                              {`Round ${payment.round}${
                                methodLabel(payment.paymentMethod)
                                  ? ` · ${methodLabel(payment.paymentMethod)}`
                                  : ""
                              } · ${formatDate(payment.createdAt)}`}
                            </span>
                          }
                          value={formatCurrency(
                            payment.amount,
                            payment.committee?.currency
                          )}
                          trailing={
                            <StatusBadge status={payment.status} dot />
                          }
                        />
                      ))}
                    </ListGroup>
                  </div>
                )}
              </TabsContent>
            );
          })}
        </Tabs>
      )}
    </>
  );
}
