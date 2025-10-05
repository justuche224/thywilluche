import db from "@/db";
import { servicesContent } from "@/db/schema";

const servicesSeedData = [
  {
    section: "overview",
    key: "title",
    value: "Services",
    valueType: "text",
  },
  {
    section: "overview",
    key: "subtitle",
    value:
      "Transform your vision into reality with personalized guidance, expert consulting, and professional writing services tailored to your unique journey.",
    valueType: "text",
  },
  {
    section: "overview",
    key: "coachingTitle",
    value: "Coaching",
    valueType: "text",
  },
  {
    section: "overview",
    key: "coachingDescription",
    value:
      "One-on-one personalized coaching sessions designed to help you navigate life's challenges, build resilience, and achieve your personal goals. Together, we'll create a roadmap for your mental wellness and personal growth.",
    valueType: "text",
  },
  {
    section: "overview",
    key: "coachingImage",
    value: "/images/IMG_20240828_162759[1].jpg",
    valueType: "image",
  },
  {
    section: "overview",
    key: "ghostwritingTitle",
    value: "Ghostwriting",
    valueType: "text",
  },
  {
    section: "overview",
    key: "ghostwritingDescription",
    value:
      "Bring your story to life with professional ghostwriting services. Whether it's a memoir, self-help book, or personal project, I'll help you craft compelling narratives that resonate with your audience.",
    valueType: "text",
  },
  {
    section: "overview",
    key: "ghostwritingImage",
    value: "/images/IMG_20250907_010336[1].jpg",
    valueType: "image",
  },
  {
    section: "overview",
    key: "consultingTitle",
    value: "Consulting",
    valueType: "text",
  },
  {
    section: "overview",
    key: "consultingDescription",
    value:
      "Strategic consulting for organizations, content creators, and individuals looking to build authentic mental health initiatives, develop impactful content, or create meaningful community engagement strategies.",
    valueType: "text",
  },
  {
    section: "overview",
    key: "consultingImage",
    value: "/images/IMG_20250716_093443[1].jpg",
    valueType: "image",
  },
  {
    section: "overview",
    key: "ctaTitle",
    value: "Ready to Get Started?",
    valueType: "text",
  },
  {
    section: "overview",
    key: "ctaDescription",
    value:
      "Whether you're looking for personal coaching, need help writing your story, or want to build impactful initiatives, I'm here to support your journey.",
    valueType: "text",
  },
  {
    section: "overview",
    key: "ctaButtonText",
    value: "Book a Consultation",
    valueType: "text",
  },
  {
    section: "coaching",
    key: "title",
    value: "Personal Coaching",
    valueType: "text",
  },
  {
    section: "coaching",
    key: "description",
    value:
      "Experience transformative one-on-one coaching that empowers you to overcome challenges, build lasting resilience, and create meaningful change in your life.",
    valueType: "text",
  },
  {
    section: "coaching",
    key: "heroImage",
    value: "/images/IMG_20240828_162759[1].jpg",
    valueType: "image",
  },
  {
    section: "coaching",
    key: "whatToExpectTitle",
    value: "What to Expect",
    valueType: "text",
  },
  {
    section: "coaching",
    key: "whatToExpectSubtitle",
    value: "Personalized support tailored to your unique journey",
    valueType: "text",
  },
  {
    section: "coaching",
    key: "strategyTitle",
    value: "Personalized Strategy",
    valueType: "text",
  },
  {
    section: "coaching",
    key: "strategyDescription",
    value:
      "Every session is tailored to your specific goals, challenges, and circumstances. We'll work together to create a roadmap that fits your life.",
    valueType: "text",
  },
  {
    section: "coaching",
    key: "toolsTitle",
    value: "Practical Tools",
    valueType: "text",
  },
  {
    section: "coaching",
    key: "toolsDescription",
    value:
      "Leave each session with actionable strategies and techniques you can implement immediately to build resilience and navigate challenges.",
    valueType: "text",
  },
  {
    section: "coaching",
    key: "accountabilityTitle",
    value: "Accountability & Support",
    valueType: "text",
  },
  {
    section: "coaching",
    key: "accountabilityDescription",
    value:
      "Regular check-ins and ongoing support to help you stay on track and celebrate your progress along the way.",
    valueType: "text",
  },
  {
    section: "coaching",
    key: "safeSpaceTitle",
    value: "Safe Space",
    valueType: "text",
  },
  {
    section: "coaching",
    key: "safeSpaceDescription",
    value:
      "A judgment-free environment where vulnerability is welcomed and authenticity is celebrated. Your story matters.",
    valueType: "text",
  },
  {
    section: "coaching",
    key: "whoThisIsForTitle",
    value: "Who This Is For",
    valueType: "text",
  },
  {
    section: "coaching",
    key: "whoThisIsForDescription1",
    value:
      "My coaching services are designed for individuals who are ready to invest in themselves and their mental wellness journey. Whether you're facing specific challenges or simply want to build a stronger foundation for personal growth, I'm here to support you.",
    valueType: "text",
  },
  {
    section: "coaching",
    key: "whoThisIsForDescription2",
    value:
      "This is for you if you're navigating life transitions, working through mental health challenges, seeking to build resilience, or wanting to live more authentically and purposefully.",
    valueType: "text",
  },
  {
    section: "ghostwriting",
    key: "title",
    value: "Professional Ghostwriting",
    valueType: "text",
  },
  {
    section: "ghostwriting",
    key: "description",
    value:
      "Bring your story to life with professional ghostwriting services that capture your voice, honor your journey, and create compelling narratives that resonate with readers.",
    valueType: "text",
  },
  {
    section: "ghostwriting",
    key: "heroImage",
    value: "/images/IMG_20250907_010336[1].jpg",
    valueType: "image",
  },
  {
    section: "ghostwriting",
    key: "whatToExpectTitle",
    value: "What to Expect",
    valueType: "text",
  },
  {
    section: "ghostwriting",
    key: "whatToExpectSubtitle",
    value: "Collaborative storytelling that honors your voice and vision",
    valueType: "text",
  },
  {
    section: "ghostwriting",
    key: "processTitle",
    value: "Collaborative Process",
    valueType: "text",
  },
  {
    section: "ghostwriting",
    key: "processDescription",
    value:
      "We work together throughout the entire process, from initial concept to final manuscript. Your voice and vision guide every chapter, every word.",
    valueType: "text",
  },
  {
    section: "ghostwriting",
    key: "collaborationTitle",
    value: "Authentic Storytelling",
    valueType: "text",
  },
  {
    section: "ghostwriting",
    key: "collaborationDescription",
    value:
      "I specialize in capturing your unique voice and perspective, ensuring your story feels authentic and true to who you are.",
    valueType: "text",
  },
  {
    section: "ghostwriting",
    key: "qualityTitle",
    value: "Professional Quality",
    valueType: "text",
  },
  {
    section: "ghostwriting",
    key: "qualityDescription",
    value:
      "From manuscript development to final editing, every project receives the attention to detail and professional polish your story deserves.",
    valueType: "text",
  },
  {
    section: "ghostwriting",
    key: "confidentialityTitle",
    value: "Complete Confidentiality",
    valueType: "text",
  },
  {
    section: "ghostwriting",
    key: "confidentialityDescription",
    value:
      "Your story is safe with me. I maintain strict confidentiality and respect for your privacy throughout our collaboration.",
    valueType: "text",
  },
  {
    section: "ghostwriting",
    key: "whoThisIsForTitle",
    value: "Who This Is For",
    valueType: "text",
  },
  {
    section: "ghostwriting",
    key: "whoThisIsForDescription1",
    value:
      "My ghostwriting services are perfect for individuals who have a story to tell but need help bringing it to life on the page. Whether you're an entrepreneur, advocate, survivor, or someone with a compelling life experience, I'm here to help.",
    valueType: "text",
  },
  {
    section: "ghostwriting",
    key: "whoThisIsForDescription2",
    value:
      "This service is ideal for memoirs, self-help books, motivational content, or any project where your personal story can inspire and impact others.",
    valueType: "text",
  },
  {
    section: "consulting",
    key: "title",
    value: "Strategic Consulting",
    valueType: "text",
  },
  {
    section: "consulting",
    key: "description",
    value:
      "Strategic consulting for organizations, content creators, and individuals looking to build authentic mental health initiatives, develop impactful content, or create meaningful community engagement strategies.",
    valueType: "text",
  },
  {
    section: "consulting",
    key: "heroImage",
    value: "/images/IMG_20250716_093443[1].jpg",
    valueType: "image",
  },
  {
    section: "consulting",
    key: "whatToExpectTitle",
    value: "What to Expect",
    valueType: "text",
  },
  {
    section: "consulting",
    key: "whatToExpectSubtitle",
    value:
      "Strategic guidance that creates real impact and authentic connections",
    valueType: "text",
  },
  {
    section: "consulting",
    key: "strategyTitle",
    value: "Strategic Planning",
    valueType: "text",
  },
  {
    section: "consulting",
    key: "strategyDescription",
    value:
      "Comprehensive analysis and strategic planning to develop initiatives that align with your mission and create meaningful impact in mental health advocacy.",
    valueType: "text",
  },
  {
    section: "consulting",
    key: "implementationTitle",
    value: "Implementation Support",
    valueType: "text",
  },
  {
    section: "consulting",
    key: "implementationDescription",
    value:
      "Hands-on support throughout the implementation process, ensuring your initiatives launch successfully and achieve their intended outcomes.",
    valueType: "text",
  },
  {
    section: "consulting",
    key: "supportTitle",
    value: "Ongoing Support",
    valueType: "text",
  },
  {
    section: "consulting",
    key: "supportDescription",
    value:
      "Continued guidance and support as your initiatives grow, helping you adapt strategies and maintain authentic connections with your community.",
    valueType: "text",
  },
  {
    section: "consulting",
    key: "resultsTitle",
    value: "Measurable Results",
    valueType: "text",
  },
  {
    section: "consulting",
    key: "resultsDescription",
    value:
      "Focus on creating initiatives that deliver measurable impact while maintaining authenticity and genuine community engagement.",
    valueType: "text",
  },
  {
    section: "consulting",
    key: "whoThisIsForTitle",
    value: "Who This Is For",
    valueType: "text",
  },
  {
    section: "consulting",
    key: "whoThisIsForDescription1",
    value:
      "My consulting services are designed for organizations, content creators, and advocates who want to make a real difference in mental health awareness and community building. Whether you're launching new initiatives or looking to strengthen existing ones, I'm here to help.",
    valueType: "text",
  },
  {
    section: "consulting",
    key: "whoThisIsForDescription2",
    value:
      "This service is perfect for nonprofits, educational institutions, content creators, and organizations committed to authentic mental health advocacy and community engagement.",
    valueType: "text",
  },
  // Ghostwriting Services Offered Section
  {
    section: "ghostwriting",
    key: "servicesTitle",
    value: "Services Offered",
    valueType: "text",
  },
  {
    section: "ghostwriting",
    key: "servicesSubtitle",
    value: "Comprehensive writing support from concept to completion",
    valueType: "text",
  },
  {
    section: "ghostwriting",
    key: "memoirsTitle",
    value: "Memoirs & Life Stories",
    valueType: "text",
  },
  {
    section: "ghostwriting",
    key: "memoirsDescription",
    value:
      "Transform your experiences into compelling narratives that preserve your legacy and inspire others through authentic storytelling.",
    valueType: "text",
  },
  {
    section: "ghostwriting",
    key: "memoirsImage",
    value: "/images/IMG_20250907_010252[1].jpg",
    valueType: "image",
  },
  {
    section: "ghostwriting",
    key: "selfHelpTitle",
    value: "Self-Help & Motivational",
    valueType: "text",
  },
  {
    section: "ghostwriting",
    key: "selfHelpDescription",
    value:
      "Create empowering content that helps others overcome challenges and achieve their goals through your unique insights and experiences.",
    valueType: "text",
  },
  {
    section: "ghostwriting",
    key: "selfHelpImage",
    value: "/images/IMG_20250907_010336[1].jpg",
    valueType: "image",
  },
  {
    section: "ghostwriting",
    key: "businessTitle",
    value: "Business & Professional",
    valueType: "text",
  },
  {
    section: "ghostwriting",
    key: "businessDescription",
    value:
      "Professional content that establishes your expertise and builds your brand, from thought leadership pieces to comprehensive guides.",
    valueType: "text",
  },
  {
    section: "ghostwriting",
    key: "businessImage",
    value: "/images/IMG_20240828_162619[1].jpg",
    valueType: "image",
  },
  // Consulting Areas Section
  {
    section: "consulting",
    key: "areasTitle",
    value: "Consulting Areas",
    valueType: "text",
  },
  {
    section: "consulting",
    key: "areasSubtitle",
    value: "Strategic guidance for organizations and individuals",
    valueType: "text",
  },
  {
    section: "consulting",
    key: "advocacyTitle",
    value: "Mental Health Advocacy",
    valueType: "text",
  },
  {
    section: "consulting",
    key: "advocacyDescription",
    value:
      "Design and implement authentic mental health programs that create real impact and foster supportive communities.",
    valueType: "text",
  },
  {
    section: "consulting",
    key: "advocacyImage",
    value: "/images/community.jpg",
    valueType: "image",
  },
  {
    section: "consulting",
    key: "contentTitle",
    value: "Content Strategy",
    valueType: "text",
  },
  {
    section: "consulting",
    key: "contentDescription",
    value:
      "Develop compelling content strategies that build authentic connections and drive meaningful engagement with your audience.",
    valueType: "text",
  },
  {
    section: "consulting",
    key: "contentImage",
    value: "/images/IMG_20240828_162619[1].jpg",
    valueType: "image",
  },
  {
    section: "consulting",
    key: "communityTitle",
    value: "Community Building",
    valueType: "text",
  },
  {
    section: "consulting",
    key: "communityDescription",
    value:
      "Create and nurture communities that provide genuine support and foster authentic relationships around shared values.",
    valueType: "text",
  },
  {
    section: "consulting",
    key: "communityImage",
    value: "/images/IMG_20240828_162759[1].jpg",
    valueType: "image",
  },
];

export async function seedServicesContent() {
  try {
    console.log("Seeding services content...");

    for (const item of servicesSeedData) {
      await db
        .insert(servicesContent)
        .values({
          section: item.section,
          key: item.key,
          value: item.value,
          valueType: item.valueType as "text" | "image" | "list",
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .onConflictDoNothing();
    }

    console.log("Services content seeded successfully");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding services content:", error);
    throw error;
  }
}

seedServicesContent();