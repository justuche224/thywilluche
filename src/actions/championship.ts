"use server";

import { serverAuth } from "@/lib/server-auth";
import { z } from "zod";
import db from "@/db";
import {
  championshipRegistrations,
  championshipReviewSubmissions,
} from "@/db/schema";
import { eq } from "drizzle-orm";
import { user } from "@/db/schema";
import {
  sendChampionshipRegistrationNotificationToAdmin,
  sendChampionshipRegistrationConfirmationEmail,
} from "@/mailer/handlers/championship";

const formSchema = z.object({
  phoneNumber: z.string().min(1, "Phone number is required"),
  country: z.string().min(1, "Country is required"),
  state: z.string().min(1, "State is required"),
  city: z.string().min(1, "City is required"),
  address: z.string().min(1, "Address is required"),
  receiptUrl: z.string().min(1, "Receipt URL is required"),
});

export async function registerForChampionship(
  formData: z.infer<typeof formSchema>
) {
  try {
    const session = await serverAuth();

    if (!session || !session.user) {
      return {
        success: false,
        message: "Unauthorized",
      };
    }

    const validatedData = formSchema.parse(formData);

    const existingRegistration =
      await db.query.championshipRegistrations.findFirst({
        where: eq(championshipRegistrations.userId, session.user.id),
      });

    if (existingRegistration) {
      return {
        success: false,
        message: "You have already registered for the championship",
      };
    }

    const newRegistration = await db
      .insert(championshipRegistrations)
      .values({
        userId: session.user.id,
        phoneNumber: validatedData.phoneNumber,
        country: validatedData.country,
        state: validatedData.state,
        city: validatedData.city,
        address: validatedData.address,
        receiptUrl: validatedData.receiptUrl,
        status: "pending",
      })
      .returning();

    const userData = await db.query.user.findFirst({
      where: eq(user.id, session.user.id),
    });

    if (userData) {
      try {
        await sendChampionshipRegistrationConfirmationEmail(
          userData.email,
          userData.name,
          newRegistration[0].id
        );
      } catch (emailError) {
        console.error(
          "Failed to send registration confirmation email:",
          emailError
        );
      }
    }

    const NOTIFICATION_EMAIL = process.env.NOTIFICATION_EMAIL;

    if (NOTIFICATION_EMAIL && userData) {
      try {
        await sendChampionshipRegistrationNotificationToAdmin(
          NOTIFICATION_EMAIL,
          userData.name || userData.email,
          userData.email,
          validatedData.phoneNumber,
          validatedData.country,
          validatedData.state,
          validatedData.city,
          validatedData.address,
          newRegistration[0].id,
          validatedData.receiptUrl
        );
      } catch (emailError) {
        console.error("Failed to send admin notification email:", emailError);
      }
    }

    return {
      success: true,
      message: "Registration submitted successfully",
      data: newRegistration[0],
    };
  } catch (error) {
    console.error("Error registering for championship:", error);

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
      message: "Failed to register for championship. Please try again later.",
    };
  }
}

export async function checkChampionshipRegistration() {
  try {
    const session = await serverAuth();

    if (!session || !session.user) {
      return {
        success: false,
        message: "Unauthorized",
      };
    }

    const registration = await db.query.championshipRegistrations.findFirst({
      where: eq(championshipRegistrations.userId, session.user.id),
    });

    if (!registration) {
      return {
        success: true,
        registered: false,
        message: "You have not registered yet",
      };
    }

    return {
      success: true,
      registered: true,
      status: registration.status,
      data: registration,
    };
  } catch (error) {
    console.error("Error checking championship registration:", error);
    return {
      success: false,
      message: "Failed to check registration status. Please try again later.",
    };
  }
}

export async function getChampionshipPaymentInfo() {
  try {
    const settings = await db.query.championshipPaymentSettings.findFirst();

    if (!settings) {
      return {
        success: true,
        settings: null,
        message: "Payment settings not configured",
      };
    }

    return {
      success: true,
      settings,
    };
  } catch (error) {
    console.error("Error fetching payment info:", error);
    return {
      success: false,
      message: "Failed to fetch payment information",
      settings: null,
    };
  }
}

export async function getReviewSubmission() {
  try {
    const session = await serverAuth();

    if (!session || !session.user) {
      return {
        success: false,
        message: "Unauthorized",
        submission: null,
      };
    }

    const submission = await db.query.championshipReviewSubmissions.findFirst({
      where: eq(championshipReviewSubmissions.userId, session.user.id),
    });

    if (!submission) {
      return {
        success: true,
        submission: null,
        message: "No submission found",
      };
    }

    return {
      success: true,
      submission,
    };
  } catch (error) {
    console.error("Error fetching review submission:", error);
    return {
      success: false,
      message: "Failed to fetch review submission",
      submission: null,
    };
  }
}

const reviewSubmissionSchema = z
  .object({
    reviewText: z.string().optional(),
    reviewDocumentUrl: z.string().optional(),
  })
  .refine((data) => data.reviewText || data.reviewDocumentUrl, {
    message: "Either review text or document is required",
    path: ["reviewText"],
  });

export async function submitReview(
  formData: z.infer<typeof reviewSubmissionSchema>
) {
  try {
    const session = await serverAuth();

    if (!session || !session.user) {
      return {
        success: false,
        message: "Unauthorized",
      };
    }

    const registration = await db.query.championshipRegistrations.findFirst({
      where: eq(championshipRegistrations.userId, session.user.id),
    });

    if (!registration || registration.status !== "approved") {
      return {
        success: false,
        message: "You must be approved to submit a review",
      };
    }

    const existingSubmission =
      await db.query.championshipReviewSubmissions.findFirst({
        where: eq(championshipReviewSubmissions.userId, session.user.id),
      });

    if (existingSubmission) {
      return {
        success: false,
        message: "You have already submitted a review",
      };
    }

    const validatedData = reviewSubmissionSchema.parse(formData);

    const newSubmission = await db
      .insert(championshipReviewSubmissions)
      .values({
        userId: session.user.id,
        reviewText: validatedData.reviewText || null,
        reviewDocumentUrl: validatedData.reviewDocumentUrl || null,
      })
      .returning();

    return {
      success: true,
      message: "Review submitted successfully",
      data: newSubmission[0],
    };
  } catch (error) {
    console.error("Error submitting review:", error);

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
      message: "Failed to submit review. Please try again later.",
    };
  }
}
