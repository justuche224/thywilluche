import db from "@/db";
import { orders } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  console.log("GET /api/order/confirmation");
  const { searchParams } = new URL(req.url);
  const reference = searchParams.get("reference");
  const orderId = searchParams.get("orderId");

  if (!reference && !orderId) {
    return NextResponse.json(
      { error: "Missing reference or orderId" },
      { status: 400 }
    );
  }

  const secretKey = process.env.PAYSTACK_SECRET_KEY;
  if (!secretKey) {
    return NextResponse.json(
      { error: "Payment configuration error" },
      { status: 500 }
    );
  }

  try {
    let order;
    let paymentReference = reference;

    if (orderId) {
      const [foundOrder] = await db
        .select()
        .from(orders)
        .where(eq(orders.id, orderId))
        .limit(1);

      if (!foundOrder) {
        return NextResponse.json({ error: "Order not found" }, { status: 404 });
      }

      order = foundOrder;
      paymentReference = paymentReference || order.paymentReference;
    }

    if (!paymentReference) {
      return NextResponse.json(
        { error: "Payment reference not found" },
        { status: 400 }
      );
    }

    const verifyUrl = `https://api.paystack.co/transaction/verify/${paymentReference}`;

    const response = await fetch(verifyUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${secretKey}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (data.status && data.data?.status === "success") {
      if (order && order.paymentStatus !== "Completed") {
        await db
          .update(orders)
          .set({
            paymentStatus: "Completed",
            status: "Processing",
            transactionId: data.data.id?.toString(),
          })
          .where(eq(orders.id, order.id));
        console.log("Order status updated to Completed");
      } else if (order && order.paymentStatus === "Completed") {
        console.log("Order already processed, skipping update");
      }

      const redirectOrderId = orderId || order?.id;
      const baseUrl =
        process.env.NEXT_PUBLIC_APP_URL || "https://thewilluche.com";

      console.log("Payment verified successfully");
      return NextResponse.redirect(
        `${baseUrl}/shop/checkout/success?orderId=${redirectOrderId}`
      );
    } else {
      const redirectOrderId = orderId || order?.id;
      const baseUrl =
        process.env.NEXT_PUBLIC_APP_URL || "https://thewilluche.com";

      return NextResponse.redirect(
        `${baseUrl}/shop/checkout/failed?orderId=${redirectOrderId}`
      );
    }
  } catch (error) {
    console.error("Error verifying payment:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
