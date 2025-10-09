"use server";

import db from "@/db";
import { ngoContent } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getNgoContent() {
  try {
    const content = await db.select().from(ngoContent);

    const structured: Record<string, Record<string, string>> = {};

    content.forEach((item) => {
      if (!structured[item.section]) {
        structured[item.section] = {};
      }
      structured[item.section][item.key] = item.value;
    });

    return structured;
  } catch (error) {
    console.error("Error fetching NGO content:", error);
    return {};
  }
}

export async function getNgoSection(section: string) {
  try {
    const content = await db
      .select()
      .from(ngoContent)
      .where(eq(ngoContent.section, section));

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

export async function updateNgoContent(
  section: string,
  key: string,
  value: string,
  valueType: string = "text"
) {
  try {
    const existing = await db
      .select()
      .from(ngoContent)
      .where(and(eq(ngoContent.section, section), eq(ngoContent.key, key)));

    if (existing.length > 0) {
      await db
        .update(ngoContent)
        .set({
          value,
          valueType,
          updatedAt: new Date(),
        })
        .where(eq(ngoContent.id, existing[0].id));
    } else {
      await db.insert(ngoContent).values({
        section,
        key,
        value,
        valueType,
      });
    }

    revalidatePath("/ngo");

    return { success: true };
  } catch (error) {
    console.error("Error updating NGO content:", error);
    return { success: false, error: "Failed to update content" };
  }
}

export async function bulkUpdateNgoContent(
  updates: Array<{
    section: string;
    key: string;
    value: string;
    valueType?: string;
  }>
) {
  try {
    for (const update of updates) {
      await updateNgoContent(
        update.section,
        update.key,
        update.value,
        update.valueType || "text"
      );
    }

    revalidatePath("/ngo");

    return { success: true };
  } catch (error) {
    console.error("Error bulk updating NGO content:", error);
    return { success: false, error: "Failed to update content" };
  }
}
