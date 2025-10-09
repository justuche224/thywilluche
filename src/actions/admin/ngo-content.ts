"use server";

import { bulkUpdateNgoContent } from "@/actions/ngo-content";
import { uploadFile } from "@/lib/upload";
import { revalidatePath } from "next/cache";

export async function updateNgoContent(formData: FormData) {
  try {
    const updates = [];

    const heroTitle = formData.get("heroTitle") as string;
    const heroSubtitle = formData.get("heroSubtitle") as string;
    const heroDescription = formData.get("heroDescription") as string;
    const heroButton1Text = formData.get("heroButton1Text") as string;
    const heroButton2Text = formData.get("heroButton2Text") as string;
    const heroImageFile = formData.get("heroImage") as File | null;
    const existingHeroImage = formData.get("existingHeroImage") as string;

    const missionTitle = formData.get("missionTitle") as string;
    const missionDescription1 = formData.get("missionDescription1") as string;
    const missionDescription2 = formData.get("missionDescription2") as string;
    const missionImageFile = formData.get("missionImage") as File | null;
    const existingMissionImage = formData.get("existingMissionImage") as string;

    const visionTitle = formData.get("visionTitle") as string;
    const visionDescription1 = formData.get("visionDescription1") as string;
    const visionDescription2 = formData.get("visionDescription2") as string;
    const visionImageFile = formData.get("visionImage") as File | null;
    const existingVisionImage = formData.get("existingVisionImage") as string;

    const programsTitle = formData.get("programsTitle") as string;
    const programsSubtitle = formData.get("programsSubtitle") as string;

    const educationTitle = formData.get("educationTitle") as string;
    const educationDescription = formData.get("educationDescription") as string;
    const educationImageFile = formData.get("educationImage") as File | null;
    const existingEducationImage = formData.get(
      "existingEducationImage"
    ) as string;

    const healthcareTitle = formData.get("healthcareTitle") as string;
    const healthcareDescription = formData.get(
      "healthcareDescription"
    ) as string;
    const healthcareImageFile = formData.get("healthcareImage") as File | null;
    const existingHealthcareImage = formData.get(
      "existingHealthcareImage"
    ) as string;

    const developmentTitle = formData.get("developmentTitle") as string;
    const developmentDescription = formData.get(
      "developmentDescription"
    ) as string;
    const developmentImageFile = formData.get(
      "developmentImage"
    ) as File | null;
    const existingDevelopmentImage = formData.get(
      "existingDevelopmentImage"
    ) as string;

    const impactTitle = formData.get("impactTitle") as string;
    const impactSubtitle = formData.get("impactSubtitle") as string;
    const livesImpacted = formData.get("livesImpacted") as string;
    const communitiesServed = formData.get("communitiesServed") as string;
    const partnerOrganizations = formData.get("partnerOrganizations") as string;
    const yearsOfService = formData.get("yearsOfService") as string;
    const successStoriesTitle = formData.get("successStoriesTitle") as string;
    const successStory1 = formData.get("successStory1") as string;
    const successStory1Author = formData.get("successStory1Author") as string;
    const successStory2 = formData.get("successStory2") as string;
    const successStory2Author = formData.get("successStory2Author") as string;
    const impactImageFile = formData.get("impactImage") as File | null;
    const existingImpactImage = formData.get("existingImpactImage") as string;

    const ctaTitle = formData.get("ctaTitle") as string;
    const ctaDescription = formData.get("ctaDescription") as string;
    const ctaButton1Text = formData.get("ctaButton1Text") as string;
    const ctaButton2Text = formData.get("ctaButton2Text") as string;
    const ctaButton3Text = formData.get("ctaButton3Text") as string;

    if (heroTitle)
      updates.push({ section: "hero", key: "title", value: heroTitle });
    if (heroSubtitle)
      updates.push({ section: "hero", key: "subtitle", value: heroSubtitle });
    if (heroDescription)
      updates.push({
        section: "hero",
        key: "description",
        value: heroDescription,
      });
    if (heroButton1Text)
      updates.push({
        section: "hero",
        key: "button1Text",
        value: heroButton1Text,
      });
    if (heroButton2Text)
      updates.push({
        section: "hero",
        key: "button2Text",
        value: heroButton2Text,
      });

    if (heroImageFile && heroImageFile.size > 0) {
      const imageUrl = await uploadFile(heroImageFile, "ngo-hero");
      updates.push({
        section: "hero",
        key: "image",
        value: imageUrl,
        valueType: "image",
      });
    } else if (existingHeroImage) {
      updates.push({
        section: "hero",
        key: "image",
        value: existingHeroImage,
        valueType: "image",
      });
    }

    if (missionTitle)
      updates.push({ section: "mission", key: "title", value: missionTitle });
    if (missionDescription1)
      updates.push({
        section: "mission",
        key: "description1",
        value: missionDescription1,
      });
    if (missionDescription2)
      updates.push({
        section: "mission",
        key: "description2",
        value: missionDescription2,
      });

    if (missionImageFile && missionImageFile.size > 0) {
      const imageUrl = await uploadFile(missionImageFile, "ngo-mission");
      updates.push({
        section: "mission",
        key: "image",
        value: imageUrl,
        valueType: "image",
      });
    } else if (existingMissionImage) {
      updates.push({
        section: "mission",
        key: "image",
        value: existingMissionImage,
        valueType: "image",
      });
    }

    if (visionTitle)
      updates.push({ section: "vision", key: "title", value: visionTitle });
    if (visionDescription1)
      updates.push({
        section: "vision",
        key: "description1",
        value: visionDescription1,
      });
    if (visionDescription2)
      updates.push({
        section: "vision",
        key: "description2",
        value: visionDescription2,
      });

    if (visionImageFile && visionImageFile.size > 0) {
      const imageUrl = await uploadFile(visionImageFile, "ngo-vision");
      updates.push({
        section: "vision",
        key: "image",
        value: imageUrl,
        valueType: "image",
      });
    } else if (existingVisionImage) {
      updates.push({
        section: "vision",
        key: "image",
        value: existingVisionImage,
        valueType: "image",
      });
    }

    if (programsTitle)
      updates.push({ section: "programs", key: "title", value: programsTitle });
    if (programsSubtitle)
      updates.push({
        section: "programs",
        key: "subtitle",
        value: programsSubtitle,
      });

    if (educationTitle)
      updates.push({
        section: "education",
        key: "title",
        value: educationTitle,
      });
    if (educationDescription)
      updates.push({
        section: "education",
        key: "description",
        value: educationDescription,
      });

    if (educationImageFile && educationImageFile.size > 0) {
      const imageUrl = await uploadFile(educationImageFile, "ngo-education");
      updates.push({
        section: "education",
        key: "image",
        value: imageUrl,
        valueType: "image",
      });
    } else if (existingEducationImage) {
      updates.push({
        section: "education",
        key: "image",
        value: existingEducationImage,
        valueType: "image",
      });
    }

    if (healthcareTitle)
      updates.push({
        section: "healthcare",
        key: "title",
        value: healthcareTitle,
      });
    if (healthcareDescription)
      updates.push({
        section: "healthcare",
        key: "description",
        value: healthcareDescription,
      });

    if (healthcareImageFile && healthcareImageFile.size > 0) {
      const imageUrl = await uploadFile(healthcareImageFile, "ngo-healthcare");
      updates.push({
        section: "healthcare",
        key: "image",
        value: imageUrl,
        valueType: "image",
      });
    } else if (existingHealthcareImage) {
      updates.push({
        section: "healthcare",
        key: "image",
        value: existingHealthcareImage,
        valueType: "image",
      });
    }

    if (developmentTitle)
      updates.push({
        section: "development",
        key: "title",
        value: developmentTitle,
      });
    if (developmentDescription)
      updates.push({
        section: "development",
        key: "description",
        value: developmentDescription,
      });

    if (developmentImageFile && developmentImageFile.size > 0) {
      const imageUrl = await uploadFile(
        developmentImageFile,
        "ngo-development"
      );
      updates.push({
        section: "development",
        key: "image",
        value: imageUrl,
        valueType: "image",
      });
    } else if (existingDevelopmentImage) {
      updates.push({
        section: "development",
        key: "image",
        value: existingDevelopmentImage,
        valueType: "image",
      });
    }

    if (impactTitle)
      updates.push({ section: "impact", key: "title", value: impactTitle });
    if (impactSubtitle)
      updates.push({
        section: "impact",
        key: "subtitle",
        value: impactSubtitle,
      });
    if (livesImpacted)
      updates.push({
        section: "impact",
        key: "livesImpacted",
        value: livesImpacted,
      });
    if (communitiesServed)
      updates.push({
        section: "impact",
        key: "communitiesServed",
        value: communitiesServed,
      });
    if (partnerOrganizations)
      updates.push({
        section: "impact",
        key: "partnerOrganizations",
        value: partnerOrganizations,
      });
    if (yearsOfService)
      updates.push({
        section: "impact",
        key: "yearsOfService",
        value: yearsOfService,
      });
    if (successStoriesTitle)
      updates.push({
        section: "impact",
        key: "successStoriesTitle",
        value: successStoriesTitle,
      });
    if (successStory1)
      updates.push({
        section: "impact",
        key: "successStory1",
        value: successStory1,
      });
    if (successStory1Author)
      updates.push({
        section: "impact",
        key: "successStory1Author",
        value: successStory1Author,
      });
    if (successStory2)
      updates.push({
        section: "impact",
        key: "successStory2",
        value: successStory2,
      });
    if (successStory2Author)
      updates.push({
        section: "impact",
        key: "successStory2Author",
        value: successStory2Author,
      });

    if (impactImageFile && impactImageFile.size > 0) {
      const imageUrl = await uploadFile(impactImageFile, "ngo-impact");
      updates.push({
        section: "impact",
        key: "image",
        value: imageUrl,
        valueType: "image",
      });
    } else if (existingImpactImage) {
      updates.push({
        section: "impact",
        key: "image",
        value: existingImpactImage,
        valueType: "image",
      });
    }

    if (ctaTitle)
      updates.push({ section: "cta", key: "title", value: ctaTitle });
    if (ctaDescription)
      updates.push({
        section: "cta",
        key: "description",
        value: ctaDescription,
      });
    if (ctaButton1Text)
      updates.push({
        section: "cta",
        key: "button1Text",
        value: ctaButton1Text,
      });
    if (ctaButton2Text)
      updates.push({
        section: "cta",
        key: "button2Text",
        value: ctaButton2Text,
      });
    if (ctaButton3Text)
      updates.push({
        section: "cta",
        key: "button3Text",
        value: ctaButton3Text,
      });

    await bulkUpdateNgoContent(updates);
    revalidatePath("/ngo");
    revalidatePath("/admin/pages/ngo");

    return { success: true, message: "NGO content updated successfully" };
  } catch (error) {
    console.error("Error updating NGO content:", error);
    return { success: false, message: "Failed to update NGO content" };
  }
}
