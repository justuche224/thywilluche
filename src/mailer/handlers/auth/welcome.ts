import { sendMail } from "@/mailer";

export const sendWelcomeEmail = async (email: string, name: string | null) => {
  try {
    const greetingName = name || "there";

    await sendMail({
      to: email,
      subject: "Welcome to Thywilluche.com!",
      text: `
Welcome to Thywilluche.com!

Hey ${greetingName},

We're thrilled to have you join the circle. Your account is ready --- your voice, your story, your journey all have a home here. Step in, explore, create, and connect with a community that understands passion, purpose, and persistence.

If you ever need support, we're always here to listen and help. Contact us at support@thywilluche.com.

Best regards,
Team Thywill
      `.trim(),
      html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">Welcome to Thywilluche.com!</h2>
      
      <p>Hey ${greetingName},</p>
      
      <p>We're thrilled to have you join the circle. Your account is ready --- your voice, your story, your journey all have a home here. Step in, explore, create, and connect with a community that understands passion, purpose, and persistence.</p>
      
      <p>If you ever need support, we're always here to listen and help. Contact us at <a href="mailto:support@thywilluche.com">support@thywilluche.com</a>.</p>
      
      <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
      <p style="color: #666; font-size: 14px;">
        Best regards,<br>
        Team Thywill
      </p>
    </div>
      `.trim(),
    });

    console.log(`Welcome email sent to ${email}`);
  } catch (error) {
    console.error("Failed to send welcome email:", error);
  }
};
