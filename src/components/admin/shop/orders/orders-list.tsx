"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Package,
  Calendar,
  DollarSign,
  ArrowRight,
  Search,
  Filter,
  Eye,
} from "lucide-react";
import { Oswald } from "next/font/google";
import { georgiaItalic } from "@/utils/georgia-italic";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
});

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  total: string;
  createdAt: Date | string;
  shippingFirstName: string;
  shippingLastName: string;
  shippingEmail: string;
}

interface OrdersListProps {
  orders: Order[];
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "Delivered":
      return "bg-green-100 text-green-800 border-green-200";
    case "Shipped":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "Processing":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "Pending":
      return "bg-gray-100 text-gray-800 border-gray-200";
    case "Cancelled":
      return "bg-red-100 text-red-800 border-red-200";
    case "Refunded":
      return "bg-purple-100 text-purple-800 border-purple-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const getPaymentStatusColor = (status: string) => {
  switch (status) {
    case "Completed":
      return "text-green-600";
    case "Failed":
      return "text-red-600";
    case "Pending":
      return "text-yellow-600";
    case "Refunded":
      return "text-purple-600";
    default:
      return "text-gray-600";
  }
};

const OrdersList = ({ orders: initialOrders }: OrdersListProps) => {
  const [orders] = useState(initialOrders);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [paymentStatusFilter, setPaymentStatusFilter] = useState<string>("all");

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.shippingEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      `${order.shippingFirstName} ${order.shippingLastName}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || order.status === statusFilter;
    const matchesPaymentStatus =
      paymentStatusFilter === "all" ||
      order.paymentStatus === paymentStatusFilter;

    return matchesSearch && matchesStatus && matchesPaymentStatus;
  });

  return (
    <div className="space-y-6 p-6 container mx-auto px-4 py-10 max-w-6xl">
      <div>
        <h1
          className={`text-4xl font-bold ${georgiaItalic.className} text-gray-900 mb-2`}
        >
          Orders Management
        </h1>
        <p className="text-muted-foreground">
          Manage and track all customer orders
        </p>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search by order number, email, or customer name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-[180px]">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Order Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Processing">Processing</SelectItem>
              <SelectItem value="Shipped">Shipped</SelectItem>
              <SelectItem value="Delivered">Delivered</SelectItem>
              <SelectItem value="Cancelled">Cancelled</SelectItem>
              <SelectItem value="Refunded">Refunded</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={paymentStatusFilter}
            onValueChange={setPaymentStatusFilter}
          >
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Payment Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Payments</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
              <SelectItem value="Failed">Failed</SelectItem>
              <SelectItem value="Refunded">Refunded</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {filteredOrders.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h2
              className={`text-2xl font-bold ${georgiaItalic.className} text-gray-900 mb-2`}
            >
              No Orders Found
            </h2>
            <p className="text-muted-foreground">
              {orders.length === 0
                ? "No orders have been placed yet."
                : "No orders match your filters."}
            </p>
          </div>
        ) : (
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className={oswald.className}>
                    Order Number
                  </TableHead>
                  <TableHead className={oswald.className}>Customer</TableHead>
                  <TableHead className={oswald.className}>Date</TableHead>
                  <TableHead className={oswald.className}>Total</TableHead>
                  <TableHead className={oswald.className}>
                    Order Status
                  </TableHead>
                  <TableHead className={oswald.className}>
                    Payment Status
                  </TableHead>
                  <TableHead className={oswald.className}>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => {
                  const orderDate = new Date(
                    order.createdAt
                  ).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  });

                  return (
                    <TableRow key={order.id}>
                      <TableCell>
                        <span className={`font-semibold ${oswald.className}`}>
                          {order.orderNumber}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className={`font-medium ${oswald.className}`}>
                            {order.shippingFirstName} {order.shippingLastName}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {order.shippingEmail}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm">
                          <Calendar className="w-3 h-3" />
                          {orderDate}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <DollarSign className="w-4 h-4" />
                          <span className={`font-semibold ${oswald.className}`}>
                            {parseFloat(order.total).toFixed(2)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded text-xs font-semibold border ${getStatusColor(
                            order.status
                          )} ${oswald.className}`}
                        >
                          {order.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span
                          className={`text-sm font-semibold ${
                            oswald.className
                          } ${getPaymentStatusColor(order.paymentStatus)}`}
                        >
                          {order.paymentStatus}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Button asChild variant="outline" size="sm">
                          <Link
                            href={`/admin/shop/orders/${order.id}`}
                            className="gap-2"
                          >
                            <Eye className="w-4 h-4" />
                            View
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}

        {filteredOrders.length > 0 && (
          <div className="mt-4 text-sm text-muted-foreground">
            Showing {filteredOrders.length} of {orders.length} orders
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersList;
