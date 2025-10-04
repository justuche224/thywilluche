"use server";

import { bulkUpdateHomeContent, getHomeSection } from "@/actions/home-content";
import { uploadFile } from "@/lib/upload";
import { revalidatePath } from "next/cache";

export async function updateHeroContent(formData: FormData) {
  try {
    const updates = [];

    const title1 = formData.get("title1") as string;
    const title2 = formData.get("title2") as string;
    const title3 = formData.get("title3") as string;
    const tagline1 = formData.get("tagline1") as string;
    const tagline2 = formData.get("tagline2") as string;
    const tagline3 = formData.get("tagline3") as string;
    const description = formData.get("description") as string;
    const ctaText = formData.get("ctaText") as string;
    const ctaLink = formData.get("ctaLink") as string;
    const heroImageFile = formData.get("heroImage") as File | null;
    const existingHeroImage = formData.get("existingHeroImage") as string;

    if (title1) updates.push({ section: "hero", key: "title1", value: title1 });
    if (title2) updates.push({ section: "hero", key: "title2", value: title2 });
    if (title3) updates.push({ section: "hero", key: "title3", value: title3 });
    if (tagline1)
      updates.push({ section: "hero", key: "tagline1", value: tagline1 });
    if (tagline2)
      updates.push({ section: "hero", key: "tagline2", value: tagline2 });
    if (tagline3)
      updates.push({ section: "hero", key: "tagline3", value: tagline3 });
    if (description)
      updates.push({ section: "hero", key: "description", value: description });
    if (ctaText)
      updates.push({ section: "hero", key: "ctaText", value: ctaText });
    if (ctaLink)
      updates.push({ section: "hero", key: "ctaLink", value: ctaLink });

    if (heroImageFile && heroImageFile.size > 0) {
      const imageUrl = await uploadFile(heroImageFile, "hero");
      updates.push({
        section: "hero",
        key: "heroImage",
        value: imageUrl,
        valueType: "image",
      });
    } else if (existingHeroImage) {
      updates.push({
        section: "hero",
        key: "heroImage",
        value: existingHeroImage,
        valueType: "image",
      });
    }

    await bulkUpdateHomeContent(updates);
    revalidatePath("/");
    revalidatePath("/admin/pages/home");

    return { success: true, message: "Hero content updated successfully" };
  } catch (error) {
    console.error("Error updating hero content:", error);
    return { success: false, message: "Failed to update hero content" };
  }
}

export async function updateWhoIAmContent(formData: FormData) {
  try {
    const updates = [];

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const imageFile = formData.get("image") as File | null;
    const existingImage = formData.get("existingImage") as string;

    if (title) updates.push({ section: "whoIAm", key: "title", value: title });
    if (description)
      updates.push({
        section: "whoIAm",
        key: "description",
        value: description,
      });

    if (imageFile && imageFile.size > 0) {
      const imageUrl = await uploadFile(imageFile, "whoiam");
      updates.push({
        section: "whoIAm",
        key: "image",
        value: imageUrl,
        valueType: "image",
      });
    } else if (existingImage) {
      updates.push({
        section: "whoIAm",
        key: "image",
        value: existingImage,
        valueType: "image",
      });
    }

    await bulkUpdateHomeContent(updates);
    revalidatePath("/");
    revalidatePath("/admin/pages/home");

    return { success: true, message: "Who I Am content updated successfully" };
  } catch (error) {
    console.error("Error updating Who I Am content:", error);
    return { success: false, message: "Failed to update Who I Am content" };
  }
}

export async function updateFeaturedContent(formData: FormData) {
  try {
    const updates = [];

    const title = formData.get("title") as string;
    const quote = formData.get("quote") as string;
    const description = formData.get("description") as string;
    const image1File = formData.get("image1") as File | null;
    const image2File = formData.get("image2") as File | null;
    const existingImage1 = formData.get("existingImage1") as string;
    const existingImage2 = formData.get("existingImage2") as string;

    if (title)
      updates.push({ section: "featured", key: "title", value: title });
    if (quote)
      updates.push({ section: "featured", key: "quote", value: quote });
    if (description)
      updates.push({
        section: "featured",
        key: "description",
        value: description,
      });

    if (image1File && image1File.size > 0) {
      const imageUrl = await uploadFile(image1File, "featured");
      updates.push({
        section: "featured",
        key: "image1",
        value: imageUrl,
        valueType: "image",
      });
    } else if (existingImage1) {
      updates.push({
        section: "featured",
        key: "image1",
        value: existingImage1,
        valueType: "image",
      });
    }

    if (image2File && image2File.size > 0) {
      const imageUrl = await uploadFile(image2File, "featured");
      updates.push({
        section: "featured",
        key: "image2",
        value: imageUrl,
        valueType: "image",
      });
    } else if (existingImage2) {
      updates.push({
        section: "featured",
        key: "image2",
        value: existingImage2,
        valueType: "image",
      });
    }

    await bulkUpdateHomeContent(updates);
    revalidatePath("/");
    revalidatePath("/admin/pages/home");

    return {
      success: true,
      message: "Featured content updated successfully",
    };
  } catch (error) {
    console.error("Error updating Featured content:", error);
    return { success: false, message: "Failed to update Featured content" };
  }
}

export { getHomeSection };
