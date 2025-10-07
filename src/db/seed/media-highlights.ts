import db from "@/db";
import { mediaHighlights } from "@/db/schema/media-highlights";

export const seedMediaHighlights = async () => {
  const highlights = [
    {
      type: "featured",
      title: "CNN Mental Health Spotlight",
      description:
        "Featured in CNN's special series on mental health advocacy and personal transformation.",
      quote: "A powerful voice in the mental health conversation...",
      image: "/images/main.jpg",
      color: "primary",
      date: "2024",
      isActive: true,
      sortOrder: 0,
    },
    {
      type: "podcast",
      title: "The Healing Journey Podcast",
      description:
        "Guest appearance discussing resilience, vulnerability, and the power of daily victories.",
      quote: "Your story resonates with millions...",
      image: "/images/IMG_20250918_104735[2].jpg",
      color: "secondary",
      date: "2024",
      isActive: true,
      sortOrder: 1,
    },
    {
      type: "award",
      title: "Mental Health Advocate Award",
      description:
        "Recognized by the National Mental Health Foundation for outstanding community impact.",
      quote: "Transforming lives through authentic storytelling...",
      image: "/images/IMG_20250907_010336[1].jpg",
      color: "primary",
      date: "2024",
      isActive: true,
      sortOrder: 2,
    },
    {
      type: "social",
      title: "Viral Community Impact",
      description:
        "Social media campaign reached over 2 million people, sparking global conversations.",
      quote: "Building bridges of understanding...",
      image: "/images/community.jpg",
      color: "secondary",
      date: "2024",
      isActive: true,
      sortOrder: 3,
    },
    {
      type: "testimonial",
      title: "Community Voices",
      description:
        "Testimonials from community members whose lives have been transformed.",
      quote: "You gave me the courage to share my story...",
      image: "/images/IMG_20240828_162759[1].jpg",
      color: "primary",
      date: "2024",
      isActive: true,
      sortOrder: 4,
    },
    {
      type: "feature",
      title: "Photoshoot Highlights",
      description:
        "Behind-the-scenes moments capturing the authentic journey of growth and healing.",
      quote: "Every photograph tells a story...",
      image: "/images/IMG_20250716_093443[1].jpg",
      color: "secondary",
      date: "2024",
      isActive: true,
      sortOrder: 5,
    },
  ];

  try {
    await db.insert(mediaHighlights).values(highlights);
    console.log("Media highlights seeded successfully");
  } catch (error) {
    console.error("Error seeding media highlights:", error);
  }
};
