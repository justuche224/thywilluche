import { Project, CategoryInfo } from "./types";

export const categories: CategoryInfo[] = [
  {
    id: "books",
    name: "Books",
    description: "Published works and literary projects",
  },
  {
    id: "poetry",
    name: "Poetry",
    description: "Poetic expressions and collections",
  },
  {
    id: "coaching-programs",
    name: "Coaching Programs",
    description: "Structured programs for personal growth",
  },
  {
    id: "films",
    name: "Films",
    description: "Video content and documentary work",
  },
  {
    id: "partnerships",
    name: "Partnerships",
    description: "Collaborative projects and initiatives",
  },
  {
    id: "events",
    name: "Events",
    description: "Workshops, talks, and community gatherings",
  },
];

export const projects: Project[] = [
  {
    id: "1",
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
    date: "2024-09-07",
    featured: true,
    reviews: [
      {
        id: "r1",
        author: "Sarah M.",
        content:
          "This book changed my perspective on mental health. ThyWill's honesty and vulnerability made me feel less alone in my struggles.",
        rating: 5,
        date: "2024-10-01",
        approved: true,
      },
      {
        id: "r2",
        author: "John D.",
        content:
          "A must-read for anyone dealing with mental health challenges. Practical, honest, and deeply moving.",
        rating: 5,
        date: "2024-09-28",
        approved: true,
      },
    ],
  },
  {
    id: "2",
    title: "Reflections on Healing",
    category: "poetry",
    description:
      "A collection of poems exploring themes of healing, growth, and self-discovery through life's challenges.",
    longDescription:
      "Reflections on Healing is a poetry collection that captures the journey from pain to peace. Each poem serves as a mirror for personal reflection and a companion for those seeking solace in words.",
    mediaType: "image",
    mediaUrl: "/images/IMG_20250918_104735[2].jpg",
    thumbnailUrl: "/images/IMG_20250918_104735[2].jpg",
    downloadableExcerpt: "/excerpts/reflections-sample.pdf",
    date: "2024-08-15",
    featured: false,
    reviews: [
      {
        id: "r3",
        author: "Emily R.",
        content:
          "Beautiful, raw, and authentic. These poems speak to the soul.",
        rating: 5,
        date: "2024-09-15",
        approved: true,
      },
    ],
  },
  {
    id: "3",
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
    date: "2024-06-01",
    featured: true,
    reviews: [
      {
        id: "r4",
        author: "Michael T.",
        content:
          "The program gave me tools I use every day. Life-changing experience.",
        rating: 5,
        date: "2024-09-20",
        approved: true,
      },
      {
        id: "r5",
        author: "Lisa K.",
        content:
          "ThyWill creates a safe space for growth. The support and guidance were invaluable.",
        rating: 5,
        date: "2024-08-30",
        approved: true,
      },
    ],
  },
  {
    id: "4",
    title: "Stories of Resilience",
    category: "films",
    description:
      "A documentary series featuring real stories of individuals overcoming mental health challenges and finding their path to healing.",
    longDescription:
      "Stories of Resilience is a documentary project that showcases the power of the human spirit. Through intimate interviews and authentic storytelling, this series breaks down stigma and builds understanding around mental health.",
    mediaType: "video",
    mediaUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    thumbnailUrl: "/images/IMG_20240828_162619[1].jpg",
    date: "2024-07-20",
    featured: true,
    reviews: [
      {
        id: "r6",
        author: "David P.",
        content:
          "Powerful storytelling that needs to be seen. Thank you for this important work.",
        rating: 5,
        date: "2024-09-10",
        approved: true,
      },
    ],
  },
  {
    id: "5",
    title: "Community Mental Health Initiative",
    category: "partnerships",
    description:
      "Partnership with local organizations to provide free mental health resources and support to underserved communities.",
    longDescription:
      "This ongoing partnership brings together mental health professionals, community leaders, and volunteers to create accessible support systems for those who need it most. We've provided workshops, resources, and one-on-one support to hundreds of individuals.",
    mediaType: "image",
    mediaUrl: "/images/community.jpg",
    thumbnailUrl: "/images/community.jpg",
    date: "2024-05-10",
    featured: false,
    reviews: [],
  },
  {
    id: "6",
    title: "Hope & Healing Workshop Series",
    category: "events",
    description:
      "Monthly workshops bringing together individuals on their mental wellness journey for shared learning and community building.",
    longDescription:
      "The Hope & Healing Workshop Series creates spaces for authentic connection and practical learning. Each month focuses on different aspects of mental wellness, from stress management to building resilience.",
    mediaType: "image",
    mediaUrl: "/images/IMG_20250716_093443[1].jpg",
    thumbnailUrl: "/images/IMG_20250716_093443[1].jpg",
    date: "2024-03-01",
    featured: false,
    reviews: [
      {
        id: "r7",
        author: "Jennifer S.",
        content:
          "These workshops are incredible. The community we've built is so supportive.",
        rating: 5,
        date: "2024-09-05",
        approved: true,
      },
    ],
  },
];
