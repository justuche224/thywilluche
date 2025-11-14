"use server";

import "dotenv/config";
import { z } from "zod";

const volunteerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.email("Invalid email address"),
  phone: z.string().optional(),
  skills: z.string().min(1, "Please tell us about your skills"),
  availability: z.string().min(1, "Please tell us about your availability"),
  interests: z.string().optional(),
  message: z.string().optional(),
});

export type VolunteerFormData = z.infer<typeof volunteerSchema>;

export async function sendVolunteerApplication(formData: VolunteerFormData) {
  try {
    const validatedData = volunteerSchema.parse(formData);

    const notificationEmail = process.env.NOTIFICATION_EMAIL;
    if (!notificationEmail) {
      throw new Error("NOTIFICATION_EMAIL environment variable is not set");
    }

    const { sendMail } = await import("@/mailer");

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #800000; border-bottom: 2px solid #800000; padding-bottom: 10px;">
          New Volunteer Application
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
          <h3 style="color: #495057; margin-top: 0;">Skills & Experience</h3>
          <div style="background-color: white; padding: 15px; border-radius: 4px; border-left: 4px solid #800000;">
            ${validatedData.skills.replace(/\n/g, "<br>")}
          </div>
        </div>

        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #495057; margin-top: 0;">Availability</h3>
          <div style="background-color: white; padding: 15px; border-radius: 4px; border-left: 4px solid #800000;">
            ${validatedData.availability.replace(/\n/g, "<br>")}
          </div>
        </div>

        ${
          validatedData.interests
            ? `
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #495057; margin-top: 0;">Areas of Interest</h3>
          <div style="background-color: white; padding: 15px; border-radius: 4px; border-left: 4px solid #800000;">
            ${validatedData.interests.replace(/\n/g, "<br>")}
          </div>
        </div>
        `
            : ""
        }

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
New Volunteer Application

Contact Information:
- Name: ${validatedData.name}
- Email: ${validatedData.email}
${validatedData.phone ? `- Phone: ${validatedData.phone}` : ""}

Skills & Experience:
${validatedData.skills}

Availability:
${validatedData.availability}

${
  validatedData.interests
    ? `Areas of Interest:\n${validatedData.interests}\n`
    : ""
}
${
  validatedData.message ? `Additional Message:\n${validatedData.message}\n` : ""
}

Reply to: ${validatedData.email}
    `;

    await sendMail({
      to: notificationEmail,
      subject: `Volunteer Application: ${validatedData.name}`,
      text,
      html,
    });

    return { success: true, message: "Application submitted successfully!" };
  } catch (error) {
    console.error("Error sending volunteer application:", error);

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
      message: "Failed to submit application. Please try again later.",
    };
  }
}
