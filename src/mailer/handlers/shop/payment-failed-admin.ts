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

interface PaymentFailedData {
  orderNumber: string;
  orderId: string;
  customerName: string;
  customerEmail: string;
  items: OrderItem[];
  subtotal: string;
  shipping: string;
  tax: string;
  total: string;
  reason?: string;
}

export const sendPaymentFailedAdminNotification = async (
  data: PaymentFailedData
) => {
  try {
    const itemsList = data.items
      .map(
        (item) =>
          `- ${item.variantName} (${
            item.itemType === "book" ? "Book" : "Merch"
          }) x ${item.quantity} - $${parseFloat(item.price).toFixed(2)}`
      )
      .join("\n");

    const itemsListHtml = data.items
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

    await sendMail({
      to: adminEmail,
      subject: `Payment Failed - Order ${data.orderNumber}`,
      text: `
Payment Failed

Order Number: ${data.orderNumber}
Order ID: ${data.orderId}
Payment Date: ${new Date().toLocaleDateString()}
Payment Status: Failed

Customer Information:
Name: ${data.customerName}
Email: ${data.customerEmail}

Order Items:
${itemsList}

Order Summary:
Subtotal: $${parseFloat(data.subtotal).toFixed(2)}
Shipping: $${parseFloat(data.shipping).toFixed(2)}
Tax: $${parseFloat(data.tax).toFixed(2)}
Total: $${parseFloat(data.total).toFixed(2)}

${data.reason ? `Reason: ${data.reason}\n\n` : ""}Payment Status: Failed

View order: ${baseUrl}/admin/shop/orders
      `.trim(),
      html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2 style="color: #333; border-bottom: 2px solid #dc3545; padding-bottom: 10px;">
        Payment Failed
      </h2>

      <div style="background-color: #f8d7da; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #dc3545;">
        <p style="margin: 0; color: #721c24;">
          <strong>⚠ Payment Status: Failed</strong><br>
          Payment could not be processed for this order. The order is on hold.
        </p>
      </div>

      <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="color: #495057; margin-top: 0;">Order Information</h3>
        <p><strong>Order Number:</strong> ${data.orderNumber}</p>
        <p><strong>Order ID:</strong> ${data.orderId}</p>
        <p><strong>Payment Date:</strong> ${new Date().toLocaleDateString()}</p>
        <p><strong>Payment Status:</strong> <span style="color: #dc3545; font-weight: bold;">Failed</span></p>
        ${data.reason ? `<p><strong>Reason:</strong> ${data.reason}</p>` : ""}
      </div>

      <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="color: #495057; margin-top: 0;">Customer Information</h3>
        <p><strong>Name:</strong> ${data.customerName}</p>
        <p><strong>Email:</strong> <a href="mailto:${data.customerEmail}">${
        data.customerEmail
      }</a></p>
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
              data.subtotal
            ).toFixed(2)}</td>
          </tr>
          <tr>
            <td style="padding: 5px 0;">Shipping:</td>
            <td style="padding: 5px 0; text-align: right;">$${parseFloat(
              data.shipping
            ).toFixed(2)}</td>
          </tr>
          <tr>
            <td style="padding: 5px 0;">Tax:</td>
            <td style="padding: 5px 0; text-align: right;">$${parseFloat(
              data.tax
            ).toFixed(2)}</td>
          </tr>
          <tr style="border-top: 2px solid #dee2e6; font-weight: bold; font-size: 18px;">
            <td style="padding: 10px 0;">Total:</td>
            <td style="padding: 10px 0; text-align: right; color: #dc3545;">$${parseFloat(
              data.total
            ).toFixed(2)}</td>
          </tr>
        </table>
      </div>

      <div style="text-align: center; margin: 30px 0;">
        <a href="${baseUrl}/admin/shop/orders" style="display: inline-block; background-color: #dc3545; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">
          View Order in Admin Panel
        </a>
      </div>
    </div>
      `.trim(),
    });

    console.log(`Payment failed admin notification sent to ${adminEmail}`);
  } catch (error) {
    console.error("Failed to send payment failed admin notification:", error);
  }
};
