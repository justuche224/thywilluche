"use server";

import { bulkUpdateAboutContent } from "@/actions/about-content";
import { uploadFile } from "@/lib/upload";
import { revalidatePath } from "next/cache";

export async function updateAboutJourneyContent(formData: FormData) {
  try {
    const updates = [];

    const whoIAmTitle = formData.get("whoIAmTitle") as string;
    const whoIAmParagraph1 = formData.get("whoIAmParagraph1") as string;
    const whoIAmParagraph2 = formData.get("whoIAmParagraph2") as string;
    const whoIAmParagraph3 = formData.get("whoIAmParagraph3") as string;
    const whoIAmParagraph4 = formData.get("whoIAmParagraph4") as string;
    const journeyTitle = formData.get("journeyTitle") as string;
    const journeyParagraph1 = formData.get("journeyParagraph1") as string;
    const journeyParagraph2 = formData.get("journeyParagraph2") as string;
    const purposeTitle = formData.get("purposeTitle") as string;
    const purposeParagraph1 = formData.get("purposeParagraph1") as string;
    const purposeParagraph2 = formData.get("purposeParagraph2") as string;
    const purposeParagraph3 = formData.get("purposeParagraph3") as string;
    const missionTitle = formData.get("missionTitle") as string;
    const missionParagraph1 = formData.get("missionParagraph1") as string;
    const missionParagraph2 = formData.get("missionParagraph2") as string;
    const visionTitle = formData.get("visionTitle") as string;
    const visionParagraph1 = formData.get("visionParagraph1") as string;
    const visionParagraph2 = formData.get("visionParagraph2") as string;
    const whoIAmImageFile = formData.get("whoIAmImage") as File | null;
    const existingWhoIAmImage = formData.get("existingWhoIAmImage") as string;
    const journeyImageFile = formData.get("journeyImage") as File | null;
    const existingJourneyImage = formData.get("existingJourneyImage") as string;

    // Who I Am Section
    if (whoIAmTitle)
      updates.push({ section: "whoIAm", key: "title", value: whoIAmTitle });
    if (whoIAmParagraph1)
      updates.push({
        section: "whoIAm",
        key: "paragraph1",
        value: whoIAmParagraph1,
      });
    if (whoIAmParagraph2)
      updates.push({
        section: "whoIAm",
        key: "paragraph2",
        value: whoIAmParagraph2,
      });
    if (whoIAmParagraph3)
      updates.push({
        section: "whoIAm",
        key: "paragraph3",
        value: whoIAmParagraph3,
      });
    if (whoIAmParagraph4)
      updates.push({
        section: "whoIAm",
        key: "paragraph4",
        value: whoIAmParagraph4,
      });

    if (whoIAmImageFile && whoIAmImageFile.size > 0) {
      const imageUrl = await uploadFile(whoIAmImageFile, "whoIAm");
      updates.push({
        section: "whoIAm",
        key: "image",
        value: imageUrl,
        valueType: "image",
      });
    } else if (existingWhoIAmImage) {
      updates.push({
        section: "whoIAm",
        key: "image",
        value: existingWhoIAmImage,
        valueType: "image",
      });
    }

    // Journey Section
    if (journeyTitle)
      updates.push({ section: "journey", key: "title", value: journeyTitle });
    if (journeyParagraph1)
      updates.push({
        section: "journey",
        key: "paragraph1",
        value: journeyParagraph1,
      });
    if (journeyParagraph2)
      updates.push({
        section: "journey",
        key: "paragraph2",
        value: journeyParagraph2,
      });

    if (journeyImageFile && journeyImageFile.size > 0) {
      const imageUrl = await uploadFile(journeyImageFile, "journey");
      updates.push({
        section: "journey",
        key: "image",
        value: imageUrl,
        valueType: "image",
      });
    } else if (existingJourneyImage) {
      updates.push({
        section: "journey",
        key: "image",
        value: existingJourneyImage,
        valueType: "image",
      });
    }

    // Purpose Section
    if (purposeTitle)
      updates.push({ section: "purpose", key: "title", value: purposeTitle });
    if (purposeParagraph1)
      updates.push({
        section: "purpose",
        key: "paragraph1",
        value: purposeParagraph1,
      });
    if (purposeParagraph2)
      updates.push({
        section: "purpose",
        key: "paragraph2",
        value: purposeParagraph2,
      });
    if (purposeParagraph3)
      updates.push({
        section: "purpose",
        key: "paragraph3",
        value: purposeParagraph3,
      });

    // Mission & Vision Section
    if (missionTitle)
      updates.push({
        section: "missionVision",
        key: "missionTitle",
        value: missionTitle,
      });
    if (missionParagraph1)
      updates.push({
        section: "missionVision",
        key: "missionParagraph1",
        value: missionParagraph1,
      });
    if (missionParagraph2)
      updates.push({
        section: "missionVision",
        key: "missionParagraph2",
        value: missionParagraph2,
      });
    if (visionTitle)
      updates.push({
        section: "missionVision",
        key: "visionTitle",
        value: visionTitle,
      });
    if (visionParagraph1)
      updates.push({
        section: "missionVision",
        key: "visionParagraph1",
        value: visionParagraph1,
      });
    if (visionParagraph2)
      updates.push({
        section: "missionVision",
        key: "visionParagraph2",
        value: visionParagraph2,
      });

    await bulkUpdateAboutContent(updates);
    revalidatePath("/about");
    revalidatePath("/admin/pages/about");

    return { success: true, message: "About content updated successfully" };
  } catch (error) {
    console.error("Error updating about content:", error);
    return { success: false, message: "Failed to update about content" };
  }
}
