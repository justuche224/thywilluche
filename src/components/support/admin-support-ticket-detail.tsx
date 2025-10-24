"use client";

import { useEffect, useState, useCallback } from "react";
import {
  getSupportTicketDetail,
  sendSupportMessage,
  updateTicketStatus,
} from "@/actions/support";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import { toast } from "sonner";
import { RefreshCw, ArrowLeft } from "lucide-react";

interface Message {
  id: number;
  ticketId: number;
  userId: string;
  message: string;
  userName: string;
  userRole?: string;
  createdAt: Date;
}

interface Ticket {
  id: number;
  userId: string;
  title: string;
  description: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  userName: string;
  userEmail: string;
}

export function AdminSupportTicketDetail({
  ticketId,
  userId,
}: {
  ticketId: number;
  userId: string;
}) {
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isStatusUpdating, setIsStatusUpdating] = useState(false);
  const [messageText, setMessageText] = useState("");

  const loadTicketDetail = useCallback(async () => {
    const result = await getSupportTicketDetail(ticketId, userId);
    if (result.success) {
      setTicket(result.ticket as Ticket);
      setMessages((result.messages as Message[]) || []);
    } else {
      toast.error(result.message || "Failed to load ticket");
    }
    setLoading(false);
  }, [ticketId, userId]);

  useEffect(() => {
    loadTicketDetail();

    const interval = setInterval(loadTicketDetail, 3000);

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [loadTicketDetail]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim()) return;

    setIsSubmitting(true);
    const result = await sendSupportMessage(ticketId, userId, messageText);

    if (result.success) {
      setMessageText("");
      await loadTicketDetail();
    } else {
      toast.error(result.message || "Failed to send message");
    }

    setIsSubmitting(false);
  };

  const handleStatusChange = async (newStatus: string) => {
    setIsStatusUpdating(true);
    const result = await updateTicketStatus(ticketId, userId, newStatus);

    if (result.success) {
      toast.success("Ticket status updated");
      await loadTicketDetail();
    } else {
      toast.error(result.message || "Failed to update status");
    }

    setIsStatusUpdating(false);
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <p className="text-center text-gray-600">Loading ticket...</p>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center">
          <p className="text-red-600 mb-4">Ticket not found</p>
          <Link href="/admin/support">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Tickets
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <Link href="/admin/support">
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Tickets
          </Button>
        </Link>
        <Button variant="outline" size="sm" onClick={loadTicketDetail}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-start gap-4">
            <div className="flex-1">
              <CardTitle className="text-2xl mb-2">
                #{ticket.id}: {ticket.title}
              </CardTitle>
              <CardDescription className="text-base">
                {ticket.description}
              </CardDescription>
            </div>
            <div className="flex flex-col gap-2 min-w-40">
              <label className="text-sm font-medium">Status</label>
              <Select
                value={ticket.status}
                onValueChange={handleStatusChange}
                disabled={isStatusUpdating}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="OPEN">Open</SelectItem>
                  <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                  <SelectItem value="RESOLVED">Resolved</SelectItem>
                  <SelectItem value="CLOSED">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-medium text-gray-600">User Name</p>
              <p>{ticket.userName}</p>
            </div>
            <div>
              <p className="font-medium text-gray-600">User Email</p>
              <p className="text-blue-600 underline">{ticket.userEmail}</p>
            </div>
            <div>
              <p className="font-medium text-gray-600">Created</p>
              <p>{new Date(ticket.createdAt).toLocaleString()}</p>
            </div>
            <div>
              <p className="font-medium text-gray-600">Last Updated</p>
              <p>{new Date(ticket.updatedAt).toLocaleString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Chat</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4 h-96 overflow-y-auto space-y-3">
              {messages.length === 0 ? (
                <p className="text-center text-gray-500 py-8">
                  No messages yet. Start the conversation.
                </p>
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${
                      msg.userId === userId ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md rounded-lg px-4 py-2 ${
                        msg.userId === userId
                          ? "bg-blue-500 text-white"
                          : "bg-white border border-gray-300"
                      }`}
                    >
                      <p className="text-sm font-medium mb-1">
                        {msg.userName}
                        {msg.userRole && (
                          <span className="ml-2 text-xs font-normal opacity-75">
                            ({msg.userRole})
                          </span>
                        )}
                      </p>
                      <p className="text-sm break-words">{msg.message}</p>
                      <p
                        className={`text-xs mt-1 ${
                          msg.userId === userId ? "opacity-75" : "text-gray-500"
                        }`}
                      >
                        {new Date(msg.createdAt).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>

            <form onSubmit={handleSendMessage} className="space-y-3">
              <Textarea
                placeholder="Type your response here..."
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                disabled={isSubmitting}
                rows={3}
              />
              <Button
                type="submit"
                disabled={isSubmitting || !messageText.trim()}
                className="w-full"
              >
                {isSubmitting ? "Sending..." : "Send Response"}
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
