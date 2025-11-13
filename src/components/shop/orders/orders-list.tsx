"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Package,
  Calendar,
  DollarSign,
  ArrowRight,
} from "lucide-react";
import { Oswald } from "next/font/google";
import { georgiaItalic } from "@/utils/georgia-italic";

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
    default:
      return "text-gray-600";
  }
};

const OrdersList = ({ orders }: OrdersListProps) => {
  if (orders.length === 0) {
    return (
      <div className="text-center py-20">
        <Package className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
        <h2
          className={`text-3xl font-bold ${georgiaItalic.className} text-gray-900 mb-2`}
        >
          No Orders Yet
        </h2>
        <p className="text-muted-foreground mb-6">
          You haven't placed any orders yet. Start shopping to see your orders
          here.
        </p>
        <Button asChild size="lg">
          <Link href="/shop">Start Shopping</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => {
        const orderDate = new Date(order.createdAt).toLocaleDateString(
          "en-US",
          {
            year: "numeric",
            month: "long",
            day: "numeric",
          }
        );

        return (
          <div
            key={order.id}
            className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3
                      className={`text-xl font-bold ${oswald.className} text-gray-900 mb-1`}
                    >
                      {order.orderNumber}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {orderDate}
                      </div>
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4" />$
                        {parseFloat(order.total).toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                      order.status
                    )} ${oswald.className}`}
                  >
                    {order.status}
                  </span>
                  <span
                    className={`text-sm font-semibold ${
                      oswald.className
                    } ${getPaymentStatusColor(order.paymentStatus)}`}
                  >
                    Payment: {order.paymentStatus}
                  </span>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <Button asChild variant="outline" size="sm">
                  <Link href={`/shop/orders/${order.id}`} className="gap-2">
                    View Details
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default OrdersList;
