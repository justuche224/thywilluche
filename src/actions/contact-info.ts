import "server-only";
import db from "@/db";
import { contactInfo } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getContactInfo() {
  try {
    const info = await db.select().from(contactInfo);

    const structured: Record<string, { value: string; label?: string }> = {};

    info.forEach((item) => {
      structured[item.key] = {
        value: item.value,
        label: item.label || undefined,
      };
    });

    return structured;
  } catch (error) {
    console.error("Error fetching contact info:", error);
    return {};
  }
}

export async function getSocials() {
  try {
    const info = await db.select().from(contactInfo);

    const socials = info.filter((item) => item.type === "social");

    return socials.map((social) => ({
      key: social.key,
      label: social.label || social.key,
      url: social.value,
    }));
  } catch (error) {
    console.error("Error fetching socials:", error);
    return [];
  }
}

export async function updateContactInfo(
  key: string,
  value: string,
  label?: string,
  type: string = "text"
) {
  try {
    const existing = await db
      .select()
      .from(contactInfo)
      .where(eq(contactInfo.key, key));

    if (existing.length > 0) {
      await db
        .update(contactInfo)
        .set({
          value,
          label,
          type,
          updatedAt: new Date(),
        })
        .where(eq(contactInfo.id, existing[0].id));
    } else {
      await db.insert(contactInfo).values({
        key,
        value,
        label,
        type,
      });
    }

    revalidatePath("/");

    return { success: true };
  } catch (error) {
    console.error("Error updating contact info:", error);
    return { success: false, error: "Failed to update contact info" };
  }
}

export async function bulkUpdateContactInfo(
  updates: Array<{
    key: string;
    value: string;
    label?: string;
    type?: string;
  }>
) {
  try {
    for (const update of updates) {
      await updateContactInfo(
        update.key,
        update.value,
        update.label,
        update.type || "text"
      );
    }

    revalidatePath("/");

    return { success: true };
  } catch (error) {
    console.error("Error bulk updating contact info:", error);
    return { success: false, error: "Failed to update contact info" };
  }
}
