"use server";

import { requireAdmin } from "@/lib/server-auth";
import db from "@/db";
import {
  championshipRegistrations,
  championshipPaymentSettings,
  championshipReviewSubmissions,
} from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { user } from "@/db/schema";
import { revalidatePath } from "next/cache";
import {
  sendChampionshipRegistrationApprovedEmail,
  sendChampionshipRegistrationRejectedEmail,
} from "@/mailer/handlers/championship";
import { z } from "zod";

export async function getAllChampionshipRegistrations() {
  const isPermitted = await requireAdmin();
  if (!isPermitted) {
    return {
      success: false,
      message: "Unauthorized",
      registrations: [],
    };
  }

  try {
    const registrations = await db.query.championshipRegistrations.findMany({
      orderBy: desc(championshipRegistrations.createdAt),
    });

    const registrationsWithUsers = await Promise.all(
      registrations.map(async (registration) => {
        const registrationUser = await db.query.user.findFirst({
          where: eq(user.id, registration.userId),
        });
        return {
          ...registration,
          user: registrationUser,
        };
      })
    );

    return {
      success: true,
      registrations: registrationsWithUsers,
    };
  } catch (error) {
    console.error("Error fetching championship registrations:", error);
    return {
      success: false,
      message: "Failed to fetch registrations",
      registrations: [],
    };
  }
}

export async function getChampionshipRegistrationById(id: string) {
  const isPermitted = await requireAdmin();
  if (!isPermitted) {
    return {
      success: false,
      message: "Unauthorized",
    };
  }

  try {
    const registration = await db.query.championshipRegistrations.findFirst({
      where: eq(championshipRegistrations.id, id),
    });

    if (!registration) {
      return {
        success: false,
        message: "Registration not found",
      };
    }

    const registrationUser = await db.query.user.findFirst({
      where: eq(user.id, registration.userId),
    });

    return {
      success: true,
      registration: {
        ...registration,
        user: registrationUser,
      },
    };
  } catch (error) {
    console.error("Error fetching championship registration:", error);
    return {
      success: false,
      message: "Failed to fetch registration",
    };
  }
}

export async function approveChampionshipRegistration(id: string) {
  const isPermitted = await requireAdmin();
  if (!isPermitted) {
    return {
      success: false,
      message: "Unauthorized",
    };
  }

  try {
    const registration = await db.query.championshipRegistrations.findFirst({
      where: eq(championshipRegistrations.id, id),
    });

    if (!registration) {
      return {
        success: false,
        message: "Registration not found",
      };
    }

    const [updatedRegistration] = await db
      .update(championshipRegistrations)
      .set({
        status: "approved",
        updatedAt: new Date(),
      })
      .where(eq(championshipRegistrations.id, id))
      .returning();

    const registrationUser = await db.query.user.findFirst({
      where: eq(user.id, registration.userId),
    });

    if (registrationUser?.email) {
      try {
        await sendChampionshipRegistrationApprovedEmail(
          registrationUser.email,
          registrationUser.name
        );
      } catch (emailError) {
        console.error("Failed to send approval email:", emailError);
      }
    }

    revalidatePath("/admin/championship");
    revalidatePath("/championship/registration");

    return {
      success: true,
      message: "Registration approved successfully",
      registration: updatedRegistration,
    };
  } catch (error) {
    console.error("Error approving championship registration:", error);
    return {
      success: false,
      message: "Failed to approve registration",
    };
  }
}

export async function rejectChampionshipRegistration(id: string) {
  const isPermitted = await requireAdmin();
  if (!isPermitted) {
    return {
      success: false,
      message: "Unauthorized",
    };
  }

  try {
    const registration = await db.query.championshipRegistrations.findFirst({
      where: eq(championshipRegistrations.id, id),
    });

    if (!registration) {
      return {
        success: false,
        message: "Registration not found",
      };
    }

    const [updatedRegistration] = await db
      .update(championshipRegistrations)
      .set({
        status: "rejected",
        updatedAt: new Date(),
      })
      .where(eq(championshipRegistrations.id, id))
      .returning();

    const registrationUser = await db.query.user.findFirst({
      where: eq(user.id, registration.userId),
    });

    if (registrationUser?.email) {
      try {
        await sendChampionshipRegistrationRejectedEmail(
          registrationUser.email,
          registrationUser.name
        );
      } catch (emailError) {
        console.error("Failed to send rejection email:", emailError);
      }
    }

    revalidatePath("/admin/championship");
    revalidatePath("/championship/registration");

    return {
      success: true,
      message: "Registration rejected successfully",
      registration: updatedRegistration,
    };
  } catch (error) {
    console.error("Error rejecting championship registration:", error);
    return {
      success: false,
      message: "Failed to reject registration",
    };
  }
}

