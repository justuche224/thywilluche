import { seedAboutContent } from "./seed-about-content";
import { seedAnnouncements } from "./seed-announcements";
import { seedCommunityGroups } from "./seed-community-groups";
import { seedContactInfo } from "./seed-contact-info";
import { seedHomeContent } from "./seed-home-content";
import { seedMediaHighlights } from "./media-highlights";
import { seedProjects } from "./projects";
import { seedServicesContent } from "./seed-services-content";
import { seedTestimonials } from "./seed-testimonials";

async function runAllSeeds() {
  await seedAboutContent();
  await seedHomeContent();
  await seedContactInfo();
  await seedCommunityGroups();
  await seedAnnouncements();
  await seedProjects();
  await seedMediaHighlights();
  await seedTestimonials();
  await seedServicesContent();
}

runAllSeeds()
  .then(() => {
    console.log("All seeds completed successfully");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Error running seeds:", error);
    process.exit(1);
  });
