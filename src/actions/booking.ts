"use server";

import { serviceBooking } from "@/mailer/handlers/service-booking";
import { z } from "zod";

const bookingSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  service: z.string().min(1, "Service is required"),
  type: z.string().min(1, "Service type is required"),
  duration: z.string().optional(),
  preferredDate: z.string().optional(),
  preferredTime: z.string().optional(),
  brief: z.string().min(1, "Project brief is required"),
  deliverables: z.string().optional(),
  deadline: z.string().optional(),
  budget: z.string().optional(),
  additionalInfo: z.string().optional(),
});

export type BookingFormData = z.infer<typeof bookingSchema>;

export async function submitBookingForm(formData: BookingFormData) {
  try {
    const validatedData = bookingSchema.parse(formData);

    await serviceBooking(validatedData);

    return { success: true, message: "Booking request sent successfully!" };
  } catch (error) {
    console.error("Error submitting booking form:", error);

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
      message: "Failed to send booking request. Please try again later.",
    };
  }
}
