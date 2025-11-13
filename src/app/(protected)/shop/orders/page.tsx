import { serverAuth } from "@/lib/server-auth";
import { redirect } from "next/navigation";
import { Metadata } from "next";
import db from "@/db";
import { orders } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import OrdersList from "@/components/shop/orders/orders-list";
import { Button } from "@/components/ui/button";
import { MessageCircle, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { georgiaItalic } from "@/utils/georgia-italic";
import { Oswald } from "next/font/google";

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "My Orders | Thywill Uche",
  description: "View your order history",
  openGraph: {
    title: "My Orders | Thywill Uche",
    description: "View your order history",
  },
};

const page = async () => {
  const user = await serverAuth();
  if (!user) {
    redirect("/auth/login?callbackUrl=/shop/orders");
  }

  const userOrders = await db
    .select()
    .from(orders)
    .where(eq(orders.userId, user.user.id))
    .orderBy(desc(orders.createdAt));

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1
            className={`text-4xl lg:text-5xl font-bold ${georgiaItalic.className} text-gray-900 mb-2`}
          >
            My Orders
          </h1>
          <p className="text-lg text-muted-foreground">
            View and manage your order history
          </p>
        </div>

        {userOrders.length > 0 && (
          <div className="mb-6 flex flex-col sm:flex-row gap-4">
            <Button asChild variant="outline" className="flex-1">
              <Link href="/shop" className="gap-2">
                <ShoppingBag className="w-4 h-4" />
                Continue Shopping
              </Link>
            </Button>
            <Button asChild className="flex-1">
              <Link href="/support" className="gap-2">
                <MessageCircle className="w-4 h-4" />
                Contact Support
              </Link>
            </Button>
          </div>
        )}

        <OrdersList orders={userOrders} />
      </div>
    </div>
  );
};

export default page;
