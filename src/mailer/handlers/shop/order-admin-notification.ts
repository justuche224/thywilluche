import { sendMail } from "@/mailer";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://thewilluche.com";
const adminEmail =
  process.env.ADMIN_EMAIL ||
  process.env.CONTACT_EMAIL ||
  "admin@thywilluche.com";

interface OrderItem {
  variantName: string;
  quantity: number;
  price: string;
  itemType: "book" | "merch";
}

interface OrderData {
  orderNumber: string;
  orderId: string;
  customerName: string;
  customerEmail: string;
  items: OrderItem[];
  subtotal: string;
  shipping: string;
  tax: string;
  total: string;
  shippingAddress: {
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    phone?: string | null;
  };
}

export const sendOrderAdminNotification = async (orderData: OrderData) => {
  try {
    const itemsList = orderData.items
      .map(
        (item) =>
          `- ${item.variantName} (${
            item.itemType === "book" ? "Book" : "Merch"
          }) × ${item.quantity} - $${parseFloat(item.price).toFixed(2)}`
      )
      .join("\n");

    const itemsListHtml = orderData.items
      .map(
        (item) => `
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">
            ${item.variantName} <span style="color: #666; font-size: 12px;">(${
          item.itemType === "book" ? "Book" : "Merch"
        })</span>
          </td>
          <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">
            ${item.quantity}
          </td>
          <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">
            $${parseFloat(item.price).toFixed(2)}
          </td>
        </tr>
      `
      )
      .join("");

    const fullName = `${orderData.shippingAddress.firstName} ${orderData.shippingAddress.lastName}`;
    const shippingAddress = `${orderData.shippingAddress.address}, ${orderData.shippingAddress.city}, ${orderData.shippingAddress.state} ${orderData.shippingAddress.zipCode}, ${orderData.shippingAddress.country}`;

    await sendMail({
      to: adminEmail,
      subject: `New Order Received - ${orderData.orderNumber}`,
      text: `
New Order Received

Order Number: ${orderData.orderNumber}
Order ID: ${orderData.orderId}
Order Date: ${new Date().toLocaleDateString()}
Payment Status: Pending

Customer Information:
Name: ${orderData.customerName}
Email: ${orderData.customerEmail}
${
  orderData.shippingAddress.phone
    ? `Phone: ${orderData.shippingAddress.phone}`
    : ""
}

Order Items:
${itemsList}

Order Summary:
Subtotal: $${parseFloat(orderData.subtotal).toFixed(2)}
Shipping: $${parseFloat(orderData.shipping).toFixed(2)}
Tax: $${parseFloat(orderData.tax).toFixed(2)}
Total: $${parseFloat(orderData.total).toFixed(2)}

Shipping Address:
${fullName}
${shippingAddress}

Payment Status: Pending

View order: ${baseUrl}/admin/shop/orders
      `.trim(),
      html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2 style="color: #333; border-bottom: 2px solid #800000; padding-bottom: 10px;">
        New Order Received
      </h2>

      <div style="background-color: #d1ecf1; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #0c5460;">
        <p style="margin: 0; color: #0c5460;">
          <strong>Action Required:</strong> A new order has been placed and is awaiting payment confirmation.
        </p>
      </div>

      <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="color: #495057; margin-top: 0;">Order Information</h3>
        <p><strong>Order Number:</strong> ${orderData.orderNumber}</p>
        <p><strong>Order ID:</strong> ${orderData.orderId}</p>
        <p><strong>Order Date:</strong> ${new Date().toLocaleDateString()}</p>
        <p><strong>Payment Status:</strong> <span style="color: #ffc107; font-weight: bold;">Pending</span></p>
      </div>

      <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="color: #495057; margin-top: 0;">Customer Information</h3>
        <p><strong>Name:</strong> ${orderData.customerName}</p>
        <p><strong>Email:</strong> <a href="mailto:${
          orderData.customerEmail
        }">${orderData.customerEmail}</a></p>
        ${
          orderData.shippingAddress.phone
            ? `<p><strong>Phone:</strong> ${orderData.shippingAddress.phone}</p>`
            : ""
        }
      </div>

      <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="color: #495057; margin-top: 0;">Order Items</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="background-color: #e9ecef;">
              <th style="padding: 10px; text-align: left; border-bottom: 2px solid #dee2e6;">Item</th>
              <th style="padding: 10px; text-align: center; border-bottom: 2px solid #dee2e6;">Qty</th>
              <th style="padding: 10px; text-align: right; border-bottom: 2px solid #dee2e6;">Price</th>
            </tr>
          </thead>
          <tbody>
            ${itemsListHtml}
          </tbody>
        </table>
      </div>

      <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="color: #495057; margin-top: 0;">Order Summary</h3>
        <table style="width: 100%;">
          <tr>
            <td style="padding: 5px 0;">Subtotal:</td>
            <td style="padding: 5px 0; text-align: right;">$${parseFloat(
              orderData.subtotal
            ).toFixed(2)}</td>
          </tr>
          <tr>
            <td style="padding: 5px 0;">Shipping:</td>
            <td style="padding: 5px 0; text-align: right;">$${parseFloat(
              orderData.shipping
            ).toFixed(2)}</td>
          </tr>
          <tr>
            <td style="padding: 5px 0;">Tax:</td>
            <td style="padding: 5px 0; text-align: right;">$${parseFloat(
              orderData.tax
            ).toFixed(2)}</td>
          </tr>
          <tr style="border-top: 2px solid #dee2e6; font-weight: bold; font-size: 18px;">
            <td style="padding: 10px 0;">Total:</td>
            <td style="padding: 10px 0; text-align: right; color: #800000;">$${parseFloat(
              orderData.total
            ).toFixed(2)}</td>
          </tr>
        </table>
      </div>

      <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="color: #495057; margin-top: 0;">Shipping Address</h3>
        <p>
          ${fullName}<br>
          ${shippingAddress}
        </p>
      </div>

      <div style="text-align: center; margin: 30px 0;">
        <a href="${baseUrl}/admin/shop/orders" style="display: inline-block; background-color: #800000; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">
          View Order in Admin Panel
        </a>
      </div>
    </div>
      `.trim(),
    });

    console.log(`Order admin notification sent to ${adminEmail}`);
  } catch (error) {
    console.error("Failed to send order admin notification:", error);
  }
};
