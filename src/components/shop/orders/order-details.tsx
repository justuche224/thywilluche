"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Package,
  Calendar,
  DollarSign,
  ArrowLeft,
  MessageCircle,
  MapPin,
  Phone,
  Mail,
  Truck,
} from "lucide-react";
import { Oswald } from "next/font/google";
import { georgiaItalic } from "@/utils/georgia-italic";

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
});

interface OrderItem {
  id: string;
  variantName: string;
  quantity: number;
  price: string;
  itemType: "book" | "merch";
}

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  subtotal: string;
  shipping: string;
  tax: string;
  total: string;
  shippingFirstName: string;
  shippingLastName: string;
  shippingEmail: string;
  shippingPhone: string | null;
  shippingAddress: string;
  shippingCity: string;
  shippingState: string;
  shippingZipCode: string;
  shippingCountry: string;
  paymentMethod: string | null;
  transactionId: string | null;
  createdAt: Date | string;
}

interface OrderDetailsProps {
  order: Order;
  items: OrderItem[];
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

const OrderDetails = ({ order, items }: OrderDetailsProps) => {
  const orderDate = new Date(order.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const hasDigitalItems = items.some(
    (item) =>
      item.itemType === "book" &&
      (item.variantName === "E-Book" || item.variantName === "Audiobook")
  );

  return (
    <div className="space-y-6 container mx-auto px-4 py-10 max-w-6xl">
      <div className="flex items-center justify-between mb-6">
        <Button asChild variant="outline" size="sm">
          <Link href="/shop/orders" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Orders
          </Link>
        </Button>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6 md:p-8">
        <div className="mb-6">
          <h1
            className={`text-3xl lg:text-4xl font-bold ${georgiaItalic.className} text-gray-900 mb-2`}
          >
            Order Details
          </h1>
          <p className="text-muted-foreground">Order {order.orderNumber}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <h3
              className={`font-semibold ${oswald.className} text-gray-900 mb-3`}
            >
              Order Information
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Order Number:</span>
                <span className={`font-semibold ${oswald.className}`}>
                  {order.orderNumber}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Order Date:</span>
                <span className={oswald.className}>{orderDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status:</span>
                <span
                  className={`px-2 py-1 rounded text-xs font-semibold border ${getStatusColor(
                    order.status
                  )} ${oswald.className}`}
                >
                  {order.status}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Payment Status:</span>
                <span
                  className={`font-semibold ${
                    oswald.className
                  } ${getPaymentStatusColor(order.paymentStatus)}`}
                >
                  {order.paymentStatus}
                </span>
              </div>
              {order.transactionId && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Transaction ID:</span>
                  <span className={`text-xs ${oswald.className} font-mono`}>
                    {order.transactionId}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h3
              className={`font-semibold ${oswald.className} text-gray-900 mb-3`}
            >
              Shipping Address
            </h3>
            <div className="space-y-1 text-sm">
              <p className={oswald.className}>
                {order.shippingFirstName} {order.shippingLastName}
              </p>
              <p className="text-muted-foreground">{order.shippingAddress}</p>
              <p className="text-muted-foreground">
                {order.shippingCity}, {order.shippingState}{" "}
                {order.shippingZipCode}
              </p>
              <p className="text-muted-foreground">{order.shippingCountry}</p>
              {order.shippingPhone && (
                <p className="text-muted-foreground flex items-center gap-1 mt-2">
                  <Phone className="w-3 h-3" />
                  {order.shippingPhone}
                </p>
              )}
              <p className="text-muted-foreground flex items-center gap-1">
                <Mail className="w-3 h-3" />
                {order.shippingEmail}
              </p>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h2
            className={`text-xl font-bold ${oswald.className} text-gray-900 mb-4`}
          >
            Order Items
          </h2>
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    className={`px-4 py-3 text-left text-sm font-semibold ${oswald.className} text-gray-900`}
                  >
                    Item
                  </th>
                  <th
                    className={`px-4 py-3 text-center text-sm font-semibold ${oswald.className} text-gray-900`}
                  >
                    Quantity
                  </th>
                  <th
                    className={`px-4 py-3 text-right text-sm font-semibold ${oswald.className} text-gray-900`}
                  >
                    Price
                  </th>
                  <th
                    className={`px-4 py-3 text-right text-sm font-semibold ${oswald.className} text-gray-900`}
                  >
                    Total
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {items.map((item) => {
                  const itemTotal = parseFloat(item.price) * item.quantity;
                  return (
                    <tr key={item.id}>
                      <td className="px-4 py-3">
                        <div>
                          <p className={`font-semibold ${oswald.className}`}>
                            {item.variantName}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {item.itemType === "book" ? "Book" : "Merch"}
                          </p>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={oswald.className}>
                          {item.quantity}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className={oswald.className}>
                          ${parseFloat(item.price).toFixed(2)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className={`font-semibold ${oswald.className}`}>
                          ${itemTotal.toFixed(2)}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mb-6">
          <div className="bg-gray-50 rounded-lg p-6 max-w-md ml-auto">
            <h3
              className={`font-semibold ${oswald.className} text-gray-900 mb-4`}
            >
              Order Summary
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className={oswald.className}>Subtotal:</span>
                <span className={oswald.className}>
                  ${parseFloat(order.subtotal).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className={oswald.className}>Shipping:</span>
                <span className={oswald.className}>
                  ${parseFloat(order.shipping).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className={oswald.className}>Tax:</span>
                <span className={oswald.className}>
                  ${parseFloat(order.tax).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between pt-4 border-t border-gray-300 text-lg font-bold">
                <span className={oswald.className}>Total:</span>
                <span className={`${oswald.className} text-green-600`}>
                  ${parseFloat(order.total).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {hasDigitalItems && (
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <div className="text-2xl">📥</div>
              <div>
                <h3
                  className={`font-semibold ${oswald.className} text-purple-900 mb-1`}
                >
                  Digital Items
                </h3>
                <p className="text-sm text-purple-800">
                  Your order contains digital items (E-Book or Audiobook). You
                  will receive a download link via email once your order is
                  processed.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t">
          <Button asChild variant="outline" className="flex-1">
            <Link href="/shop/orders" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Orders
            </Link>
          </Button>
          <Button asChild className="flex-1">
            <Link href="/support" className="gap-2">
              <MessageCircle className="w-4 h-4" />
              Contact Support
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
