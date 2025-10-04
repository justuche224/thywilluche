import db from "@/db";
import { homeContent } from "@/db/schema";

async function seedHomeContent() {
  const defaultData = [
    { section: "hero", key: "title1", value: "365 TIPS,", valueType: "text" },
    { section: "hero", key: "title2", value: "365 WINS,", valueType: "text" },
    {
      section: "hero",
      key: "title3",
      value: "EVERY DAY IS VICTORY",
      valueType: "text",
    },
    {
      section: "hero",
      key: "tagline1",
      value: "Connecting hearts.",
      valueType: "text",
    },
    {
      section: "hero",
      key: "tagline2",
      value: "Uplifting minds.",
      valueType: "text",
    },
    {
      section: "hero",
      key: "tagline3",
      value: "Living one day at a time.",
      valueType: "text",
    },
    {
      section: "hero",
      key: "description",
      value:
        "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Itaque voluptatem possimus praesentium. Voluptatum quod ea, eligendi velit quam voluptate, iusto quia sequi, sapiente sit suscipit enim! Temporibus ex ipsa nam.",
      valueType: "text",
    },
    {
      section: "hero",
      key: "heroImage",
      value: "/images/IMG_20240828_162759[1].jpg",
      valueType: "image",
    },
    {
      section: "hero",
      key: "ctaText",
      value: "Explore Works",
      valueType: "text",
    },
    { section: "hero", key: "ctaLink", value: "#", valueType: "text" },
    { section: "whoIAm", key: "title", value: "Who I Am", valueType: "text" },
    {
      section: "whoIAm",
      key: "description",
      value:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam cum officiis officia, aspernatur deleniti velit vitae facilis, provident labore debitis, quidem dignissimos eius. Animi est molestiae dolor. Odio, aperiam commodi? Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam cum officiis officia, aspernatur deleniti velit vitae facilis, provident labore debitis, quidem dignissimos eius. Animi est molestiae dolor. Odio, aperiam commodi?",
      valueType: "text",
    },
    {
      section: "whoIAm",
      key: "image",
      value: "/images/IMG_20240828_162619[1].jpg",
      valueType: "image",
    },
  ];

  console.log("Seeding home content...");

  for (const item of defaultData) {
    await db.insert(homeContent).values(item).onConflictDoNothing();
  }

  console.log("Home content seeded successfully!");
}

seedHomeContent()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Error seeding home content:", error);
    process.exit(1);
  });
