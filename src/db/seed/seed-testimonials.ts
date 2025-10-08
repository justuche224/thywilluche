import db from "@/db";
import { testimonials } from "@/db/schema";

const testimonialsData = [
  {
    name: "Aisha L.",
    location: "Lagos, Nigeria",
    quote:
      "Thywill just gets it. I feel motivated every time we talk—like I can actually do the things I've been dreaming about.",
    rating: 5,
  },
  {
    name: "Daniel K.",
    location: "Accra, Ghana",
    quote:
      "I never knew coaching could feel this personal. Thywill helped me see my potential in a whole new way.",
    rating: 5,
  },
  {
    name: "Zanele M.",
    location: "Johannesburg, South Africa",
    quote:
      "I joined his writing community and now I'm actually finishing projects! Feels amazing to be part of something real.",
    rating: 5,
  },
  {
    name: "Chuka N.",
    location: "Abuja, Nigeria",
    quote:
      "I feel like a weight has been lifted. Thywill's advice is simple, but it sticks—and it works.",
    rating: 5,
  },
  {
    name: "Leah S.",
    location: "Nairobi, Kenya",
    quote:
      "Creative ideas used to scare me, but Thywill showed me how to turn them into action. Love it!",
    rating: 5,
  },
  {
    name: "Kojo B.",
    location: "Kumasi, Ghana",
    quote:
      "It's rare to meet someone who genuinely wants you to grow. Thywill does that, every session.",
    rating: 5,
  },
  {
    name: "Anita P.",
    location: "Enugu, Nigeria",
    quote:
      "I'm finally finishing my book and feeling confident about it. Couldn't have done it without him!",
    rating: 5,
  },
  {
    name: "Tomiwa J.",
    location: "Ibadan, Nigeria",
    quote:
      "Every session leaves me inspired. Thywill doesn't just talk—he helps you actually change.",
    rating: 5,
  },
  {
    name: "Ama T.",
    location: "Cape Town, South Africa",
    quote:
      "Joining Thywill's community was the best decision ever. Supportive, motivating, real.",
    rating: 5,
  },
  {
    name: "Chinedu O.",
    location: "Ebonyi, Nigeria",
    quote:
      "Thywill's coaching is practical, encouraging, and uplifting. I see myself growing every week.",
    rating: 5,
  },
  {
    name: "Beatrix Holeck",
    location: "Berkshire, United Kingdom",
    quote:
      "I'm so grateful that Thywill has written a special poem for my book. His talent and heart can be felt through every line. I wish him all the best with his own book too. I know how much it all means to him!!! And I know it's going to touch lives.",
    rating: 5,
    work: "Author of The Sickle And The Crown",
  },
];

async function seedTestimonials() {
  console.log("Seeding testimonials...");

  for (const item of testimonialsData) {
    await db
      .insert(testimonials)
      .values({
        name: item.name,
        location: item.location ?? null,
        quote: item.quote,
        rating: item.rating ?? 5,
        work: item.work ?? null,
        approved: true,
      })
      .onConflictDoNothing();
  }

  console.log("Testimonials seeded successfully!");
}

seedTestimonials()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Error seeding testimonials:", error);
    process.exit(1);
  });
