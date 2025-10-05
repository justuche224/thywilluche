"use server";

import {
  bulkUpdateServiceContent,
  getServiceSection,
} from "@/actions/services-content";
import { uploadFile } from "@/lib/upload";
import { revalidatePath } from "next/cache";

export async function updateCoachingContent(formData: FormData) {
  try {
    const updates = [];

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const heroImageFile = formData.get("heroImage") as File | null;
    const existingHeroImage = formData.get("existingHeroImage") as string;
    const whatToExpectTitle = formData.get("whatToExpectTitle") as string;
    const whatToExpectSubtitle = formData.get("whatToExpectSubtitle") as string;
    const strategyTitle = formData.get("strategyTitle") as string;
    const strategyDescription = formData.get("strategyDescription") as string;
    const toolsTitle = formData.get("toolsTitle") as string;
    const toolsDescription = formData.get("toolsDescription") as string;
    const accountabilityTitle = formData.get("accountabilityTitle") as string;
    const accountabilityDescription = formData.get(
      "accountabilityDescription"
    ) as string;
    const safeSpaceTitle = formData.get("safeSpaceTitle") as string;
    const safeSpaceDescription = formData.get("safeSpaceDescription") as string;
    const whoThisIsForTitle = formData.get("whoThisIsForTitle") as string;
    const whoThisIsForDescription1 = formData.get(
      "whoThisIsForDescription1"
    ) as string;
    const whoThisIsForDescription2 = formData.get(
      "whoThisIsForDescription2"
    ) as string;

    if (title)
      updates.push({ section: "coaching", key: "title", value: title });
    if (description)
      updates.push({
        section: "coaching",
        key: "description",
        value: description,
      });
    if (whatToExpectTitle)
      updates.push({
        section: "coaching",
        key: "whatToExpectTitle",
        value: whatToExpectTitle,
      });
    if (whatToExpectSubtitle)
      updates.push({
        section: "coaching",
        key: "whatToExpectSubtitle",
        value: whatToExpectSubtitle,
      });
    if (strategyTitle)
      updates.push({
        section: "coaching",
        key: "strategyTitle",
        value: strategyTitle,
      });
    if (strategyDescription)
      updates.push({
        section: "coaching",
        key: "strategyDescription",
        value: strategyDescription,
      });
    if (toolsTitle)
      updates.push({
        section: "coaching",
        key: "toolsTitle",
        value: toolsTitle,
      });
    if (toolsDescription)
      updates.push({
        section: "coaching",
        key: "toolsDescription",
        value: toolsDescription,
      });
    if (accountabilityTitle)
      updates.push({
        section: "coaching",
        key: "accountabilityTitle",
        value: accountabilityTitle,
      });
    if (accountabilityDescription)
      updates.push({
        section: "coaching",
        key: "accountabilityDescription",
        value: accountabilityDescription,
      });
    if (safeSpaceTitle)
      updates.push({
        section: "coaching",
        key: "safeSpaceTitle",
        value: safeSpaceTitle,
      });
    if (safeSpaceDescription)
      updates.push({
        section: "coaching",
        key: "safeSpaceDescription",
        value: safeSpaceDescription,
      });
    if (whoThisIsForTitle)
      updates.push({
        section: "coaching",
        key: "whoThisIsForTitle",
        value: whoThisIsForTitle,
      });
    if (whoThisIsForDescription1)
      updates.push({
        section: "coaching",
        key: "whoThisIsForDescription1",
        value: whoThisIsForDescription1,
      });
    if (whoThisIsForDescription2)
      updates.push({
        section: "coaching",
        key: "whoThisIsForDescription2",
        value: whoThisIsForDescription2,
      });

    if (heroImageFile && heroImageFile.size > 0) {
      const imageUrl = await uploadFile(heroImageFile, "coaching");
      updates.push({
        section: "coaching",
        key: "heroImage",
        value: imageUrl,
        valueType: "image",
      });
    } else if (existingHeroImage) {
      updates.push({
        section: "coaching",
        key: "heroImage",
        value: existingHeroImage,
        valueType: "image",
      });
    }

    await bulkUpdateServiceContent(updates);
    revalidatePath("/services/coaching");
    revalidatePath("/admin/pages/services");

    return { success: true, message: "Coaching content updated successfully" };
  } catch (error) {
    console.error("Error updating coaching content:", error);
    return { success: false, message: "Failed to update coaching content" };
  }
}

