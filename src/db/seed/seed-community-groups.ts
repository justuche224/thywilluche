import db from "@/db";
import { communityGroups } from "@/db/schema";

async function seedCommunityGroups() {
  const defaultGroups = [
    {
      name: "Poetry",
      slug: "poetry",
      type: "Poetry",
      description: "Share your poems, verses, and poetic expressions",
      imageUrl: null,
      isActive: true,
    },
    {
      name: "Lifestyle",
      slug: "lifestyle",
      type: "Lifestyle",
      description: "Discuss daily life, wellness, and lifestyle topics",
      imageUrl: null,
      isActive: true,
    },
    {
      name: "Coaching",
      slug: "coaching",
      type: "Coaching",
      description: "Get motivated, share success stories, and grow together",
      imageUrl: null,
      isActive: true,
    },
    {
      name: "Writers' Corner",
      slug: "writers-corner",
      type: "Writers' Corner",
      description: "A space for writers to share their craft and get feedback",
      imageUrl: null,
      isActive: true,
    },
  ];

  console.log("Seeding community groups...");

  for (const group of defaultGroups) {
    await db.insert(communityGroups).values(group).onConflictDoNothing();
  }

  console.log("Community groups seeded successfully!");
}

seedCommunityGroups()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Error seeding community groups:", error);
    process.exit(1);
  });
