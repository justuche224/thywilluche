import { Metadata } from "next";
import { redirect } from "next/navigation";
import db from "@/db";
import { orders } from "@/db/schema";
import { desc } from "drizzle-orm";
import OrdersList from "@/components/admin/shop/orders/orders-list";
import { requireAdmin } from "@/lib/server-auth";

export const metadata: Metadata = {
  title: "Orders Management | Admin",
  description: "Manage and track all customer orders",
};

const page = async () => {
  const isAdmin = await requireAdmin();

  if (!isAdmin) {
    return redirect("/");
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