export async function updateGhostwritingContent(formData: FormData) {
  try {
    const updates = [];

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const heroImageFile = formData.get("heroImage") as File | null;
    const existingHeroImage = formData.get("existingHeroImage") as string;
    const whatToExpectTitle = formData.get("whatToExpectTitle") as string;
    const whatToExpectSubtitle = formData.get("whatToExpectSubtitle") as string;
    const processTitle = formData.get("processTitle") as string;
    const processDescription = formData.get("processDescription") as string;
    const collaborationTitle = formData.get("collaborationTitle") as string;
    const collaborationDescription = formData.get(
      "collaborationDescription"
    ) as string;
    const qualityTitle = formData.get("qualityTitle") as string;
    const qualityDescription = formData.get("qualityDescription") as string;
    const confidentialityTitle = formData.get("confidentialityTitle") as string;
    const confidentialityDescription = formData.get(
      "confidentialityDescription"
    ) as string;
    const whoThisIsForTitle = formData.get("whoThisIsForTitle") as string;
    const whoThisIsForDescription1 = formData.get(
      "whoThisIsForDescription1"
    ) as string;
    const whoThisIsForDescription2 = formData.get(
      "whoThisIsForDescription2"
    ) as string;

    if (title)
      updates.push({ section: "ghostwriting", key: "title", value: title });
    if (description)
      updates.push({
        section: "ghostwriting",
        key: "description",
        value: description,
      });
    if (whatToExpectTitle)
      updates.push({
        section: "ghostwriting",
        key: "whatToExpectTitle",
        value: whatToExpectTitle,
      });
    if (whatToExpectSubtitle)
      updates.push({
        section: "ghostwriting",
        key: "whatToExpectSubtitle",
        value: whatToExpectSubtitle,
      });
    if (processTitle)
      updates.push({
        section: "ghostwriting",
        key: "processTitle",
        value: processTitle,
      });
    if (processDescription)
      updates.push({
        section: "ghostwriting",
        key: "processDescription",
        value: processDescription,
      });
    if (collaborationTitle)
      updates.push({
        section: "ghostwriting",
        key: "collaborationTitle",
        value: collaborationTitle,
      });
    if (collaborationDescription)
      updates.push({
        section: "ghostwriting",
        key: "collaborationDescription",
        value: collaborationDescription,
      });
    if (qualityTitle)
      updates.push({
        section: "ghostwriting",
        key: "qualityTitle",
        value: qualityTitle,
      });
    if (qualityDescription)
      updates.push({
        section: "ghostwriting",
        key: "qualityDescription",
        value: qualityDescription,
      });
    if (confidentialityTitle)
      updates.push({
        section: "ghostwriting",
        key: "confidentialityTitle",
        value: confidentialityTitle,
      });
    if (confidentialityDescription)
      updates.push({
        section: "ghostwriting",
        key: "confidentialityDescription",
        value: confidentialityDescription,
      });
    if (whoThisIsForTitle)
      updates.push({
        section: "ghostwriting",
        key: "whoThisIsForTitle",
        value: whoThisIsForTitle,
      });
    if (whoThisIsForDescription1)
      updates.push({
        section: "ghostwriting",
        key: "whoThisIsForDescription1",
        value: whoThisIsForDescription1,
      });
    if (whoThisIsForDescription2)
      updates.push({
        section: "ghostwriting",
        key: "whoThisIsForDescription2",
        value: whoThisIsForDescription2,
      });

    if (heroImageFile && heroImageFile.size > 0) {
      const imageUrl = await uploadFile(heroImageFile, "ghostwriting");
      updates.push({
        section: "ghostwriting",
        key: "heroImage",
        value: imageUrl,
        valueType: "image",
      });
    } else if (existingHeroImage) {
      updates.push({
        section: "ghostwriting",
        key: "heroImage",
        value: existingHeroImage,
        valueType: "image",
      });
    }

    await bulkUpdateServiceContent(updates);
    revalidatePath("/services/ghostwriting");
    revalidatePath("/admin/pages/services");

    return {
      success: true,
      message: "Ghostwriting content updated successfully",
    };
  } catch (error) {
    console.error("Error updating ghostwriting content:", error);
    return { success: false, message: "Failed to update ghostwriting content" };
  }
}

