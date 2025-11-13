import { serverAuth } from "@/lib/server-auth";
import { redirect } from "next/navigation";
import { Metadata } from "next";
import db from "@/db";
import { orders, orderItems } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import SuccessPage from "@/components/shop/checkout/success";

export const metadata: Metadata = {
  title: "Order Success | Thywill Uche",
  description: "Your order has been placed successfully",
  openGraph: {
    title: "Order Success | Thywill Uche",
    description: "Your order has been placed successfully",
  },
};

interface PageProps {
  searchParams: Promise<{ orderId?: string }>;
}

const page = async ({ searchParams }: PageProps) => {
  const params = await searchParams;
  const orderId = params.orderId;

  const user = await serverAuth();
  if (!user) {
    const callbackUrl = orderId
      ? `/shop/checkout/success?orderId=${orderId}`
      : "/shop/checkout/success";
    redirect(`/auth/login?callbackUrl=${encodeURIComponent(callbackUrl)}`);
  }

  if (!orderId) {
    redirect("/shop/checkout");
  }

  const [order] = await db
    .select()
    .from(orders)
    .where(and(eq(orders.id, orderId), eq(orders.userId, user.user.id)))
    .limit(1);

  if (!order) {
    redirect("/shop/checkout");
  }

  const items = await db
    .select()
    .from(orderItems)
    .where(eq(orderItems.orderId, order.id));

  return <SuccessPage order={order} items={items} />;
};

export default page;