export async function deleteChampionshipRegistration(id: string) {
  const isPermitted = await requireAdmin();
  if (!isPermitted) {
    return {
      success: false,
      message: "Unauthorized",
    };
  }

  try {
    const registration = await db.query.championshipRegistrations.findFirst({
      where: eq(championshipRegistrations.id, id),
    });

    if (!registration) {
      return {
        success: false,
        message: "Registration not found",
      };
    }

    await db
      .delete(championshipRegistrations)
      .where(eq(championshipRegistrations.id, id));

    revalidatePath("/admin/championship");
    revalidatePath("/championship/registration");

    return {
      success: true,
      message: "Registration deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting championship registration:", error);
    return {
      success: false,
      message: "Failed to delete registration",
    };
  }
}

const paymentSettingsSchema = z.object({
  accountName: z.string().min(1, "Account name is required"),
  accountNumber: z.string().min(1, "Account number is required"),
  bankName: z.string().min(1, "Bank name is required"),
  amount: z.string().min(1, "Amount is required"),
});

export async function getChampionshipPaymentSettings() {
  const isPermitted = await requireAdmin();
  if (!isPermitted) {
    return {
      success: false,
      message: "Unauthorized",
    };
  }

  try {
    const settings = await db.query.championshipPaymentSettings.findFirst();

    if (!settings) {
      return {
        success: true,
        settings: null,
      };
    }

    return {
      success: true,
      settings,
    };
  } catch (error) {
    console.error("Error fetching payment settings:", error);
    return {
      success: false,
      message: "Failed to fetch payment settings",
    };
  }
}

export async function updateChampionshipPaymentSettings(
  formData: z.infer<typeof paymentSettingsSchema>
) {
  const isPermitted = await requireAdmin();
  if (!isPermitted) {
    return {
      success: false,
      message: "Unauthorized",
    };
  }

  try {
    const validatedData = paymentSettingsSchema.parse(formData);

    const existingSettings =
      await db.query.championshipPaymentSettings.findFirst();

    let result;
    if (existingSettings) {
      const [updatedSettings] = await db
        .update(championshipPaymentSettings)
        .set({
          accountName: validatedData.accountName,
          accountNumber: validatedData.accountNumber,
          bankName: validatedData.bankName,
          amount: validatedData.amount,
          updatedAt: new Date(),
        })
        .where(eq(championshipPaymentSettings.id, existingSettings.id))
        .returning();
      result = updatedSettings;
    } else {
      const [newSettings] = await db
        .insert(championshipPaymentSettings)
        .values({
          accountName: validatedData.accountName,
          accountNumber: validatedData.accountNumber,
          bankName: validatedData.bankName,
          amount: validatedData.amount,
        })
        .returning();
      result = newSettings;
    }

    revalidatePath("/admin/championship");
    revalidatePath("/championship/registration");

    return {
      success: true,
      message: "Payment settings updated successfully",
      settings: result,
    };
  } catch (error) {
    console.error("Error updating payment settings:", error);

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
      message: "Failed to update payment settings",
    };
  }
}

export async function getAllChampionshipReviews() {
  const isPermitted = await requireAdmin();
  if (!isPermitted) {
    return {
      success: false,
      message: "Unauthorized",
      reviews: [],
    };
  }

  try {
    const reviews = await db.query.championshipReviewSubmissions.findMany({
      orderBy: desc(championshipReviewSubmissions.createdAt),
    });

    const reviewsWithUsers = await Promise.all(
      reviews.map(async (review) => {
        const reviewUser = await db.query.user.findFirst({
          where: eq(user.id, review.userId),
        });
        return {
          ...review,
          user: reviewUser,
        };
      })
    );

    return {
      success: true,
      reviews: reviewsWithUsers,
    };
  } catch (error) {
    console.error("Error fetching championship reviews:", error);
    return {
      success: false,
      message: "Failed to fetch reviews",
      reviews: [],
    };
  }
}

export async function getChampionshipReviewById(id: string) {
  const isPermitted = await requireAdmin();
  if (!isPermitted) {
    return {
      success: false,
      message: "Unauthorized",
    };
  }

  try {
    const review = await db.query.championshipReviewSubmissions.findFirst({
      where: eq(championshipReviewSubmissions.id, id),
    });

    if (!review) {
      return {
        success: false,
        message: "Review not found",
      };
    }

    const reviewUser = await db.query.user.findFirst({
      where: eq(user.id, review.userId),
    });

    const registration = await db.query.championshipRegistrations.findFirst({
      where: eq(championshipRegistrations.userId, review.userId),
    });

    return {
      success: true,
      review: {
        ...review,
        user: reviewUser,
        registration,
      },
    };
  } catch (error) {
    console.error("Error fetching championship review:", error);
    return {
      success: false,
      message: "Failed to fetch review",
    };
  }
}
