"use server";

import { z } from "zod";

const contactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.email("Invalid email address"),
  subject: z.string().min(1, "Subject is required"),
  message: z.string().min(1, "Message is required"),
  recipientEmail: z.email("Invalid recipient email"),
});

export type ContactFormData = z.infer<typeof contactSchema>;

export async function sendContactMessage(formData: ContactFormData) {
  try {
    const validatedData = contactSchema.parse(formData);

    const { sendMail } = await import("@/mailer");

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px;">
          New Contact Message
        </h2>
        
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #495057; margin-top: 0;">Contact Information</h3>
          <p><strong>Name:</strong> ${validatedData.name}</p>
          <p><strong>Email:</strong> ${validatedData.email}</p>
          <p><strong>Subject:</strong> ${validatedData.subject}</p>
        </div>

        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #495057; margin-top: 0;">Message</h3>
          <div style="background-color: white; padding: 15px; border-radius: 4px; border-left: 4px solid #007bff;">
            ${validatedData.message.replace(/\n/g, "<br>")}
          </div>
        </div>

        <div style="background-color: #d1ecf1; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0; color: #0c5460;">
            <strong>Reply to:</strong> ${validatedData.email}
          </p>
        </div>
      </div>
    `;

    const text = `
New Contact Message

Contact Information:
- Name: ${validatedData.name}
- Email: ${validatedData.email}
- Subject: ${validatedData.subject}

Message:
${validatedData.message}

Reply to: ${validatedData.email}
    `;

    await sendMail({
      to: validatedData.recipientEmail,
      subject: `Contact Form: ${validatedData.subject}`,
      text,
      html,
    });

    return { success: true, message: "Message sent successfully!" };
  } catch (error) {
    console.error("Error sending contact message:", error);

    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: "Please check your form and try again.",
        errors: error.issues.map((err) => ({
          field: String(err.path[0]),
          message: err.message,
        })),
      };
    }

    return {
      success: false,
      message: "Failed to send message. Please try again later.",
    };
  }
}
