import "server-only";
import db from "@/db";
import { homeContent } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getHomeContent() {
  try {
    const content = await db.select().from(homeContent);

    const structured: Record<string, Record<string, string>> = {};

    content.forEach((item) => {
      if (!structured[item.section]) {
        structured[item.section] = {};
      }
      structured[item.section][item.key] = item.value;
    });

    return structured;
  } catch (error) {
    console.error("Error fetching home content:", error);
    return {};
  }
}

export async function getHomeSection(section: string) {
  try {
    const content = await db
      .select()
      .from(homeContent)
      .where(eq(homeContent.section, section));

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

export async function updateHomeContent(
  section: string,
  key: string,
  value: string,
  valueType: string = "text"
) {
  try {
    const existing = await db
      .select()
      .from(homeContent)
      .where(and(eq(homeContent.section, section), eq(homeContent.key, key)));

    if (existing.length > 0) {
      await db
        .update(homeContent)
        .set({
          value,
          valueType,
          updatedAt: new Date(),
        })
        .where(eq(homeContent.id, existing[0].id));
    } else {
      await db.insert(homeContent).values({
        section,
        key,
        value,
        valueType,
      });
    }

    revalidatePath("/");

    return { success: true };
  } catch (error) {
    console.error("Error updating home content:", error);
    return { success: false, error: "Failed to update content" };
  }
}

export async function bulkUpdateHomeContent(
  updates: Array<{
    section: string;
    key: string;
    value: string;
    valueType?: string;
  }>
) {
  try {
    for (const update of updates) {
      await updateHomeContent(
        update.section,
        update.key,
        update.value,
        update.valueType || "text"
      );
    }

    revalidatePath("/");

    return { success: true };
  } catch (error) {
    console.error("Error bulk updating home content:", error);
    return { success: false, error: "Failed to update content" };
  }
}
