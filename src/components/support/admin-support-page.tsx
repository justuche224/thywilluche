"use client";

import { useEffect, useState, useCallback } from "react";
import { getSupportTickets } from "@/actions/support";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { toast } from "sonner";
import { RefreshCw } from "lucide-react";

interface TicketWithUser {
  id: number;
  title: string;
  description: string;
  status: string;
  createdAt: Date;
  userName: string;
  userEmail: string;
}

export function AdminSupportPage({ userId }: { userId: string }) {
  const [tickets, setTickets] = useState<TicketWithUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  const loadTickets = useCallback(async () => {
    setLoading(true);
    const result = await getSupportTickets(userId);
    if (result.success) {
      setTickets(result.tickets as TicketWithUser[]);
    } else {
      toast.error("Failed to load tickets");
    }
    setLoading(false);
  }, [userId]);

  useEffect(() => {
    loadTickets();

    const interval = setInterval(loadTickets, 5000);
    return () => clearInterval(interval);
  }, [loadTickets]);

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

  const filteredTickets = statusFilter
    ? tickets.filter((t) => t.status === statusFilter)
    : tickets;

  const statusCounts = {
    OPEN: tickets.filter((t) => t.status === "OPEN").length,
    IN_PROGRESS: tickets.filter((t) => t.status === "IN_PROGRESS").length,
    RESOLVED: tickets.filter((t) => t.status === "RESOLVED").length,
    CLOSED: tickets.filter((t) => t.status === "CLOSED").length,
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Support Tickets</h1>
          <p className="text-gray-600 mt-1">Manage all support requests</p>
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={loadTickets}
          disabled={loading}
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {(["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"] as const).map(
          (status) => (
            <Card
              key={status}
              className={`cursor-pointer transition-all ${
                statusFilter === status ? "ring-2 ring-blue-500" : ""
              }`}
              onClick={() =>
                setStatusFilter(statusFilter === status ? null : status)
              }
            >
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {status}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{statusCounts[status]}</div>
              </CardContent>
            </Card>
          )
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            {statusFilter ? `${statusFilter} Tickets` : "All Tickets"}
          </CardTitle>
          <CardDescription>
            {filteredTickets.length} ticket
            {filteredTickets.length !== 1 ? "s" : ""}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-600">Loading tickets...</p>
            </div>
          ) : filteredTickets.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">
                {statusFilter ? `No ${statusFilter} tickets` : "No tickets yet"}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium">ID</th>
                    <th className="text-left py-3 px-4 font-medium">Title</th>
                    <th className="text-left py-3 px-4 font-medium">User</th>
                    <th className="text-left py-3 px-4 font-medium">Email</th>
                    <th className="text-left py-3 px-4 font-medium">Status</th>
                    <th className="text-left py-3 px-4 font-medium">Created</th>
                    <th className="text-left py-3 px-4 font-medium">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTickets.map((ticket) => (
                    <tr
                      key={ticket.id}
                      className="border-b hover:bg-gray-50 transition-colors"
                    >
                      <td className="py-3 px-4 text-sm">#{ticket.id}</td>
                      <td className="py-3 px-4 text-sm">
                        <div className="font-medium max-w-xs truncate">
                          {ticket.title}
                        </div>
                        <div className="text-xs text-gray-500 truncate">
                          {ticket.description}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm">{ticket.userName}</td>
                      <td className="py-3 px-4 text-sm text-blue-600 underline">
                        {ticket.userEmail}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            ticket.status
                          )}`}
                        >
                          {ticket.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm">
                        {new Date(ticket.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">
                        <Link href={`/admin/support/${ticket.id}`}>
                          <Button variant="outline" size="sm">
                            View
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
