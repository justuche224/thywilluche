import "server-only";
import db from "@/db";
import { servicesContent } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getServicesContent() {
  try {
    const content = await db.select().from(servicesContent);

    const structured: Record<string, Record<string, string>> = {};

    content.forEach((item) => {
      if (!structured[item.section]) {
        structured[item.section] = {};
      }
      structured[item.section][item.key] = item.value;
    });

    return structured;
  } catch (error) {
    console.error("Error fetching services content:", error);
    return {};
  }
}

export async function getServiceSection(section: string) {
  try {
    const content = await db
      .select()
      .from(servicesContent)
      .where(eq(servicesContent.section, section));

    const structured: Record<string, string> = {};

    content.forEach((item) => {
      structured[item.key] = item.value;
    });

    return structured;
  } catch (error) {
    console.error(`Error fetching ${section} content:`, error);
    return {};
  }
}

export async function updateServiceContent(
  section: string,
  key: string,
  value: string,
  valueType: string = "text"
) {
  try {
    const existing = await db
      .select()
      .from(servicesContent)
      .where(
        and(eq(servicesContent.section, section), eq(servicesContent.key, key))
      );

    if (existing.length > 0) {
      await db
        .update(servicesContent)
        .set({
          value,
          valueType,
          updatedAt: new Date(),
        })
        .where(eq(servicesContent.id, existing[0].id));
    } else {
      await db.insert(servicesContent).values({
        section,
        key,
        value,
        valueType,
      });
    }

    revalidatePath("/services");
    revalidatePath(`/services/${section}`);

    return { success: true };
  } catch (error) {
    console.error("Error updating service content:", error);
    return { success: false, error: "Failed to update content" };
  }
}

export async function bulkUpdateServiceContent(
  updates: Array<{
    section: string;
    key: string;
    value: string;
    valueType?: string;
  }>
) {
  try {
    for (const update of updates) {
      await updateServiceContent(
        update.section,
        update.key,
        update.value,
        update.valueType || "text"
      );
    }

    revalidatePath("/services");

    return { success: true };
  } catch (error) {
    console.error("Error bulk updating service content:", error);
    return { success: false, error: "Failed to update content" };
  }
}
