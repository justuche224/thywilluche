"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Project } from "./types";
import { Oswald } from "next/font/google";
import { motion } from "framer-motion";
import { ExternalLink, Download, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
});

interface ProjectCardProps {
  project: Project;
  featured?: boolean;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, featured }) => {
  const averageRating =
    project.reviews.length > 0
      ? project.reviews.reduce((acc, r) => acc + r.rating, 0) /
        project.reviews.length
      : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="group"
    >
      <Link href={`/portfolio/${project.id}`}>
        <div className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
          <div
            className={`relative overflow-hidden ${
              featured ? "aspect-[16/10]" : "aspect-[4/3]"
            }`}
          >
            {project.mediaType === "image" && (
              <Image
                src={project.mediaUrl}
                alt={project.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
            )}
            {project.mediaType === "video" && (
              <div className="relative w-full h-full bg-black">
                <Image
                  src={project.thumbnailUrl || project.mediaUrl}
                  alt={project.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                  <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center">
                    <div className="w-0 h-0 border-l-[16px] border-l-primary border-t-[10px] border-t-transparent border-b-[10px] border-b-transparent ml-1"></div>
                  </div>
                </div>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>

            {project.reviews.length > 0 && (
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className={`text-sm font-semibold ${oswald.className}`}>
                  {averageRating.toFixed(1)}
                </span>
              </div>
            )}
          </div>

          <div className="p-6 space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3
                  className={`text-xl font-bold ${oswald.className} group-hover:text-primary transition-colors`}
                >
                  {project.title}
                </h3>
              </div>
              <p className={`text-gray-700 ${oswald.className} line-clamp-2`}>
                {project.description}
              </p>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span
                className={`text-sm text-primary font-semibold ${oswald.className} capitalize`}
              >
                {project.category.replace("-", " ")}
              </span>
              <div className="flex items-center gap-2">
                {project.downloadableExcerpt && (
                  <Button
                    size="sm"
                    variant="ghost"
                    className="gap-1"
                    onClick={(e) => {
                      e.preventDefault();
                    }}
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                )}
                {project.externalLink && (
                  <Button
                    size="sm"
                    variant="ghost"
                    className="gap-1"
                    onClick={(e) => {
                      e.preventDefault();
                    }}
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>

            {project.reviews.length > 0 && (
              <div className={`text-sm text-gray-600 ${oswald.className}`}>
                {project.reviews.length} review
                {project.reviews.length !== 1 ? "s" : ""}
              </div>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProjectCard;
