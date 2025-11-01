import { sendMail } from "@/mailer";

export const sendWelcomeEmail = async (email: string, name: string | null) => {
  try {
    const greetingName = name || "there";

    await sendMail({
      to: email,
      subject: "Welcome to Thywilluche!",
      text: `
Hi ${greetingName},

Welcome to Thywilluche! We're excited to have you on board.

Your account has been successfully created. You can now explore our community, share your thoughts, and connect with others.

If you have any questions, feel free to reach out to our support team.

Best regards,
Thywilluche Team
      `.trim(),
      html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">Welcome to Thywilluche!</h2>
      
      <p>Hi ${greetingName},</p>
      
      <p>We're excited to have you on board. Your account has been successfully created. You can now explore our community, share your thoughts, and connect with others.</p>
      
      <p>If you have any questions, feel free to reach out to our support team.</p>
      
      <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
      <p style="color: #666; font-size: 14px;">
        Best regards,<br>
        Thywilluche Team
      </p>
    </div>
      `.trim(),
    });

    console.log(`Welcome email sent to ${email}`);
  } catch (error) {
    console.error("Failed to send welcome email:", error);
  }
};
