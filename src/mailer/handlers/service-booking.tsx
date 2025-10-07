import { sendMail } from "..";

const contactEmail = process.env.CONTACT_EMAIL;

interface ServiceBookingFormData {
  name: string;
  email: string;
  phone?: string;
  service: string;
  type: string;
  duration?: string;
  preferredDate?: string;
  preferredTime?: string;
  brief: string;
  deliverables?: string;
  deadline?: string;
  budget?: string;
  additionalInfo?: string;
}

const serviceDetails = {
  coaching: {
    title: "Personal Coaching Session",
    description: "New coaching session booking request",
  },
  consulting: {
    title: "Strategic Consulting Call",
    description: "New consulting consultation request",
  },
  ghostwriting: {
    title: "Ghostwriting Project Inquiry",
    description: "New ghostwriting project inquiry",
  },
  custom: {
    title: "Custom Request",
    description: "New custom service request",
  },
};

const generateEmailTemplate = (
  formData: ServiceBookingFormData,
  serviceType: string
) => {
  const details = serviceDetails[serviceType as keyof typeof serviceDetails];

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px;">
        ${details.title}
      </h2>
      
      <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="color: #495057; margin-top: 0;">Contact Information</h3>
        <p><strong>Name:</strong> ${formData.name}</p>
        <p><strong>Email:</strong> ${formData.email}</p>
        ${
          formData.phone
            ? `<p><strong>Phone:</strong> ${formData.phone}</p>`
            : ""
        }
      </div>

      <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="color: #495057; margin-top: 0;">Service Details</h3>
        <p><strong>Service:</strong> ${formData.service}</p>
        <p><strong>Type:</strong> ${formData.type}</p>
        ${
          formData.duration
            ? `<p><strong>Duration:</strong> ${formData.duration}</p>`
            : ""
        }
        ${
          formData.preferredDate
            ? `<p><strong>Preferred Date:</strong> ${formData.preferredDate}</p>`
            : ""
        }
        ${
          formData.preferredTime
            ? `<p><strong>Preferred Time:</strong> ${formData.preferredTime}</p>`
            : ""
        }
      </div>

      <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="color: #495057; margin-top: 0;">Project Details</h3>
        <p><strong>Project Brief:</strong></p>
        <div style="background-color: white; padding: 15px; border-radius: 4px; border-left: 4px solid #007bff;">
          ${formData.brief.replace(/\n/g, "<br>")}
        </div>
        
        ${
          formData.deliverables
            ? `
          <p style="margin-top: 15px;"><strong>Expected Deliverables:</strong></p>
          <div style="background-color: white; padding: 15px; border-radius: 4px; border-left: 4px solid #28a745;">
            ${formData.deliverables.replace(/\n/g, "<br>")}
          </div>
        `
            : ""
        }
        
        ${
          formData.deadline
            ? `<p style="margin-top: 15px;"><strong>Deadline:</strong> ${formData.deadline}</p>`
            : ""
        }
        ${
          formData.budget
            ? `<p><strong>Budget Range:</strong> ${formData.budget}</p>`
            : ""
        }
      </div>

      ${
        formData.additionalInfo
          ? `
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #495057; margin-top: 0;">Additional Information</h3>
          <div style="background-color: white; padding: 15px; border-radius: 4px; border-left: 4px solid #ffc107;">
            ${formData.additionalInfo.replace(/\n/g, "<br>")}
          </div>
        </div>
      `
          : ""
      }

      <div style="background-color: #d1ecf1; padding: 15px; border-radius: 8px; margin: 20px 0;">
        <p style="margin: 0; color: #0c5460;">
          <strong>Next Steps:</strong> Please respond to this client within 24 hours to discuss their request and schedule a consultation.
        </p>
      </div>
    </div>
  `;

  const text = `
${details.title}

Contact Information:
- Name: ${formData.name}
- Email: ${formData.email}
${formData.phone ? `- Phone: ${formData.phone}` : ""}

Service Details:
- Service: ${formData.service}
- Type: ${formData.type}
${formData.duration ? `- Duration: ${formData.duration}` : ""}
${formData.preferredDate ? `- Preferred Date: ${formData.preferredDate}` : ""}
${formData.preferredTime ? `- Preferred Time: ${formData.preferredTime}` : ""}

Project Details:
- Project Brief: ${formData.brief}

${
  formData.deliverables
    ? `- Expected Deliverables: ${formData.deliverables}`
    : ""
}
${formData.deadline ? `- Deadline: ${formData.deadline}` : ""}
${formData.budget ? `- Budget Range: ${formData.budget}` : ""}

${
  formData.additionalInfo
    ? `Additional Information: ${formData.additionalInfo}`
    : ""
}

Next Steps: Please respond to this client within 24 hours to discuss their request and schedule a consultation.
  `;

  return { html, text };
};

export const serviceBooking = async (formData: ServiceBookingFormData) => {
  if (!contactEmail) {
    throw new Error("Contact email not configured");
  }

  const serviceType = formData.service.toLowerCase().includes("coaching")
    ? "coaching"
    : formData.service.toLowerCase().includes("consulting")
    ? "consulting"
    : formData.service.toLowerCase().includes("ghostwriting")
    ? "ghostwriting"
    : "custom";

  const details = serviceDetails[serviceType as keyof typeof serviceDetails];
  const { html, text } = generateEmailTemplate(formData, serviceType);

  await sendMail({
    to: contactEmail,
    subject: `${details.title} - ${formData.name}`,
    text,
    html,
  });
};
