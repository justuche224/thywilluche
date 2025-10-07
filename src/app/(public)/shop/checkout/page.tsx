"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useCartStore } from "@/lib/cart";
import {
  ArrowLeft,
  Lock,
  Phone,
  Mail,
  Shield,
} from "lucide-react";
import {  Oswald } from "next/font/google";
import { toast } from "sonner";
import { georgiaItalic } from "@/utils/georgia-italic";


const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
});

const CheckoutPage = () => {
  const { items, getTotalPrice, getTotalItems, clearCart } = useCartStore();
  const [isProcessing, setIsProcessing] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "United States",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardName: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      toast.success("Order placed successfully!");
      clearCart();

      setTimeout(() => {
        window.location.href = "/shop/books";
      }, 2000);
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const totalPrice = getTotalPrice();
  const totalItems = getTotalItems();

  if (items.length === 0) {
    return (
      <div className="container bg-white rounded-lg mx-auto px-4 py-10 my-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center space-y-8 py-20">
            <div className="space-y-4">
              <Shield className="w-16 h-16 mx-auto text-muted-foreground" />
              <h1
                className={`text-4xl lg:text-5xl font-bold ${georgiaItalic.className} text-gray-900`}
              >
                No Items to Checkout
              </h1>
              <p className="text-lg text-muted-foreground max-w-md mx-auto">
                Your cart is empty. Add some items before proceeding to
                checkout.
              </p>
            </div>
            <Button asChild size="lg">
              <Link href="/shop/books">Browse Books</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10 bg-white rounded-lg my-16">
      <div className="max-w-6xl mx-auto">
        <div className="space-y-12">
          <div className="flex items-center justify-between">
            <div>
              <h1
                className={`text-4xl lg:text-5xl font-bold ${georgiaItalic.className} text-gray-900`}
              >
                Checkout
              </h1>
              <p className="text-lg text-muted-foreground mt-2">
                Complete your order securely
              </p>
            </div>
            <Button variant="outline" asChild>
              <Link href="/shop/cart" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Cart
              </Link>
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-12">
              <div className="space-y-8">
                <div className="flex items-center gap-3">
                  <h2
                    className={`text-3xl font-bold ${oswald.className} text-gray-900`}
                  >
                    Contact Information
                  </h2>
                </div>

                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="firstName" className={oswald.className}>
                        First Name *
                      </Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required
                        className={oswald.className}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName" className={oswald.className}>
                        Last Name *
                      </Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        required
                        className={oswald.className}
                      />
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label
                        htmlFor="email"
                        className={`flex items-center gap-2 ${oswald.className}`}
                      >
                        <Mail className="w-4 h-4" />
                        Email Address *
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className={oswald.className}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="phone"
                        className={`flex items-center gap-2 ${oswald.className}`}
                      >
                        <Phone className="w-4 h-4" />
                        Phone Number
                      </Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className={oswald.className}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                <div className="flex items-center gap-3">
                  <h2
                    className={`text-3xl font-bold ${oswald.className} text-gray-900`}
                  >
                    Shipping Address
                  </h2>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="address" className={oswald.className}>
                      Street Address *
                    </Label>
                    <Input
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                      className={oswald.className}
                    />
                  </div>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="city" className={oswald.className}>
                        City *
                      </Label>
                      <Input
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        required
                        className={oswald.className}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state" className={oswald.className}>
                        State *
                      </Label>
                      <Input
                        id="state"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        required
                        className={oswald.className}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="zipCode" className={oswald.className}>
                        ZIP Code *
                      </Label>
                      <Input
                        id="zipCode"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleInputChange}
                        required
                        className={oswald.className}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="sticky top-4 space-y-8">
                <div className="space-y-6">
                  <h3
                    className={`text-2xl font-bold ${oswald.className} text-gray-900`}
                  >
                    Order Summary
                  </h3>

                  <div className="space-y-4">
                    {items.map((item) => (
                      <div key={item.variantId} className="flex gap-4">
                        <Image
                          src={item.image}
                          alt={`${item.bookTitle} - ${item.variantName}`}
                          width={60}
                          height={80}
                          className="rounded-md object-cover flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0 space-y-1">
                          <h4
                            className={`font-semibold ${oswald.className} text-sm truncate`}
                          >
                            {item.bookTitle}
                          </h4>
                          <p className="text-xs text-muted-foreground">
                            {item.variantName}
                          </p>
                          <p className="text-sm font-medium">
                            Qty: {item.quantity} × ${item.price.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <div className="flex justify-between text-lg">
                      <span className={oswald.className}>
                        Subtotal ({totalItems} items)
                      </span>
                      <span className={`font-semibold ${oswald.className}`}>
                        ${totalPrice.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between text-lg">
                      <span className={oswald.className}>Shipping</span>
                      <span className={`font-semibold ${oswald.className}`}>
                        Free
                      </span>
                    </div>
                    <div className="flex justify-between text-lg">
                      <span className={oswald.className}>Tax</span>
                      <span className={`font-semibold ${oswald.className}`}>
                        $0.00
                      </span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-xl font-bold">
                      <span className={oswald.className}>Total</span>
                      <span className={`text-primary ${oswald.className}`}>
                        ${totalPrice.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full gap-2"
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Lock className="w-5 h-5" />
                        Complete Order
                      </>
                    )}
                  </Button>

                  <div className="text-sm text-muted-foreground text-center space-y-2">
                    <p className={oswald.className}>
                      🔒 Secure SSL encrypted checkout
                    </p>
                    <p className={oswald.className}>
                      📦 Free shipping on all orders
                    </p>
                    <p className={oswald.className}>↩️ 30-day return policy</p>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
