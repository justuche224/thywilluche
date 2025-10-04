import "server-only";
import db from "@/db";
import { aboutContent } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getAboutContent() {
  try {
    const content = await db.select().from(aboutContent);

    const structured: Record<string, Record<string, string>> = {};

    content.forEach((item) => {
      if (!structured[item.section]) {
        structured[item.section] = {};
      }
      structured[item.section][item.key] = item.value;
    });

    return structured;
  } catch (error) {
    console.error("Error fetching about content:", error);
    return {};
  }
}

export async function getAboutSection(section: string) {
  try {
    const content = await db
      .select()
      .from(aboutContent)
      .where(eq(aboutContent.section, section));

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

export async function updateAboutContent(
  section: string,
  key: string,
  value: string,
  valueType: string = "text"
) {
  try {
    const existing = await db
      .select()
      .from(aboutContent)
      .where(and(eq(aboutContent.section, section), eq(aboutContent.key, key)));

    if (existing.length > 0) {
      await db
        .update(aboutContent)
        .set({
          value,
          valueType,
          updatedAt: new Date(),
        })
        .where(eq(aboutContent.id, existing[0].id));
    } else {
      await db.insert(aboutContent).values({
        section,
        key,
        value,
        valueType,
      });
    }

    revalidatePath("/about");

    return { success: true };
  } catch (error) {
    console.error("Error updating about content:", error);
    return { success: false, error: "Failed to update content" };
  }
}

export async function bulkUpdateAboutContent(
  updates: Array<{
    section: string;
    key: string;
    value: string;
    valueType?: string;
  }>
) {
  try {
    for (const update of updates) {
      await updateAboutContent(
        update.section,
        update.key,
        update.value,
        update.valueType || "text"
      );
    }

    revalidatePath("/about");

    return { success: true };
  } catch (error) {
    console.error("Error bulk updating about content:", error);
    return { success: false, error: "Failed to update content" };
  }
}
