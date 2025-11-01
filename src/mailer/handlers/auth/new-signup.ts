import { sendMail } from "@/mailer";

const adminEmail = process.env.NOTIFICATION_EMAIL || "support@thywilluche.com";

export const notifyAdminNewSignup = async (
  email: string,
  name: string | null,
  username: string | null,
  userId: string,
  createdAt: Date
) => {
  try {
    const displayName = name || "Unknown";
    const displayUsername = username ? `@${username}` : "No username";

    await sendMail({
      to: adminEmail,
      subject: `New User Registration - ${displayUsername}`,
      text: `
A new user has registered on Thywilluche.

User ID: ${userId}
Name: ${displayName}
Username: ${displayUsername}
Email: ${email}
Registered: ${new Date(createdAt).toLocaleString()}

View admin dashboard at: ${process.env.NEXT_PUBLIC_APP_URL}/admin
      `.trim(),
      html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">New User Registration</h2>
      
      <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <p><strong>User ID:</strong> ${userId}</p>
        <p><strong>Name:</strong> ${displayName}</p>
        <p><strong>Username:</strong> ${displayUsername}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Registered:</strong> ${new Date(
          createdAt
        ).toLocaleString()}</p>
      </div>
      
      <div style="margin: 30px 0;">
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/admin" 
           style="background: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
          View Admin Dashboard
        </a>
      </div>
      
      <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
      <p style="color: #666; font-size: 14px;">
        This is an automated notification from your platform.
      </p>
    </div>
      `.trim(),
    });

    console.log(`Admin notification sent for new signup: ${email}`);
  } catch (error) {
    console.error("Failed to send admin new signup notification:", error);
  }
};
