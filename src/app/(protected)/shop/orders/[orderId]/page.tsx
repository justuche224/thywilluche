import { serverAuth } from "@/lib/server-auth";
import { redirect } from "next/navigation";
import { Metadata } from "next";
import db from "@/db";
import { orders, orderItems } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import OrderDetails from "@/components/shop/orders/order-details";

export const metadata: Metadata = {
  title: "Order Details | Thywill Uche",
  description: "View your order details",
  openGraph: {
    title: "Order Details | Thywill Uche",
    description: "View your order details",
  },
};

interface PageProps {
  params: Promise<{ orderId: string }>;
}

const page = async ({ params }: PageProps) => {
  const user = await serverAuth();
  if (!user) {
    redirect("/auth/login?callbackUrl=/shop/orders");
  }

  const { orderId } = await params;

  const [order] = await db
    .select()
    .from(orders)
    .where(and(eq(orders.id, orderId), eq(orders.userId, user.user.id)))
    .limit(1);

  if (!order) {
    redirect("/shop/orders");
  }

  const items = await db
    .select()
    .from(orderItems)
    .where(eq(orderItems.orderId, order.id));

  return <OrderDetails order={order} items={items} />;
};

export default page;
