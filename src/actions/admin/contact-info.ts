"use server";

import { bulkUpdateContactInfo, getContactInfo } from "@/actions/contact-info";
import { revalidatePath } from "next/cache";

export async function updateContactInfoAction(formData: FormData) {
  try {
    const updates = [];

    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const address = formData.get("address") as string;

    const facebook = formData.get("facebook") as string;
    const instagram = formData.get("instagram") as string;
    const x = formData.get("x") as string;
    const youtube = formData.get("youtube") as string;

    if (email)
      updates.push({
        key: "email",
        value: email,
        label: "Email",
        type: "contact",
      });
    if (phone)
      updates.push({
        key: "phone",
        value: phone,
        label: "Phone",
        type: "contact",
      });
    if (address)
      updates.push({
        key: "address",
        value: address,
        label: "Address",
        type: "contact",
      });

    if (facebook)
      updates.push({
        key: "facebook",
        value: facebook,
        label: "Facebook",
        type: "social",
      });
    if (instagram)
      updates.push({
        key: "instagram",
        value: instagram,
        label: "Instagram",
        type: "social",
      });
    if (x)
      updates.push({
        key: "x",
        value: x,
        label: "X (Twitter)",
        type: "social",
      });
    if (youtube)
      updates.push({
        key: "youtube",
        value: youtube,
        label: "YouTube",
        type: "social",
      });

    await bulkUpdateContactInfo(updates);
    revalidatePath("/");
    revalidatePath("/admin/contact");

    return {
      success: true,
      message: "Contact information updated successfully",
    };
  } catch (error) {
    console.error("Error updating contact info:", error);
    return { success: false, message: "Failed to update contact information" };
  }
}

export { getContactInfo };
