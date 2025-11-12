import { sendMail } from "@/mailer";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://thewilluche.com";

interface OrderItem {
  variantName: string;
  quantity: number;
  price: string;
  itemType: "book" | "merch";
}

interface PaymentSuccessData {
  orderNumber: string;
  orderId: string;
  customerName: string;
  customerEmail: string;
  items: OrderItem[];
  subtotal: string;
  shipping: string;
  tax: string;
  total: string;
  transactionId?: string;
}

export const sendPaymentSuccessEmail = async (data: PaymentSuccessData) => {
  try {
    const hasDigitalItems = data.items.some(
      (item) =>
        item.itemType === "book" &&
        (item.variantName === "E-Book" || item.variantName === "Audiobook")
    );

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
      to: data.customerEmail,
      subject: `Payment Successful - Order ${data.orderNumber}`,
      text: `
Payment Successful!

Hi ${data.customerName},

Great news! Your payment for order ${
        data.orderNumber
      } has been successfully processed.

Order Number: ${data.orderNumber}
Payment Date: ${new Date().toLocaleDateString()}
Payment Status: Completed

Order Items:
${itemsList}

Order Summary:
Subtotal: $${parseFloat(data.subtotal).toFixed(2)}
Shipping: $${parseFloat(data.shipping).toFixed(2)}
Tax: $${parseFloat(data.tax).toFixed(2)}
Total: $${parseFloat(data.total).toFixed(2)}

${
  hasDigitalItems
    ? "If your order contains digital items (E-Book or Audiobook), you will receive a download link via email shortly.\n\n"
    : ""
}Your order is now being processed and will be shipped soon. You will receive a shipping confirmation email once your order has been dispatched.

View your order: ${baseUrl}/shop/orders

If you have any questions, please contact us at support@thywilluche.com.

Best regards,
Team Thywill
      `.trim(),
      html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2 style="color: #333; border-bottom: 2px solid #28a745; padding-bottom: 10px;">
        Payment Successful!
      </h2>
      
      <p>Hi ${data.customerName},</p>
      
      <p>Great news! Your payment for order <strong>${
        data.orderNumber
      }</strong> has been successfully processed.</p>

      <div style="background-color: #d4edda; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #28a745;">
        <p style="margin: 0; color: #155724;">
          <strong>✓ Payment Status: Completed</strong><br>
          Your order is now being processed and will be shipped soon.
        </p>
      </div>

      <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="color: #495057; margin-top: 0;">Order Information</h3>
        <p><strong>Order Number:</strong> ${data.orderNumber}</p>
        <p><strong>Payment Date:</strong> ${new Date().toLocaleDateString()}</p>
        ${
          data.transactionId
            ? `<p><strong>Transaction ID:</strong> ${data.transactionId}</p>`
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
            <td style="padding: 10px 0; text-align: right; color: #28a745;">$${parseFloat(
              data.total
            ).toFixed(2)}</td>
          </tr>
        </table>
      </div>

      ${
        hasDigitalItems
          ? `
      <div style="background-color: #d1ecf1; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #007bff;">
        <p style="margin: 0; color: #0c5460;">
          <strong>📥 Digital Items:</strong> If your order contains digital items (E-Book or Audiobook), you will receive a download link via email shortly.
        </p>
      </div>
      `
          : ""
      }

      <div style="background-color: #d1ecf1; padding: 15px; border-radius: 8px; margin: 20px 0;">
        <p style="margin: 0; color: #0c5460;">
          You will receive a shipping confirmation email once your order has been dispatched.
        </p>
      </div>

      <div style="text-align: center; margin: 30px 0;">
        <a href="${baseUrl}/shop/orders" style="display: inline-block; background-color: #28a745; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">
          View Your Orders
        </a>
      </div>

      <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
      <p style="color: #666; font-size: 14px;">
        If you have any questions, please contact us at <a href="mailto:support@thywilluche.com">support@thywilluche.com</a>.
      </p>
      <p style="color: #666; font-size: 14px;">
        Best regards,<br>
        Team Thywill
      </p>
    </div>
      `.trim(),
    });

    console.log(`Payment success email sent to ${data.customerEmail}`);
  } catch (error) {
    console.error("Failed to send payment success email:", error);
  }
};
