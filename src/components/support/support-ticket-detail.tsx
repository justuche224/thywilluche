"use client";

import { useEffect, useState, useCallback } from "react";
import { getSupportTicketDetail, sendSupportMessage } from "@/actions/support";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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

export function SupportTicketDetail({
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "OPEN":
        return "bg-blue-100 text-blue-800";
      case "IN_PROGRESS":
        return "bg-yellow-100 text-yellow-800";
      case "RESOLVED":
        return "bg-green-100 text-green-800";
      case "CLOSED":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
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
          <Link href="/support">
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
        <Link href="/support">
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
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap ${getStatusColor(
                ticket.status
              )}`}
            >
              {ticket.status}
            </span>
          </div>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-gray-600">
          <p>
            Created on {new Date(ticket.createdAt).toLocaleDateString()} at{" "}
            {new Date(ticket.createdAt).toLocaleTimeString()}
          </p>
          <p>Last updated {new Date(ticket.updatedAt).toLocaleString()}</p>
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
                  No messages yet. Start the conversation below.
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
                placeholder="Type your message here..."
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
                {isSubmitting ? "Sending..." : "Send Message"}
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
