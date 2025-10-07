"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Pacifico, Oswald } from "next/font/google";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Download,
  ExternalLink,
  Star,
  Calendar,
} from "lucide-react";
import ReviewForm from "./review-form";
import ReviewList from "./review-list";
import { getPublicProjects } from "@/actions/projects";

const pacifico = Pacifico({
  variable: "--font-pacifico",
  subsets: ["latin"],
  weight: "400",
});

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
});

interface ProjectDetailProps {
  project: {
    id: string;
    title: string;
    category: string;
    description: string;
    longDescription: string | null;
    mediaType: string;
    mediaUrl: string;
    thumbnailUrl: string | null;
    downloadableExcerpt: string | null;
    externalLink: string | null;
    date: Date;
    featured: boolean | null;
    reviews: Array<{
      id: string;
      author: string;
      content: string;
      rating: number;
      approved: boolean;
      createdAt: Date;
    }>;
  } | null;
}

const ProjectDetail: React.FC<ProjectDetailProps> = ({ project }) => {
  const [showReviewForm, setShowReviewForm] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [allProjects, setAllProjects] = useState<any[]>([]);

  React.useEffect(() => {
    getPublicProjects().then(setAllProjects);
  }, []);

  if (!project) {
    return (
      <div className="container mx-auto px-6 py-20 text-center">
        <h1 className={`text-4xl ${pacifico.className} mb-4`}>
          Project Not Found
        </h1>
        <Link href="/portfolio">
          <Button className="gap-2">
            <ArrowLeft size={16} />
            Back to Portfolio
          </Button>
        </Link>
      </div>
    );
  }

  const approvedReviews = project.reviews.filter((r) => r.approved);

  const averageRating =
    approvedReviews.length > 0
      ? approvedReviews.reduce((acc, r) => acc + r.rating, 0) /
        approvedReviews.length
      : 0;

  return (
    <div className="w-full relative overflow-clip">
      <motion.section
        className="w-full py-8 lg:py-12"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="container mx-auto px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <Link href="/portfolio">
              <Button variant="ghost" className="gap-2 mb-8">
                <ArrowLeft size={16} />
                Back to Portfolio
              </Button>
            </Link>

            <div className="grid lg:grid-cols-2 gap-12 items-start">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="space-y-6"
              >
                <div>
                  <span
                    className={`inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-semibold ${oswald.className} capitalize mb-4`}
                  >
                    {project.category.replace("-", " ")}
                  </span>
                  <h1 className={`text-4xl lg:text-5xl ${pacifico.className}`}>
                    {project.title}
                  </h1>
                  <div className="flex items-center gap-4 mt-4 text-gray-600">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span className={`text-sm ${oswald.className}`}>
                        {new Date(project.date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                        })}
                      </span>
                    </div>
                    {approvedReviews.length > 0 && (
                      <div className="flex items-center gap-2">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className={`text-sm ${oswald.className}`}>
                          {averageRating.toFixed(1)} ({approvedReviews.length}{" "}
                          reviews)
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <p
                    className={`text-xl font-semibold ${oswald.className} text-gray-900`}
                  >
                    {project.description}
                  </p>
                  {project.longDescription && (
                    <p className={`text-lg ${oswald.className} text-gray-700`}>
                      {project.longDescription}
                    </p>
                  )}
                </div>

                <div className="flex flex-wrap gap-4 pt-4">
                  {project.externalLink && (
                    <Link href={project.externalLink}>
                      <Button size="lg" className="gap-2">
                        <ExternalLink size={20} />
                        Learn More
                      </Button>
                    </Link>
                  )}
                  {project.downloadableExcerpt && (
                    <Button size="lg" variant="outline" className="gap-2">
                      <Download size={20} />
                      Download Excerpt
                    </Button>
                  )}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <div className="relative max-w-md 2xl:max-w-xl mx-auto aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl">
                  {project.mediaType === "image" && (
                    <Image
                      src={project.mediaUrl}
                      alt={project.title}
                      fill
                      className="object-cover"
                    />
                  )}
                  {project.mediaType === "video" && (
                    <iframe
                      src={project.mediaUrl}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent pointer-events-none"></div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.section>

      <motion.section
        className="w-full py-16 lg:py-20 bg-white/50"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="container mx-auto px-6 lg:px-8">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
              <h2 className={`text-3xl lg:text-4xl ${pacifico.className}`}>
                Reviews
              </h2>
              {!showReviewForm && (
                <Button onClick={() => setShowReviewForm(true)}>
                  Write a Review
                </Button>
              )}
            </div>

            {showReviewForm && (
              <ReviewForm
                projectId={project.id}
                onClose={() => setShowReviewForm(false)}
              />
            )}

            {approvedReviews.length > 0 ? (
              <ReviewList reviews={approvedReviews.map(r => ({
                ...r,
                date: new Date(r.createdAt).toISOString(),
              }))} />
            ) : (
              <div className="text-center py-12 bg-white rounded-lg border border-gray-100">
                <p className={`text-lg text-gray-600 ${oswald.className}`}>
                  No reviews yet. Be the first to share your thoughts!
                </p>
              </div>
            )}
          </div>
        </div>
      </motion.section>

      <motion.section
        className="w-full py-16 lg:py-20"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="container mx-auto px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <h2
              className={`text-3xl lg:text-4xl ${pacifico.className} text-center mb-12`}
            >
              Related Projects
            </h2>
            <div className="grid md:grid-cols-3 xl:grid-cols-4 gap-8">
              {allProjects
                .filter(
                  (p) => p.category === project.category && p.id !== project.id
                )
                .slice(0, 3)
                .map((relatedProject) => (
                  <Link
                    key={relatedProject.id}
                    href={`/portfolio/${relatedProject.id}`}
                  >
                    <div className="group bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-all">
                      <div className="relative max-w-md 2xl:max-w-xl mx-auto aspect-[4/3] overflow-hidden">
                        <Image
                          src={relatedProject.thumbnailUrl || relatedProject.mediaUrl}
                          alt={relatedProject.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <div className="p-4">
                        <h3
                          className={`text-lg font-bold ${oswald.className} group-hover:text-primary transition-colors`}
                        >
                          {relatedProject.title}
                        </h3>
                        <p
                          className={`text-sm text-gray-600 ${oswald.className} line-clamp-2 mt-2`}
                        >
                          {relatedProject.description}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
            </div>
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default ProjectDetail;
