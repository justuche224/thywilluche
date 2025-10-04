import db from "@/db";
import { contactInfo } from "@/db/schema";

async function seedContactInfo() {
  const defaultData = [
    {
      key: "email",
      value: "hello@thywilluche.com",
      label: "Email",
      type: "contact",
    },
    {
      key: "phone",
      value: "+1 (234) 567-8900",
      label: "Phone",
      type: "contact",
    },
    {
      key: "address",
      value: "123 Main Street, City, State, ZIP",
      label: "Address",
      type: "contact",
    },
    {
      key: "facebook",
      value: "https://facebook.com/thywilluche",
      label: "Facebook",
      type: "social",
    },
    {
      key: "instagram",
      value: "https://instagram.com/thywilluche",
      label: "Instagram",
      type: "social",
    },
    {
      key: "x",
      value: "https://x.com/thywilluche",
      label: "X (Twitter)",
      type: "social",
    },
    {
      key: "youtube",
      value: "https://youtube.com/@thywilluche",
      label: "YouTube",
      type: "social",
    },
  ];

  console.log("Seeding contact info...");

  for (const item of defaultData) {
    await db.insert(contactInfo).values(item).onConflictDoNothing();
  }

  console.log("Contact info seeded successfully!");
}

seedContactInfo()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Error seeding contact info:", error);
    process.exit(1);
  });
