import db from "@/db";
import { announcements } from "@/db/schema";

export async function seedAnnouncements() {
  console.log("Seeding announcements...");

  const defaultAnnouncements = [
    {
      title: "Welcome to Our Community!",
      content:
        "Welcome to our community! Please read our guidelines for posting and be respectful to other members.",
      link: "/community/guidelines",
    },
    {
      title: "New Book Release",
      content:
        "My new book is now available! Check it out in our shop or read more about it.",
      link: "/shop/books",
    }
  ];

  try {
    for (const announcement of defaultAnnouncements) {
      await db.insert(announcements).values({
        title: announcement.title,
        content: announcement.content,
        link: announcement.link,
        isActive: true,
      });
    }

    console.log("✅ Announcements seeded successfully");
  } catch (error) {
    console.error("❌ Error seeding announcements:", error);
    throw error;
  }
}