export async function updateConsultingContent(formData: FormData) {
  try {
    const updates = [];

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const heroImageFile = formData.get("heroImage") as File | null;
    const existingHeroImage = formData.get("existingHeroImage") as string;
    const whatToExpectTitle = formData.get("whatToExpectTitle") as string;
    const whatToExpectSubtitle = formData.get("whatToExpectSubtitle") as string;
    const strategyTitle = formData.get("strategyTitle") as string;
    const strategyDescription = formData.get("strategyDescription") as string;
    const implementationTitle = formData.get("implementationTitle") as string;
    const implementationDescription = formData.get(
      "implementationDescription"
    ) as string;
    const supportTitle = formData.get("supportTitle") as string;
    const supportDescription = formData.get("supportDescription") as string;
    const resultsTitle = formData.get("resultsTitle") as string;
    const resultsDescription = formData.get("resultsDescription") as string;
    const whoThisIsForTitle = formData.get("whoThisIsForTitle") as string;
    const whoThisIsForDescription1 = formData.get(
      "whoThisIsForDescription1"
    ) as string;
    const whoThisIsForDescription2 = formData.get(
      "whoThisIsForDescription2"
    ) as string;

    if (title)
      updates.push({ section: "consulting", key: "title", value: title });
    if (description)
      updates.push({
        section: "consulting",
        key: "description",
        value: description,
      });
    if (whatToExpectTitle)
      updates.push({
        section: "consulting",
        key: "whatToExpectTitle",
        value: whatToExpectTitle,
      });
    if (whatToExpectSubtitle)
      updates.push({
        section: "consulting",
        key: "whatToExpectSubtitle",
        value: whatToExpectSubtitle,
      });
    if (strategyTitle)
      updates.push({
        section: "consulting",
        key: "strategyTitle",
        value: strategyTitle,
      });
    if (strategyDescription)
      updates.push({
        section: "consulting",
        key: "strategyDescription",
        value: strategyDescription,
      });
    if (implementationTitle)
      updates.push({
        section: "consulting",
        key: "implementationTitle",
        value: implementationTitle,
      });
    if (implementationDescription)
      updates.push({
        section: "consulting",
        key: "implementationDescription",
        value: implementationDescription,
      });
    if (supportTitle)
      updates.push({
        section: "consulting",
        key: "supportTitle",
        value: supportTitle,
      });
    if (supportDescription)
      updates.push({
        section: "consulting",
        key: "supportDescription",
        value: supportDescription,
      });
    if (resultsTitle)
      updates.push({
        section: "consulting",
        key: "resultsTitle",
        value: resultsTitle,
      });
    if (resultsDescription)
      updates.push({
        section: "consulting",
        key: "resultsDescription",
        value: resultsDescription,
      });
    if (whoThisIsForTitle)
      updates.push({
        section: "consulting",
        key: "whoThisIsForTitle",
        value: whoThisIsForTitle,
      });
    if (whoThisIsForDescription1)
      updates.push({
        section: "consulting",
        key: "whoThisIsForDescription1",
        value: whoThisIsForDescription1,
      });
    if (whoThisIsForDescription2)
      updates.push({
        section: "consulting",
        key: "whoThisIsForDescription2",
        value: whoThisIsForDescription2,
      });

    if (heroImageFile && heroImageFile.size > 0) {
      const imageUrl = await uploadFile(heroImageFile, "consulting");
      updates.push({
        section: "consulting",
        key: "heroImage",
        value: imageUrl,
        valueType: "image",
      });
    } else if (existingHeroImage) {
      updates.push({
        section: "consulting",
        key: "heroImage",
        value: existingHeroImage,
        valueType: "image",
      });
    }

    await bulkUpdateServiceContent(updates);
    revalidatePath("/services/consulting");
    revalidatePath("/admin/pages/services");

    return {
      success: true,
      message: "Consulting content updated successfully",
    };
  } catch (error) {
    console.error("Error updating consulting content:", error);
    return { success: false, message: "Failed to update consulting content" };
  }
}

