import { Metadata } from "next";
import { serverAuth } from "@/lib/server-auth";
import { redirect } from "next/navigation";
import db from "@/db";
import { orders } from "@/db/schema";
import { desc } from "drizzle-orm";
import OrdersList from "@/components/admin/shop/orders/orders-list";

export const metadata: Metadata = {
  title: "Orders Management | Admin",
  description: "Manage and track all customer orders",
};

const page = async () => {
  const user = await serverAuth();
  if (!user || user.user.role !== "ADMIN") {
    redirect("/");
  }

  const allOrders = await db
    .select({
      id: orders.id,
      orderNumber: orders.orderNumber,
      status: orders.status,
      paymentStatus: orders.paymentStatus,
      total: orders.total,
      createdAt: orders.createdAt,
      shippingFirstName: orders.shippingFirstName,
      shippingLastName: orders.shippingLastName,
      shippingEmail: orders.shippingEmail,
    })
    .from(orders)
    .orderBy(desc(orders.createdAt));

  return <OrdersList orders={allOrders} />;
};

export default page;
