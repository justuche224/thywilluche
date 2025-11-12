import { sendMail } from "@/mailer";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://thewilluche.com";

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

export const sendPaymentFailedEmail = async (data: PaymentFailedData) => {
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
      to: data.customerEmail,
      subject: `Payment Failed - Order ${data.orderNumber}`,
      text: `
Payment Failed

Hi ${data.customerName},

Unfortunately, your payment for order ${
        data.orderNumber
      } could not be processed.

Order Number: ${data.orderNumber}
Payment Status: Failed

Order Items:
${itemsList}

Order Summary:
Subtotal: $${parseFloat(data.subtotal).toFixed(2)}
Shipping: $${parseFloat(data.shipping).toFixed(2)}
Tax: $${parseFloat(data.tax).toFixed(2)}
Total: $${parseFloat(data.total).toFixed(2)}

${
  data.reason ? `Reason: ${data.reason}\n\n` : ""
}Your order has been placed on hold. To complete your purchase, please try again with a different payment method.

You can retry payment by visiting your order page: ${baseUrl}/shop/orders

If you continue to experience issues, please contact us at support@thywilluche.com and we'll be happy to help.

Best regards,
Team Thywill
      `.trim(),
      html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2 style="color: #333; border-bottom: 2px solid #dc3545; padding-bottom: 10px;">
        Payment Failed
      </h2>
      
      <p>Hi ${data.customerName},</p>
      
      <p>Unfortunately, your payment for order <strong>${
        data.orderNumber
      }</strong> could not be processed.</p>

      <div style="background-color: #f8d7da; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #dc3545;">
        <p style="margin: 0; color: #721c24;">
          <strong>⚠ Payment Status: Failed</strong><br>
          Your order has been placed on hold. Please try again with a different payment method.
        </p>
      </div>

      <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="color: #495057; margin-top: 0;">Order Information</h3>
        <p><strong>Order Number:</strong> ${data.orderNumber}</p>
        <p><strong>Payment Status:</strong> <span style="color: #dc3545; font-weight: bold;">Failed</span></p>
        ${data.reason ? `<p><strong>Reason:</strong> ${data.reason}</p>` : ""}
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

      <div style="background-color: #fff3cd; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ffc107;">
        <p style="margin: 0; color: #856404;">
          <strong>Next Steps:</strong> To complete your purchase, please try again with a different payment method. Your order will remain on hold until payment is successful.
        </p>
      </div>

      <div style="text-align: center; margin: 30px 0;">
        <a href="${baseUrl}/shop/orders" style="display: inline-block; background-color: #dc3545; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">
          View Your Orders
        </a>
      </div>

      <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
      <p style="color: #666; font-size: 14px;">
        If you continue to experience issues, please contact us at <a href="mailto:support@thywilluche.com">support@thywilluche.com</a> and we'll be happy to help.
      </p>
      <p style="color: #666; font-size: 14px;">
        Best regards,<br>
        Team Thywill
      </p>
    </div>
      `.trim(),
    });

    console.log(`Payment failed email sent to ${data.customerEmail}`);
  } catch (error) {
    console.error("Failed to send payment failed email:", error);
  }
};
