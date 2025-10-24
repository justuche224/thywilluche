import { sendMail } from "@/mailer";

export const sendSupportTicketNotification = async (
  adminEmail: string,
  userName: string,
  userEmail: string,
  ticketTitle: string,
  ticketDescription: string,
  ticketId: number
) => {
  try {
    const ticketUrl = `${
      process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
    }/admin/support/${ticketId}`;

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px;">
          New Support Ticket Created
        </h2>
        
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #495057; margin-top: 0;">Ticket Information</h3>
          <p><strong>Ticket ID:</strong> #${ticketId}</p>
          <p><strong>User Name:</strong> ${userName}</p>
          <p><strong>User Email:</strong> ${userEmail}</p>
          <p><strong>Subject:</strong> ${ticketTitle}</p>
        </div>

        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #495057; margin-top: 0;">Description</h3>
          <div style="background-color: white; padding: 15px; border-radius: 4px; border-left: 4px solid #007bff;">
            ${ticketDescription.replace(/\n/g, "<br>")}
          </div>
        </div>

        <div style="text-align: center; margin: 30px 0;">
          <a href="${ticketUrl}" style="display: inline-block; padding: 12px 30px; background-color: #007bff; color: white; text-decoration: none; border-radius: 4px; font-weight: bold;">
            View Ticket
          </a>
        </div>

        <div style="background-color: #e7f3ff; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0; color: #0051a5;">
            <strong>Action Required:</strong> Please review and respond to this support ticket.
          </p>
        </div>
      </div>
    `;

    const text = `
New Support Ticket Created

Ticket Information:
- Ticket ID: #${ticketId}
- User Name: ${userName}
- User Email: ${userEmail}
- Subject: ${ticketTitle}

Description:
${ticketDescription}

View Ticket: ${ticketUrl}
    `;

    await sendMail({
      to: adminEmail,
      subject: `New Support Ticket #${ticketId}: ${ticketTitle}`,
      text,
      html,
    });
  } catch (error) {
    console.error("Error sending support ticket notification:", error);
    throw new Error("Failed to send support ticket notification: " + error);
  }
};

export const sendSupportMessageNotification = async (
  recipientEmail: string,
  recipientName: string,
  senderName: string,
  message: string,
  ticketId: number
) => {
  try {
    const ticketUrl = `${
      process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
    }/support/${ticketId}`;

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px;">
          New Message on Your Support Ticket
        </h2>
        
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #495057; margin-top: 0;">Message from ${senderName}</h3>
          <div style="background-color: white; padding: 15px; border-radius: 4px; border-left: 4px solid #007bff;">
            ${message.replace(/\n/g, "<br>")}
          </div>
        </div>

        <div style="text-align: center; margin: 30px 0;">
          <a href="${ticketUrl}" style="display: inline-block; padding: 12px 30px; background-color: #007bff; color: white; text-decoration: none; border-radius: 4px; font-weight: bold;">
            View Ticket
          </a>
        </div>
      </div>
    `;

    const text = `
New Message on Your Support Ticket #${ticketId}

Message from ${senderName}:
${message}

View Ticket: ${ticketUrl}
    `;

    await sendMail({
      to: recipientEmail,
      subject: `New Message on Support Ticket #${ticketId}`,
      text,
      html,
    });
  } catch (error) {
    console.error("Error sending support message notification:", error);
    throw new Error("Failed to send support message notification: " + error);
  }
};
