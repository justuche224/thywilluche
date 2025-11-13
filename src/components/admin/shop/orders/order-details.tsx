"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Phone,
  Mail,
  MapPin,
  Calendar,
  DollarSign,
  Package,
  Save,
  Loader2,
} from "lucide-react";
import { Oswald } from "next/font/google";
import { georgiaItalic } from "@/utils/georgia-italic";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

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
  paymentReference: string | null;
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

const OrderDetails = ({ order: initialOrder, items }: OrderDetailsProps) => {
  const router = useRouter();
  const [order, setOrder] = useState(initialOrder);
  const [status, setStatus] = useState(order.status);
  const [paymentStatus, setPaymentStatus] = useState(order.paymentStatus);
  const [isSaving, setIsSaving] = useState(false);

  const orderDate = new Date(order.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const handleSave = async () => {
    if (status === order.status && paymentStatus === order.paymentStatus) {
      toast.info("No changes to save");
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch(`/api/admin/orders/${order.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status,
          paymentStatus,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to update order");
      }

      setOrder({ ...order, status, paymentStatus });
      toast.success("Order updated successfully");
      router.refresh();
    } catch (error) {
      console.error("Error updating order:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to update order"
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 p-6 container mx-auto px-4 py-10 max-w-6xl">
      <div className="flex items-center justify-between">
        <Button asChild variant="outline" size="sm">
          <Link href="/admin/shop/orders" className="gap-2">
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
            <div className="space-y-3">
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
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Status:</span>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Processing">Processing</SelectItem>
                    <SelectItem value="Shipped">Shipped</SelectItem>
                    <SelectItem value="Delivered">Delivered</SelectItem>
                    <SelectItem value="Cancelled">Cancelled</SelectItem>
                    <SelectItem value="Refunded">Refunded</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Payment Status:</span>
                <Select value={paymentStatus} onValueChange={setPaymentStatus}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                    <SelectItem value="Failed">Failed</SelectItem>
                    <SelectItem value="Refunded">Refunded</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {order.paymentReference && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Payment Reference:
                  </span>
                  <span className={`text-xs ${oswald.className} font-mono`}>
                    {order.paymentReference}
                  </span>
                </div>
              )}
              {order.transactionId && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Transaction ID:</span>
                  <span className={`text-xs ${oswald.className} font-mono`}>
                    {order.transactionId}
                  </span>
                </div>
              )}
              {order.paymentMethod && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Payment Method:</span>
                  <span className={oswald.className}>
                    {order.paymentMethod}
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
            <div className="space-y-2 text-sm">
              <p className={oswald.className}>
                {order.shippingFirstName} {order.shippingLastName}
              </p>
              <p className="text-muted-foreground flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {order.shippingAddress}
              </p>
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

        <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t">
          <Button onClick={handleSave} disabled={isSaving} className="flex-1">
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
          <Button asChild variant="outline" className="flex-1">
            <Link href="/admin/shop/orders" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Orders
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
