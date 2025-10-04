import db from "@/db";
import { aboutContent } from "@/db/schema";

async function seedAboutContent() {
  const defaultData = [
    // Journey Section
    {
      section: "journey",
      key: "image",
      value: "/images/IMG_20240828_162619[1].jpg",
      valueType: "image",
    },
    {
      section: "journey",
      key: "title",
      value: "My Journey",
      valueType: "text",
    },
    {
      section: "journey",
      key: "paragraph1",
      value:
        "From the depths of personal struggle to becoming a beacon of hope for thousands, my journey has been one of transformation, resilience, and unwavering commitment to living authentically.",
      valueType: "text",
    },
    {
      section: "journey",
      key: "paragraph2",
      value:
        "Growing up, I faced challenges that tested my spirit and questioned my path. Mental health struggles, moments of doubt, and the weight of unexpressed emotions shaped me into someone who understands the power of vulnerability and the strength found in community.",
      valueType: "text",
    },

    // Mission & Vision Section - Mission
    {
      section: "missionVision",
      key: "missionTitle",
      value: "Our Mission",
      valueType: "text",
    },
    {
      section: "missionVision",
      key: "missionParagraph1",
      value:
        "To empower individuals worldwide to embrace their mental health journey with courage, compassion, and community. We believe that every person deserves to live authentically, heal from their past, and find strength in their daily victories.",
      valueType: "text",
    },
    {
      section: "missionVision",
      key: "missionParagraph2",
      value:
        "Through storytelling, education, and meaningful connections, we create safe spaces where vulnerability becomes strength and isolation transforms into belonging.",
      valueType: "text",
    },

    // Mission & Vision Section - Vision
    {
      section: "missionVision",
      key: "visionTitle",
      value: "Our Vision",
      valueType: "text",
    },
    {
      section: "missionVision",
      key: "visionParagraph1",
      value:
        "A world where mental health conversations flow as naturally as breathing, where every individual feels seen, heard, and supported in their journey toward healing and self-discovery.",
      valueType: "text",
    },
    {
      section: "missionVision",
      key: "visionParagraph2",
      value:
        "We envision communities built on empathy, where personal stories become catalysts for collective transformation, and where the simple act of showing up becomes the greatest victory of all.",
      valueType: "text",
    },
  ];

  console.log("Seeding about content...");

  for (const item of defaultData) {
    await db.insert(aboutContent).values(item).onConflictDoNothing();
  }

  console.log("About content seeded successfully!");
}

seedAboutContent()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Error seeding about content:", error);
    process.exit(1);
  });
