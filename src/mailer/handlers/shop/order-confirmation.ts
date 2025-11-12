import { sendMail } from "@/mailer";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://thewilluche.com";

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

export const sendOrderConfirmationEmail = async (orderData: OrderData) => {
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
      to: orderData.customerEmail,
      subject: `Order Confirmation - ${orderData.orderNumber}`,
      text: `
Thank you for your order!

Hi ${orderData.customerName},

We've received your order and it's being processed. Your order details are below:

Order Number: ${orderData.orderNumber}
Order Date: ${new Date().toLocaleDateString()}
Payment Status: Pending

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
${
  orderData.shippingAddress.phone
    ? `Phone: ${orderData.shippingAddress.phone}`
    : ""
}

Payment Status: Pending
Please complete your payment to proceed with order processing.

View your order: ${baseUrl}/shop/orders

If you have any questions, please contact us at support@thywilluche.com.

Best regards,
Team Thywill
      `.trim(),
      html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2 style="color: #333; border-bottom: 2px solid #800000; padding-bottom: 10px;">
        Thank you for your order!
      </h2>
      
      <p>Hi ${orderData.customerName},</p>
      
      <p>We've received your order and it's being processed. Your order details are below:</p>

      <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="color: #495057; margin-top: 0;">Order Information</h3>
        <p><strong>Order Number:</strong> ${orderData.orderNumber}</p>
        <p><strong>Order Date:</strong> ${new Date().toLocaleDateString()}</p>
        <p><strong>Payment Status:</strong> <span style="color: #ffc107; font-weight: bold;">Pending</span></p>
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
          ${
            orderData.shippingAddress.phone
              ? `<br>Phone: ${orderData.shippingAddress.phone}`
              : ""
          }
        </p>
      </div>

      <div style="background-color: #fff3cd; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ffc107;">
        <p style="margin: 0; color: #856404;">
          <strong>Payment Status: Pending</strong><br>
          Please complete your payment to proceed with order processing.
        </p>
      </div>

      <div style="text-align: center; margin: 30px 0;">
        <a href="${baseUrl}/shop/orders" style="display: inline-block; background-color: #800000; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">
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

    console.log(`Order confirmation email sent to ${orderData.customerEmail}`);
  } catch (error) {
    console.error("Failed to send order confirmation email:", error);
  }
};
