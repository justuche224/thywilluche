"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCartStore } from "@/lib/cart";
import {
  Minus,
  Plus,
  Trash2,
  ShoppingBag,
  ArrowLeft,
  CreditCard,
} from "lucide-react";
import {  Oswald } from "next/font/google";
import { toast } from "sonner";
import { georgiaItalic } from "@/utils/georgia-italic";


const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
});

const CartPage = () => {
  const {
    items,
    removeItem,
    updateItemQuantity,
    clearCart,
    getTotalPrice,
    getTotalItems,
  } = useCartStore();

  const handleQuantityChange = (variantId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(variantId);
      toast.success("Item removed from cart");
    } else {
      updateItemQuantity(variantId, newQuantity);
      toast.success("Quantity updated");
    }
  };

  const handleRemoveItem = (variantId: string) => {
    removeItem(variantId);
    toast.success("Item removed from cart");
  };

  const handleClearCart = () => {
    clearCart();
    toast.success("Cart cleared");
  };

  const totalPrice = getTotalPrice();
  const totalItems = getTotalItems();

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center space-y-8 py-20">
            <div className="space-y-4">
              <ShoppingBag className="w-16 h-16 mx-auto text-muted-foreground" />
              <h1
                className={`text-4xl lg:text-5xl font-bold ${georgiaItalic.className} text-gray-900`}
              >
                Your Cart is Empty
              </h1>
              <p className="text-lg text-muted-foreground max-w-md mx-auto">
                Looks like you haven&apos;t added any items to your cart yet.
                Start exploring our collection!
              </p>
            </div>
            <div className="space-y-4">
              <Button asChild size="lg" className="gap-2">
                <Link href="/shop/books">Browse Books</Link>
              </Button>
              <div>
                <Button variant="outline" asChild>
                  <Link href="/" className="gap-2">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Home
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="max-w-6xl mx-auto">
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h1
                className={`text-4xl lg:text-5xl font-bold ${georgiaItalic.className} text-gray-900`}
              >
                Shopping Cart
              </h1>
              <p className="text-lg text-muted-foreground mt-2">
                {totalItems} {totalItems === 1 ? "item" : "items"} in your cart
              </p>
            </div>
            <Button variant="outline" asChild>
              <Link href="/shop/books" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Continue Shopping
              </Link>
            </Button>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {items.map((item) => (
                <div
                  key={item.variantId}
                  className="bg-white border rounded-lg p-6 shadow-sm"
                >
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <Image
                        src={item.image}
                        alt={`${item.bookTitle} - ${item.variantName}`}
                        width={120}
                        height={160}
                        className="rounded-md object-cover"
                      />
                    </div>
                    <div className="flex-1 space-y-4">
                      <div className="space-y-2">
                        <h3
                          className={`text-xl font-semibold ${oswald.className} text-gray-900`}
                        >
                          {item.bookTitle}
                        </h3>
                        <p className="text-muted-foreground">
                          {item.variantName}
                        </p>
                        <p className="text-2xl font-bold text-primary">
                          ${item.price.toFixed(2)}
                        </p>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 w-8 p-0"
                            onClick={() =>
                              handleQuantityChange(
                                item.variantId,
                                item.quantity - 1
                              )
                            }
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="text-lg font-medium w-8 text-center">
                            {item.quantity}
                          </span>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 w-8 p-0"
                            onClick={() =>
                              handleQuantityChange(
                                item.variantId,
                                item.quantity + 1
                              )
                            }
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="flex items-center gap-4">
                          <p className="text-lg font-semibold">
                            ${(item.price * item.quantity).toFixed(2)}
                          </p>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-destructive hover:text-destructive-foreground hover:bg-destructive"
                            onClick={() => handleRemoveItem(item.variantId)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              <div className="flex justify-end">
                <Button
                  variant="outline"
                  onClick={handleClearCart}
                  className="text-destructive hover:text-destructive-foreground hover:bg-destructive"
                >
                  Clear Cart
                </Button>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white border rounded-lg p-6 shadow-sm sticky top-4">
                <h2
                  className={`text-2xl font-bold ${oswald.className} text-gray-900 mb-6`}
                >
                  Order Summary
                </h2>

                <div className="space-y-4">
                  <div className="flex justify-between text-lg">
                    <span>Subtotal ({totalItems} items)</span>
                    <span className="font-semibold">
                      ${totalPrice.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex justify-between text-lg">
                    <span>Shipping</span>
                    <span className="font-semibold">Free</span>
                  </div>

                  <Separator />

                  <div className="flex justify-between text-xl font-bold">
                    <span>Total</span>
                    <span className="text-primary">
                      ${totalPrice.toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="space-y-4 mt-8">
                  <Button size="lg" asChild className="w-full gap-2">
                    <Link href="/shop/checkout">
                        <CreditCard className="w-5 h-5" />
                        Proceed to Checkout
                    </Link>
                  </Button>

                  <Button variant="outline" asChild className="w-full">
                    <Link href="/shop/books">Continue Shopping</Link>
                  </Button>
                </div>

                <div className="mt-6 text-sm text-muted-foreground text-center">
                  <p>Secure checkout with SSL encryption</p>
                  <p>Free shipping on all orders</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