export async function updateServicesOverviewContent(formData: FormData) {
  try {
    const updates = [];

    const title = formData.get("title") as string;
    const subtitle = formData.get("subtitle") as string;
    const coachingTitle = formData.get("coachingTitle") as string;
    const coachingDescription = formData.get("coachingDescription") as string;
    const coachingImageFile = formData.get("coachingImage") as File | null;
    const existingCoachingImage = formData.get(
      "existingCoachingImage"
    ) as string;
    const ghostwritingTitle = formData.get("ghostwritingTitle") as string;
    const ghostwritingDescription = formData.get(
      "ghostwritingDescription"
    ) as string;
    const ghostwritingImageFile = formData.get(
      "ghostwritingImage"
    ) as File | null;
    const existingGhostwritingImage = formData.get(
      "existingGhostwritingImage"
    ) as string;
    const consultingTitle = formData.get("consultingTitle") as string;
    const consultingDescription = formData.get(
      "consultingDescription"
    ) as string;
    const consultingImageFile = formData.get("consultingImage") as File | null;
    const existingConsultingImage = formData.get(
      "existingConsultingImage"
    ) as string;
    const ctaTitle = formData.get("ctaTitle") as string;
    const ctaDescription = formData.get("ctaDescription") as string;
    const ctaButtonText = formData.get("ctaButtonText") as string;

    if (title)
      updates.push({ section: "overview", key: "title", value: title });
    if (subtitle)
      updates.push({ section: "overview", key: "subtitle", value: subtitle });
    if (coachingTitle)
      updates.push({
        section: "overview",
        key: "coachingTitle",
        value: coachingTitle,
      });
    if (coachingDescription)
      updates.push({
        section: "overview",
        key: "coachingDescription",
        value: coachingDescription,
      });
    if (ghostwritingTitle)
      updates.push({
        section: "overview",
        key: "ghostwritingTitle",
        value: ghostwritingTitle,
      });
    if (ghostwritingDescription)
      updates.push({
        section: "overview",
        key: "ghostwritingDescription",
        value: ghostwritingDescription,
      });
    if (consultingTitle)
      updates.push({
        section: "overview",
        key: "consultingTitle",
        value: consultingTitle,
      });
    if (consultingDescription)
      updates.push({
        section: "overview",
        key: "consultingDescription",
        value: consultingDescription,
      });
    if (ctaTitle)
      updates.push({ section: "overview", key: "ctaTitle", value: ctaTitle });
    if (ctaDescription)
      updates.push({
        section: "overview",
        key: "ctaDescription",
        value: ctaDescription,
      });
    if (ctaButtonText)
      updates.push({
        section: "overview",
        key: "ctaButtonText",
        value: ctaButtonText,
      });

    if (coachingImageFile && coachingImageFile.size > 0) {
      const imageUrl = await uploadFile(coachingImageFile, "services");
      updates.push({
        section: "overview",
        key: "coachingImage",
        value: imageUrl,
        valueType: "image",
      });
    } else if (existingCoachingImage) {
      updates.push({
        section: "overview",
        key: "coachingImage",
        value: existingCoachingImage,
        valueType: "image",
      });
    }

    if (ghostwritingImageFile && ghostwritingImageFile.size > 0) {
      const imageUrl = await uploadFile(ghostwritingImageFile, "services");
      updates.push({
        section: "overview",
        key: "ghostwritingImage",
        value: imageUrl,
        valueType: "image",
      });
    } else if (existingGhostwritingImage) {
      updates.push({
        section: "overview",
        key: "ghostwritingImage",
        value: existingGhostwritingImage,
        valueType: "image",
      });
    }

    if (consultingImageFile && consultingImageFile.size > 0) {
      const imageUrl = await uploadFile(consultingImageFile, "services");
      updates.push({
        section: "overview",
        key: "consultingImage",
        value: imageUrl,
        valueType: "image",
      });
    } else if (existingConsultingImage) {
      updates.push({
        section: "overview",
        key: "consultingImage",
        value: existingConsultingImage,
        valueType: "image",
      });
    }

    await bulkUpdateServiceContent(updates);
    revalidatePath("/services");
    revalidatePath("/admin/pages/services");

    return {
      success: true,
      message: "Services overview content updated successfully",
    };
  } catch (error) {
    console.error("Error updating services overview content:", error);
    return {
      success: false,
      message: "Failed to update services overview content",
    };
  }
}

export { getServiceSection };
