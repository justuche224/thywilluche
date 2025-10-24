"use server";

import { z } from "zod";
import db from "@/db";
import { supportTicket, supportMessage } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import {
  sendSupportTicketNotification,
  sendSupportMessageNotification,
} from "@/mailer/handlers/support-ticket";
import { user } from "@/db/schema";

const createTicketSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .min(5, "Title must be at least 5 characters"),
  description: z
    .string()
    .min(1, "Description is required")
    .min(10, "Description must be at least 10 characters"),
});

const sendMessageSchema = z.object({
  ticketId: z.number().int().positive("Invalid ticket ID"),
  message: z.string().min(1, "Message is required"),
});

export async function createSupportTicket(
  userId: string,
  formData: z.infer<typeof createTicketSchema>
) {
  try {
    const validatedData = createTicketSchema.parse(formData);

    const userData = await db.query.user.findFirst({
      where: eq(user.id, userId),
    });

    if (!userData) {
      return { success: false, message: "User not found" };
    }

    const newTicket = await db
      .insert(supportTicket)
      .values({
        userId,
        title: validatedData.title,
        description: validatedData.description,
        status: "OPEN",
      })
      .returning();

    const ticketId = newTicket[0].id;

    const adminUser = await db.query.user.findFirst({
      where: eq(user.role, "ADMIN"),
    });

    if (adminUser?.email) {
      try {
        await sendSupportTicketNotification(
          adminUser.email,
          userData.name || userData.email,
          userData.email,
          validatedData.title,
          validatedData.description,
          ticketId
        );
      } catch (emailError) {
        console.error("Failed to send admin notification email:", emailError);
      }
    }

    return {
      success: true,
      message: "Support ticket created successfully",
      ticketId,
    };
  } catch (error) {
    console.error("Error creating support ticket:", error);

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
      message: "Failed to create support ticket. Please try again later.",
    };
  }
}

export async function getSupportTickets(userId: string) {
  try {
    const isAdmin = await db.query.user.findFirst({
      where: eq(user.id, userId),
    });

    if (!isAdmin) {
      return { success: false, tickets: [] };
    }

    let tickets;
    if (isAdmin.role === "ADMIN") {
      tickets = await db.query.supportTicket.findMany({
        orderBy: desc(supportTicket.createdAt),
      });
    } else {
      tickets = await db.query.supportTicket.findMany({
        where: eq(supportTicket.userId, userId),
        orderBy: desc(supportTicket.createdAt),
      });
    }

    const ticketsWithUsers = await Promise.all(
      tickets.map(async (ticket) => {
        const ticketUser = await db.query.user.findFirst({
          where: eq(user.id, ticket.userId),
        });
        return {
          ...ticket,
          userEmail: ticketUser?.email,
          userName: ticketUser?.name || ticketUser?.email,
        };
      })
    );

    return { success: true, tickets: ticketsWithUsers };
  } catch (error) {
    console.error("Error fetching support tickets:", error);
    return { success: false, tickets: [] };
  }
}

export async function getSupportTicketDetail(ticketId: number, userId: string) {
  try {
    const ticket = await db.query.supportTicket.findFirst({
      where: eq(supportTicket.id, ticketId),
    });

    if (!ticket) {
      return { success: false, message: "Ticket not found" };
    }

    const userData = await db.query.user.findFirst({
      where: eq(user.id, userId),
    });

    if (!userData) {
      return { success: false, message: "User not found" };
    }

    if (userData.role !== "ADMIN" && ticket.userId !== userId) {
      return { success: false, message: "Unauthorized" };
    }

    const ticketUser = await db.query.user.findFirst({
      where: eq(user.id, ticket.userId),
    });

    const messages = await db.query.supportMessage.findMany({
      where: eq(supportMessage.ticketId, ticketId),
      orderBy: supportMessage.createdAt,
    });

    const messagesWithUsers = await Promise.all(
      messages.map(async (msg) => {
        const msgUser = await db.query.user.findFirst({
          where: eq(user.id, msg.userId),
        });
        return {
          ...msg,
          userName: msgUser?.name || msgUser?.email,
          userRole: msgUser?.role,
        };
      })
    );

    return {
      success: true,
      ticket: {
        ...ticket,
        userEmail: ticketUser?.email,
        userName: ticketUser?.name || ticketUser?.email,
      },
      messages: messagesWithUsers,
    };
  } catch (error) {
    console.error("Error fetching support ticket detail:", error);
    return { success: false, message: "Failed to fetch ticket" };
  }
}

export async function sendSupportMessage(
  ticketId: number,
  userId: string,
  messageText: string
) {
  try {
    const validatedData = sendMessageSchema.parse({
      ticketId,
      message: messageText,
    });

    const ticket = await db.query.supportTicket.findFirst({
      where: eq(supportTicket.id, ticketId),
    });

    if (!ticket) {
      return { success: false, message: "Ticket not found" };
    }

    const userData = await db.query.user.findFirst({
      where: eq(user.id, userId),
    });

    if (!userData) {
      return { success: false, message: "User not found" };
    }

    if (userData.role !== "ADMIN" && ticket.userId !== userId) {
      return { success: false, message: "Unauthorized" };
    }

    await db.insert(supportMessage).values({
      ticketId: validatedData.ticketId,
      userId,
      message: validatedData.message,
    });

    let recipientEmail = "";
    let recipientName = "";

    if (userData.role === "ADMIN") {
      const recipientUser = await db.query.user.findFirst({
        where: eq(user.id, ticket.userId),
      });
      recipientEmail = recipientUser?.email || "";
      recipientName = recipientUser?.name || recipientUser?.email || "";
    } else {
      const adminUser = await db.query.user.findFirst({
        where: eq(user.role, "ADMIN"),
      });
      recipientEmail = adminUser?.email || "";
      recipientName = adminUser?.name || "Admin";
    }

    if (recipientEmail) {
      try {
        await sendSupportMessageNotification(
          recipientEmail,
          recipientName,
          userData.name || userData.email,
          validatedData.message,
          ticketId
        );
      } catch (emailError) {
        console.error("Failed to send message notification email:", emailError);
      }
    }

    return {
      success: true,
      message: "Message sent successfully",
    };
  } catch (error) {
    console.error("Error sending support message:", error);

    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: "Please check your message and try again.",
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

export async function updateTicketStatus(
  ticketId: number,
  userId: string,
  status: string
) {
  try {
    const ticket = await db.query.supportTicket.findFirst({
      where: eq(supportTicket.id, ticketId),
    });

    if (!ticket) {
      return { success: false, message: "Ticket not found" };
    }

    const userData = await db.query.user.findFirst({
      where: eq(user.id, userId),
    });

    if (!userData || userData.role !== "ADMIN") {
      return { success: false, message: "Unauthorized" };
    }

    const validStatuses = ["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"];
    if (!validStatuses.includes(status)) {
      return { success: false, message: "Invalid status" };
    }

    await db
      .update(supportTicket)
      .set({ status: status as "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED"  })
      .where(eq(supportTicket.id, ticketId));

    return { success: true, message: "Ticket status updated successfully" };
  } catch (error) {
    console.error("Error updating ticket status:", error);
    return { success: false, message: "Failed to update ticket status" };
  }
}
