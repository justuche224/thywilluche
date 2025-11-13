import { serverAuth } from "@/lib/server-auth";
import { NextResponse } from "next/server";
import { z } from "zod";
import db from "@/db";
import { orders } from "@/db/schema";
import { eq } from "drizzle-orm";

const updateOrderSchema = z.object({
  status: z
    .enum([
      "Pending",
      "Processing",
      "Shipped",
      "Delivered",
      "Cancelled",
      "Refunded",
    ])
    .optional(),
  paymentStatus: z
    .enum(["Pending", "Completed", "Failed", "Refunded"])
    .optional(),
});

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const user = await serverAuth();
    if (!user || user.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { orderId } = await params;
    const body = await req.json();
    const validatedData = updateOrderSchema.parse(body);

    const [order] = await db
      .select()
      .from(orders)
      .where(eq(orders.id, orderId))
      .limit(1);

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const updateData: Partial<typeof order> = {};
    if (validatedData.status) {
      updateData.status = validatedData.status as any;
    }
    if (validatedData.paymentStatus) {
      updateData.paymentStatus = validatedData.paymentStatus as any;
    }

    await db.update(orders).set(updateData).where(eq(orders.id, orderId));

    const [updatedOrder] = await db
      .select()
      .from(orders)
      .where(eq(orders.id, orderId))
      .limit(1);

    return NextResponse.json({ order: updatedOrder });
  } catch (error) {
    console.error("Error updating order:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", details: error.message },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
