"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ShoppingBag, Package, ArrowRight, Truck } from "lucide-react";
import { Oswald } from "next/font/google";
import { georgiaItalic } from "@/utils/georgia-italic";
import { Confetti } from "./confetti";

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
  shippingAddress: string;
  shippingCity: string;
  shippingState: string;
  shippingZipCode: string;
  shippingCountry: string;
  createdAt: Date | string;
}

interface SuccessPageProps {
  order: Order;
  items: OrderItem[];
}

const SuccessPage = ({ order, items }: SuccessPageProps) => {
  const hasDigitalItems = items.some(
    (item) =>
      item.itemType === "book" &&
      (item.variantName === "E-Book" || item.variantName === "Audiobook")
  );

  const orderDate = new Date(order.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
        <div className="min-h-screen">
      <Confetti />
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8 md:p-12">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
                <CheckCircle2 className="w-12 h-12 text-green-600" />
              </div>
              <h1
                className={`text-4xl lg:text-5xl font-bold ${georgiaItalic.className} text-gray-900 mb-4`}
              >
                Order Successful!
              </h1>
              <p className="text-lg text-muted-foreground">
                Thank you for your purchase. Your order has been confirmed.
              </p>
            </div>

            <div className="space-y-6 mb-8">
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Order Number
                    </p>
                    <p
                      className={`text-2xl font-bold ${oswald.className} text-gray-900`}
                    >
                      {order.orderNumber}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Order Date</p>
                    <p className={`font-semibold ${oswald.className}`}>
                      {orderDate}
                    </p>
                  </div>
                </div>
                <div className="pt-4 border-t border-green-200">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                    <p
                      className={`font-semibold ${oswald.className} text-green-700`}
                    >
                      Payment Status: {order.paymentStatus}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h2
                  className={`text-xl font-bold ${oswald.className} text-gray-900 mb-4`}
                >
                  Order Items
                </h2>
                <div className="space-y-3">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between py-2 border-b border-gray-200 last:border-0"
                    >
                      <div className="flex-1">
                        <p className={`font-semibold ${oswald.className}`}>
                          {item.variantName}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {item.itemType === "book" ? "Book" : "Merch"} ×{" "}
                          {item.quantity}
                        </p>
                      </div>
                      <p className={`font-semibold ${oswald.className}`}>
                        ${parseFloat(item.price).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h2
                  className={`text-xl font-bold ${oswald.className} text-gray-900 mb-4`}
                >
                  Order Summary
                </h2>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className={oswald.className}>Subtotal</span>
                    <span className={oswald.className}>
                      ${parseFloat(order.subtotal).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className={oswald.className}>Shipping</span>
                    <span className={oswald.className}>
                      ${parseFloat(order.shipping).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className={oswald.className}>Tax</span>
                    <span className={oswald.className}>
                      ${parseFloat(order.tax).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between pt-4 border-t border-gray-300 text-xl font-bold">
                    <span className={oswald.className}>Total</span>
                    <span className={`${oswald.className} text-green-600`}>
                      ${parseFloat(order.total).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <div className="flex items-start gap-3">
                  <Package className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3
                      className={`font-semibold ${oswald.className} text-blue-900 mb-2`}
                    >
                      Shipping Information
                    </h3>
                    <p className="text-sm text-blue-800">
                      {order.shippingFirstName} {order.shippingLastName}
                      <br />
                      {order.shippingAddress}
                      <br />
                      {order.shippingCity}, {order.shippingState}{" "}
                      {order.shippingZipCode}
                      <br />
                      {order.shippingCountry}
                    </p>
                  </div>
                </div>
              </div>

              {hasDigitalItems && (
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                  <div className="flex items-start gap-3">
                  <Truck className="w-6 h-6 text-purple-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3
                        className={`font-semibold ${oswald.className} text-purple-900 mb-2`}
                      >
                        Digital Items
                      </h3>
                      <p className="text-sm text-purple-800">
                        Your order contains digital items (E-Book or Audiobook).
                        You will receive a download link via email shortly.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t">
              <Button asChild size="lg" className="flex-1">
                <Link href="/shop/orders" className="gap-2">
                  <ShoppingBag className="w-5 h-5" />
                  View My Orders
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="flex-1">
                <Link href="/shop" className="gap-2">
                  Continue Shopping
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessPage;
