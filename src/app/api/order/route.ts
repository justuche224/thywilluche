import { serverAuth } from "@/lib/server-auth";
import { NextResponse } from "next/server";
import { z } from "zod";
import db from "@/db";
import { orders, orderItems } from "@/db/schema";
import { eq } from "drizzle-orm";
import { sendOrderConfirmationEmail } from "@/mailer/handlers/shop/order-confirmation";
import { sendOrderAdminNotification } from "@/mailer/handlers/shop/order-admin-notification";

const cartItemSchema = z.object({
  variantId: z.string(),
  type: z.enum(["book", "merch"]),
  bookId: z.string().optional(),
  merchId: z.string().optional(),
  variantName: z.string(),
  price: z.number().positive(),
  quantity: z.number().int().positive(),
});

const schema = z.object({
  items: z.array(cartItemSchema).min(1),
  shippingInfo: z.object({
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    email: z.email(),
    phone: z.string().optional(),
    address: z.string().min(1),
    city: z.string().min(1),
    state: z.string().min(1),
    zipCode: z.string().min(1),
    country: z.string().min(1),
  }),
  subtotal: z.number().nonnegative(),
  shippingCost: z.number().nonnegative(),
  tax: z.number().nonnegative(),
  total: z.number().positive(),
});

function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `ORD-${timestamp}-${random}`;
}

export async function POST(req: Request) {
  try {
    const user = await serverAuth();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const validatedData = schema.safeParse(body);
    if (!validatedData.success) {
      return new NextResponse(
        JSON.stringify({ errors: validatedData.error.message }),
        { status: 400 }
      );
    }

    const orderNumber = generateOrderNumber();
    const orderId = crypto.randomUUID();
    const amountInKobo = Math.round(validatedData.data.total * 100);

    const paystackParams = {
      email: validatedData.data.shippingInfo.email,
      amount: amountInKobo,
      reference: orderNumber,
      callback_url: `${
        process.env.NEXT_PUBLIC_APP_URL || "https://thewilluche.com"
      }/api/order/confirmation?orderId=${orderId}`,
      metadata: {
        customerId: user.user.id,
        orderId: orderId,
        orderNumber: orderNumber,
      },
    };

    const paystackResponse = await fetch(
      "https://api.paystack.co/transaction/initialize",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(paystackParams),
      }
    );

    const responseData = await paystackResponse.json();

    if (!responseData.status || !responseData.data?.authorization_url) {
      return NextResponse.json(
        {
          error: "Failed to initialize payment",
          details: responseData.message,
        },
        { status: 400 }
      );
    }

    const paymentReference = responseData.data.reference;

    await db.transaction(async (tx) => {
      const [order] = await tx
        .insert(orders)
        .values({
          id: orderId,
          userId: user.user.id,
          orderNumber,
          status: "Pending",
          subtotal: validatedData.data.subtotal.toString(),
          shipping: validatedData.data.shippingCost.toString(),
          tax: validatedData.data.tax.toString(),
          total: validatedData.data.total.toString(),
          shippingFirstName: validatedData.data.shippingInfo.firstName,
          shippingLastName: validatedData.data.shippingInfo.lastName,
          shippingEmail: validatedData.data.shippingInfo.email,
          shippingPhone: validatedData.data.shippingInfo.phone,
          shippingAddress: validatedData.data.shippingInfo.address,
          shippingCity: validatedData.data.shippingInfo.city,
          shippingState: validatedData.data.shippingInfo.state,
          shippingZipCode: validatedData.data.shippingInfo.zipCode,
          shippingCountry: validatedData.data.shippingInfo.country,
          paymentMethod: "paystack",
          paymentStatus: "Pending",
          paymentReference: paymentReference,
        })
        .returning();

      const itemsToInsert = validatedData.data.items.map((item) => ({
        orderId: order.id,
        itemType: item.type,
        bookVariantId: item.type === "book" ? item.variantId : null,
        merchVariantId: item.type === "merch" ? item.variantId : null,
        variantName: item.variantName,
        quantity: item.quantity,
        price: item.price.toString(),
      }));

      await tx.insert(orderItems).values(itemsToInsert);
    });

    const orderData = {
      orderNumber,
      orderId,
      customerName: `${validatedData.data.shippingInfo.firstName} ${validatedData.data.shippingInfo.lastName}`,
      customerEmail: validatedData.data.shippingInfo.email,
      items: validatedData.data.items.map((item) => ({
        variantName: item.variantName,
        quantity: item.quantity,
        price: item.price.toString(),
        itemType: item.type,
      })),
      subtotal: validatedData.data.subtotal.toString(),
      shipping: validatedData.data.shippingCost.toString(),
      tax: validatedData.data.tax.toString(),
      total: validatedData.data.total.toString(),
      shippingAddress: {
        firstName: validatedData.data.shippingInfo.firstName,
        lastName: validatedData.data.shippingInfo.lastName,
        address: validatedData.data.shippingInfo.address,
        city: validatedData.data.shippingInfo.city,
        state: validatedData.data.shippingInfo.state,
        zipCode: validatedData.data.shippingInfo.zipCode,
        country: validatedData.data.shippingInfo.country,
        phone: validatedData.data.shippingInfo.phone,
      },
    };

    sendOrderConfirmationEmail(orderData).catch((error) => {
      console.error("Failed to send order confirmation email:", error);
    });

    sendOrderAdminNotification(orderData).catch((error) => {
      console.error("Failed to send admin notification email:", error);
    });

    return NextResponse.json({
      orderId: orderId,
      orderNumber: orderNumber,
      authorization_url: responseData.data.authorization_url,
    });
  } catch (error) {
    console.error("Order creation error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
