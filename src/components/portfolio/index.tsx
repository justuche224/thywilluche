"use client";

import React, { useState } from "react";
import { Oswald } from "next/font/google";
import { motion } from "framer-motion";
import { categories } from "./data";
import { ProjectCategory } from "./types";
import ProjectCard from "./project-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { georgiaItalic } from "@/utils/georgia-italic";

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
});

interface PortfolioPageProps {
  projects: Array<{
    id: string;
    title: string;
    category: string;
    description: string;
    mediaType: string;
    mediaUrl: string;
    thumbnailUrl: string | null;
    downloadableExcerpt: string | null;
    externalLink: string | null;
    date: Date;
    featured: boolean | null;
  }>;
}

const PortfolioPage = ({ projects }: PortfolioPageProps) => {
  const [selectedCategory, setSelectedCategory] = useState<
    ProjectCategory | "all"
  >("all");

  const projectsData = projects.map((p) => ({
    ...p,
    category: p.category as ProjectCategory,
    mediaType: p.mediaType as "image" | "video" | "pdf",
    featured: p.featured || false,
    reviews: [],
  }));

  const filteredProjects =
    selectedCategory === "all"
      ? projectsData
      : projectsData.filter((p) => p.category === selectedCategory);

  const featuredProjects = projectsData.filter((p) => p.featured);

  return (
    <div className="w-full relative overflow-clip">
      <motion.section
        className="w-full py-16 lg:py-20"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="container mx-auto px-6 lg:px-8">
          <div className="max-w-6xl mx-auto text-center space-y-6">
            <h1 className={`text-5xl lg:text-6xl ${georgiaItalic.className}`}>
              Creative Works & Purpose-Driven Initiatives
            </h1>
            <div className="w-24 h-1 bg-primary rounded-full mx-auto"></div>
            <p
              className={`text-xl text-gray-700 max-w-3xl mx-auto ${oswald.className}`}
            >
              Explore the projects, creative works, programs, and collaborations
              inspired by a shared mission — to promote healing, mental health
              awareness, and personal growth through art, storytelling, and
              community impact.
            </p>
          </div>
        </div>
      </motion.section>

      {featuredProjects.length > 0 && (
        <motion.section
          className="w-full py-12 bg-white/50"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="container mx-auto px-6 lg:px-8">
            <div className="max-w-6xl mx-auto space-y-8">
              <h2
                className={`text-3xl lg:text-4xl text-center ${georgiaItalic.className}`}
              >
                Featured Projects
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {featuredProjects.map((project) => (
                  // @ts-expect-error null and undefined are valid values for thumbnailUrl
                  <ProjectCard key={project.id} project={project} featured />
                ))}
              </div>
            </div>
          </div>
        </motion.section>
      )}

      <motion.section
        className="w-full py-16 lg:py-20"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="container mx-auto px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <Tabs
              defaultValue="all"
              className="w-full"
              onValueChange={(value) =>
                setSelectedCategory(value as ProjectCategory | "all")
              }
            >
              <div className="flex justify-center mb-12">
                <TabsList className="flex-wrap h-auto gap-2 bg-white/50 p-2">
                  <TabsTrigger
                    value="all"
                    className={`${oswald.className} data-[state=active]:bg-primary data-[state=active]:text-white`}
                  >
                    All Projects
                  </TabsTrigger>
                  {categories.map((category) => (
                    <TabsTrigger
                      key={category.id}
                      value={category.id}
                      className={`${oswald.className} data-[state=active]:bg-primary data-[state=active]:text-white`}
                    >
                      {category.name}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>

              <TabsContent value="all" className="mt-0">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  {filteredProjects.map((project) => (
                    // @ts-expect-error null and undefined are valid values for thumbnailUrl
                    <ProjectCard key={project.id} project={project} />
                  ))}
                </div>
              </TabsContent>

              {categories.map((category) => (
                <TabsContent
                  key={category.id}
                  value={category.id}
                  className="mt-0"
                >
                  <div className="mb-8 text-center">
                    <p className={`text-lg text-gray-700 ${oswald.className}`}>
                      {category.description}
                    </p>
                  </div>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {filteredProjects.map((project) => (
                      // @ts-expect-error null and undefined are valid values for thumbnailUrl
                      <ProjectCard key={project.id} project={project} />
                    ))}
                  </div>
                </TabsContent>
              ))}
            </Tabs>

            {filteredProjects.length === 0 && (
              <div className="text-center py-16">
                <p className={`text-xl text-gray-600 ${oswald.className}`}>
                  No projects found in this category yet.
                </p>
              </div>
            )}
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default PortfolioPage;
