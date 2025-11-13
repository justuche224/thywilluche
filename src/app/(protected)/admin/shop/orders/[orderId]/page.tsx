import { Metadata } from "next";
import { serverAuth } from "@/lib/server-auth";
import { redirect } from "next/navigation";
import db from "@/db";
import { orders, orderItems } from "@/db/schema";
import { eq } from "drizzle-orm";
import OrderDetails from "@/components/admin/shop/orders/order-details";

export const metadata: Metadata = {
  title: "Order Details | Admin",
  description: "View and manage order details",
};

interface PageProps {
  params: Promise<{ orderId: string }>;
}

const page = async ({ params }: PageProps) => {
  const user = await serverAuth();
  if (!user || user.user.role !== "ADMIN") {
    redirect("/");
  }

  const { orderId } = await params;

  const [order] = await db
    .select()
    .from(orders)
    .where(eq(orders.id, orderId))
    .limit(1);

  if (!order) {
    redirect("/admin/shop/orders");
  }

  const items = await db
    .select()
    .from(orderItems)
    .where(eq(orderItems.orderId, order.id));

  return <OrderDetails order={order} items={items} />;
};

export default page;
