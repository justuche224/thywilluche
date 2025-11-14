"use server";

import "dotenv/config";
import { z } from "zod";

const partnerSchema = z.object({
  organizationName: z.string().min(1, "Organization name is required"),
  contactName: z.string().min(1, "Contact name is required"),
  email: z.email("Invalid email address"),
  phone: z.string().optional(),
  website: z.string().optional(),
  partnershipType: z.string().min(1, "Please select a partnership type"),
  partnershipDetails: z.string().min(1, "Please provide partnership details"),
  message: z.string().optional(),
});

export type PartnerFormData = z.infer<typeof partnerSchema>;

export async function sendPartnershipInquiry(formData: PartnerFormData) {
  try {
    const validatedData = partnerSchema.parse(formData);

    const notificationEmail = process.env.NOTIFICATION_EMAIL;
    if (!notificationEmail) {
      throw new Error("NOTIFICATION_EMAIL environment variable is not set");
    }

    const { sendMail } = await import("@/mailer");

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #800000; border-bottom: 2px solid #800000; padding-bottom: 10px;">
          New Partnership Inquiry
        </h2>
        
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #495057; margin-top: 0;">Organization Information</h3>
          <p><strong>Organization Name:</strong> ${
            validatedData.organizationName
          }</p>
          <p><strong>Contact Name:</strong> ${validatedData.contactName}</p>
          <p><strong>Email:</strong> ${validatedData.email}</p>
          ${
            validatedData.phone
              ? `<p><strong>Phone:</strong> ${validatedData.phone}</p>`
              : ""
          }
          ${
            validatedData.website
              ? `<p><strong>Website:</strong> <a href="${validatedData.website}" target="_blank">${validatedData.website}</a></p>`
              : ""
          }
        </div>

        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #495057; margin-top: 0;">Partnership Type</h3>
          <div style="background-color: white; padding: 15px; border-radius: 4px; border-left: 4px solid #800000;">
            ${validatedData.partnershipType}
          </div>
        </div>

        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #495057; margin-top: 0;">Partnership Details</h3>
          <div style="background-color: white; padding: 15px; border-radius: 4px; border-left: 4px solid #800000;">
            ${validatedData.partnershipDetails.replace(/\n/g, "<br>")}
          </div>
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
New Partnership Inquiry

Organization Information:
- Organization Name: ${validatedData.organizationName}
- Contact Name: ${validatedData.contactName}
- Email: ${validatedData.email}
${validatedData.phone ? `- Phone: ${validatedData.phone}` : ""}
${validatedData.website ? `- Website: ${validatedData.website}` : ""}

Partnership Type:
${validatedData.partnershipType}

Partnership Details:
${validatedData.partnershipDetails}

${
  validatedData.message ? `Additional Message:\n${validatedData.message}\n` : ""
}

Reply to: ${validatedData.email}
    `;

    await sendMail({
      to: notificationEmail,
      subject: `Partnership Inquiry: ${validatedData.organizationName}`,
      text,
      html,
    });

    return {
      success: true,
      message: "Partnership inquiry submitted successfully!",
    };
  } catch (error) {
    console.error("Error sending partnership inquiry:", error);

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
