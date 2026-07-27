export type TicketStatus = "open" | "in-progress" | "resolved" | "closed";
export type TicketPriority = "low" | "medium" | "high" | "urgent";

export interface ISupportTicketMessage {
  sender: string;
  body: string;
  createdAt: Date;
}

export interface ISupportTicket {
  _id: string;
  user: string;
  subject: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  messages: ISupportTicketMessage[];
  assignedTo?: string;
  createdAt: Date;
  updatedAt: Date;
}
