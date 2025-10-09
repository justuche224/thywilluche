import db from "..";
import { projects, projectReviews } from "../schema";
import { nanoid } from "nanoid";

const projectsData = [
  {
    id: nanoid(),
    title: "Days I Do Not Die",
    category: "books",
    description:
      "A powerful memoir exploring mental health, resilience, and the journey of finding hope in the darkest moments.",
    longDescription:
      "Days I Do Not Die is a raw and honest exploration of living with mental health challenges. Through personal stories and reflections, this book offers hope and practical insights for anyone navigating their own mental wellness journey. It's a testament to the power of vulnerability and the strength found in simply showing up each day.",
    mediaType: "image",
    mediaUrl: "/images/IMG_20250907_010336[1].jpg",
    thumbnailUrl: "/images/IMG_20250907_010336[1].jpg",
    downloadableExcerpt: "/excerpts/days-i-do-not-die-sample.pdf",
    externalLink: "/shop/books",
    date: new Date("2024-09-07"),
    featured: true,
  },
  {
    id: nanoid(),
    title: "Reflections on Healing",
    category: "poetry",
    description:
      "A collection of poems exploring themes of healing, growth, and self-discovery through life's challenges.",
    longDescription: `Reflections on Healing is a poetry collection that captures the journey from pain to peace. Each poem serves as a mirror for personal reflection and a companion for those seeking solace in words.

Here's a sample from the collection:

"In the quiet moments,
when the world feels heavy,
I find my breath again.

Step by step,
moment by moment,
I choose to rise.

Not because it's easy,
but because I'm worthy
of my own love."`,
    mediaType: "image",
    mediaUrl: "/images/IMG_20250918_104735[2].jpg",
    thumbnailUrl: "/images/IMG_20250918_104735[2].jpg",
    downloadableExcerpt: "/excerpts/reflections-sample.pdf",
    date: new Date("2024-08-15"),
    featured: false,
  },
  {
    id: nanoid(),
    title: "Mental Wellness Foundations",
    category: "coaching-programs",
    description:
      "A 12-week intensive program designed to build lasting mental wellness practices and resilience strategies.",
    longDescription:
      "Mental Wellness Foundations is a comprehensive coaching program that combines one-on-one sessions, practical exercises, and community support to help participants build a strong foundation for mental health and personal growth.",
    mediaType: "image",
    mediaUrl: "/images/IMG_20240828_162759[1].jpg",
    thumbnailUrl: "/images/IMG_20240828_162759[1].jpg",
    externalLink: "/services/coaching",
    date: new Date("2024-06-01"),
    featured: true,
  },
  {
    id: nanoid(),
    title: "Stories of Resilience",
    category: "films",
    description:
      "A documentary series featuring real stories of individuals overcoming mental health challenges and finding their path to healing.",
    longDescription:
      "Stories of Resilience is a documentary project that showcases the power of the human spirit. Through intimate interviews and authentic storytelling, this series breaks down stigma and builds understanding around mental health.",
    mediaType: "video",
    mediaUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    thumbnailUrl: "/images/IMG_20240828_162619[1].jpg",
    date: new Date("2024-07-20"),
    featured: true,
  },
  {
    id: nanoid(),
    title: "Community Mental Health Initiative",
    category: "partnerships",
    description:
      "Partnership with local organizations to provide free mental health resources and support to underserved communities.",
    longDescription:
      "This ongoing partnership brings together mental health professionals, community leaders, and volunteers to create accessible support systems for those who need it most. We've provided workshops, resources, and one-on-one support to hundreds of individuals.",
    mediaType: "image",
    mediaUrl: "/images/community.jpg",
    thumbnailUrl: "/images/community.jpg",
    date: new Date("2024-05-10"),
    featured: false,
  },
  {
    id: nanoid(),
    title: "Hope & Healing Workshop Series",
    category: "events",
    description:
      "Monthly workshops bringing together individuals on their mental wellness journey for shared learning and community building.",
    longDescription:
      "The Hope & Healing Workshop Series creates spaces for authentic connection and practical learning. Each month focuses on different aspects of mental wellness, from stress management to building resilience.",
    mediaType: "image",
    mediaUrl: "/images/IMG_20250716_093443[1].jpg",
    thumbnailUrl: "/images/IMG_20250716_093443[1].jpg",
    date: new Date("2024-03-01"),
    featured: false,
  },
];

export async function seedProjects() {
  console.log("Seeding projects...");

  for (const project of projectsData) {
    await db.insert(projects).values(project);
  }

  console.log("Projects seeded successfully!");

  const allProjects = await db.select().from(projects);

  if (allProjects.length > 0) {
    const reviewsData = [
      {
        id: nanoid(),
        projectId: allProjects[0].id,
        author: "Sarah M.",
        content:
          "This book changed my perspective on mental health. ThyWill's honesty and vulnerability made me feel less alone in my struggles.",
        rating: 5,
        approved: true,
      },
      {
        id: nanoid(),
        projectId: allProjects[0].id,
        author: "John D.",
        content:
          "A must-read for anyone dealing with mental health challenges. Practical, honest, and deeply moving.",
        rating: 5,
        approved: true,
      },
      {
        id: nanoid(),
        projectId: allProjects[1].id,
        author: "Emily R.",
        content:
          "Beautiful, raw, and authentic. These poems speak to the soul.",
        rating: 5,
        approved: true,
      },
      {
        id: nanoid(),
        projectId: allProjects[2].id,
        author: "Michael T.",
        content:
          "The program gave me tools I use every day. Life-changing experience.",
        rating: 5,
        approved: true,
      },
      {
        id: nanoid(),
        projectId: allProjects[2].id,
        author: "Lisa K.",
        content:
          "ThyWill creates a safe space for growth. The support and guidance were invaluable.",
        rating: 5,
        approved: true,
      },
      {
        id: nanoid(),
        projectId: allProjects[3].id,
        author: "David P.",
        content:
          "Powerful storytelling that needs to be seen. Thank you for this important work.",
        rating: 5,
        approved: true,
      },
      {
        id: nanoid(),
        projectId: allProjects[5].id,
        author: "Jennifer S.",
        content:
          "These workshops are incredible. The community we've built is so supportive.",
        rating: 5,
        approved: true,
      },
    ];

    for (const review of reviewsData) {
      await db.insert(projectReviews).values(review);
    }

    console.log("Project reviews seeded successfully!");
  }
}
