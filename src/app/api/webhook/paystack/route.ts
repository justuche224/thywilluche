import db from "@/db";
import { orders, orderItems, fulfillmentQueue } from "@/db/schema";
import { eq, inArray } from "drizzle-orm";
import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { sendPaymentSuccessEmail } from "@/mailer/handlers/shop/payment-success";
import { sendPaymentSuccessAdminNotification } from "@/mailer/handlers/shop/payment-success-admin";
import { sendPaymentFailedEmail } from "@/mailer/handlers/shop/payment-failed";
import { sendPaymentFailedAdminNotification } from "@/mailer/handlers/shop/payment-failed-admin";

export async function POST(req: NextRequest) {
  console.log("POST /api/webhook/paystack");

  const body = await req.json();

  const signature = req.headers.get("x-paystack-signature");
  const secretKey = process.env.PAYSTACK_SECRET_KEY!;
  const hash = crypto
    .createHmac("sha512", secretKey)
    .update(JSON.stringify(body))
    .digest("hex");

  if (hash == signature) {
    console.log("Signature verified");
    const event = body;
    switch (event.event) {
      case "charge.success": {
        const reference = event.data.reference;

        const [order] = await db
          .select()
          .from(orders)
          .where(eq(orders.paymentReference, reference))
          .limit(1);

        if (!order) {
          console.log("Order not found for reference:", reference);
          return NextResponse.json(
            { success: false, error: "Order not found" },
            { status: 404 }
          );
        }

        const isAlreadyCompleted = order.paymentStatus === "Completed";

        if (!isAlreadyCompleted) {
          await db
            .update(orders)
            .set({
              paymentStatus: "Completed",
              status: "Processing",
              transactionId: event.data.id?.toString(),
            })
            .where(eq(orders.paymentReference, reference));
          console.log("Order status updated to Completed");
        } else {
          console.log("Order already processed, skipping status update");
        }

        const items = await db
          .select()
          .from(orderItems)
          .where(eq(orderItems.orderId, order.id));

        const orderItemIds = items
          .filter(
            (item) =>
              item.itemType === "book" &&
              (item.variantName === "E-Book" ||
                item.variantName === "Audiobook")
          )
          .map((item) => item.id);

        let existingOrderItemIds = new Set<string>();
        if (orderItemIds.length > 0) {
          const existingQueueItems = await db
            .select()
            .from(fulfillmentQueue)
            .where(inArray(fulfillmentQueue.orderItemId, orderItemIds));

          existingOrderItemIds = new Set(
            existingQueueItems.map((q) => q.orderItemId)
          );
        }

        let queueItemsAdded = 0;
        for (const item of items) {
          if (
            item.itemType === "book" &&
            (item.variantName === "E-Book" ||
              item.variantName === "Audiobook") &&
            !existingOrderItemIds.has(item.id)
          ) {
            await db.insert(fulfillmentQueue).values({
              orderItemId: item.id,
              email: order.shippingEmail,
              status: "Pending",
            });
            queueItemsAdded++;
          }
        }

        console.log(
          `Payment successful. Order ${
            isAlreadyCompleted ? "already processed" : "updated"
          }. ${queueItemsAdded} fulfillment queue item(s) ${
            queueItemsAdded > 0 ? "added" : "already exist"
          }.`
        );

        const customerName = `${order.shippingFirstName} ${order.shippingLastName}`;
        const paymentSuccessData = {
          orderNumber: order.orderNumber,
          orderId: order.id,
          customerName,
          customerEmail: order.shippingEmail,
          items: items.map((item) => ({
            variantName: item.variantName,
            quantity: item.quantity,
            price: item.price,
            itemType: item.itemType,
          })),
          subtotal: order.subtotal,
          shipping: order.shipping,
          tax: order.tax,
          total: order.total,
          transactionId: event.data.id?.toString(),
        };

        sendPaymentSuccessEmail(paymentSuccessData).catch((error) => {
          console.error("Failed to send payment success email:", error);
        });

        sendPaymentSuccessAdminNotification(paymentSuccessData).catch(
          (error) => {
            console.error(
              "Failed to send payment success admin notification:",
              error
            );
          }
        );

        break;
      }
      case "charge.fail": {
        const reference = event.data.reference;

        const [order] = await db
          .select()
          .from(orders)
          .where(eq(orders.paymentReference, reference))
          .limit(1);

        if (order) {
          await db
            .update(orders)
            .set({ paymentStatus: "Failed" })
            .where(eq(orders.paymentReference, reference));

          const items = await db
            .select()
            .from(orderItems)
            .where(eq(orderItems.orderId, order.id));

          const customerName = `${order.shippingFirstName} ${order.shippingLastName}`;
          const paymentFailedData = {
            orderNumber: order.orderNumber,
            orderId: order.id,
            customerName,
            customerEmail: order.shippingEmail,
            items: items.map((item) => ({
              variantName: item.variantName,
              quantity: item.quantity,
              price: item.price,
              itemType: item.itemType,
            })),
            subtotal: order.subtotal,
            shipping: order.shipping,
            tax: order.tax,
            total: order.total,
            reason: event.data.gateway_response || undefined,
          };

          sendPaymentFailedEmail(paymentFailedData).catch((error) => {
            console.error("Failed to send payment failed email:", error);
          });

          sendPaymentFailedAdminNotification(paymentFailedData).catch(
            (error) => {
              console.error(
                "Failed to send payment failed admin notification:",
                error
              );
            }
          );
        }

        console.log("Payment failed");
        break;
      }
      default:
        console.log("Unhandled event:", event.event);
    }
  }

  return NextResponse.json({ success: true }, { status: 200 });
}
