"use server";

import "dotenv/config";
import { z } from "zod";

const donationSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.email("Invalid email address"),
  phone: z.string().optional(),
  donationType: z.string().min(1, "Please select a donation type"),
  amount: z.string().optional(),
  message: z.string().optional(),
});

export type DonationFormData = z.infer<typeof donationSchema>;

export async function sendDonationInquiry(formData: DonationFormData) {
  try {
    const validatedData = donationSchema.parse(formData);

    const notificationEmail = process.env.NOTIFICATION_EMAIL;
    if (!notificationEmail) {
      throw new Error("NOTIFICATION_EMAIL environment variable is not set");
    }

    const { sendMail } = await import("@/mailer");

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #800000; border-bottom: 2px solid #800000; padding-bottom: 10px;">
          New Donation Inquiry
        </h2>
        
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #495057; margin-top: 0;">Contact Information</h3>
          <p><strong>Name:</strong> ${validatedData.name}</p>
          <p><strong>Email:</strong> ${validatedData.email}</p>
          ${
            validatedData.phone
              ? `<p><strong>Phone:</strong> ${validatedData.phone}</p>`
              : ""
          }
        </div>

        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #495057; margin-top: 0;">Donation Details</h3>
          <p><strong>Donation Type:</strong> ${validatedData.donationType}</p>
          ${
            validatedData.amount
              ? `<p><strong>Amount:</strong> ${validatedData.amount}</p>`
              : ""
          }
        </div>

        ${
          validatedData.message
            ? `
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #495057; margin-top: 0;">Additional Message</h3>
          <div style="background-color: white; padding: 15px; border-radius: 4px; border-left: 4px solid #800000;">
            ${validatedData.message.replace(/\n/g, "<br>")}
          </div>
        </div>
        `
            : ""
        }

        <div style="background-color: #d1ecf1; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0; color: #0c5460;">
            <strong>Reply to:</strong> ${validatedData.email}
          </p>
        </div>
      </div>
    `;

    const text = `
New Donation Inquiry

Contact Information:
- Name: ${validatedData.name}
- Email: ${validatedData.email}
${validatedData.phone ? `- Phone: ${validatedData.phone}` : ""}

Donation Details:
- Donation Type: ${validatedData.donationType}
${validatedData.amount ? `- Amount: ${validatedData.amount}` : ""}

${
  validatedData.message ? `Additional Message:\n${validatedData.message}\n` : ""
}

Reply to: ${validatedData.email}
    `;

    await sendMail({
      to: notificationEmail,
      subject: `Donation Inquiry: ${validatedData.name}`,
      text,
      html,
    });

    return {
      success: true,
      message: "Donation inquiry submitted successfully!",
    };
  } catch (error) {
    console.error("Error sending donation inquiry:", error);

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
      message: "Failed to submit inquiry. Please try again later.",
    };
  }
}
