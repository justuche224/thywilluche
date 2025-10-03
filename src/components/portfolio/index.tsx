"use client";

import React, { useState } from "react";
import { Pacifico, Oswald } from "next/font/google";
import { motion } from "framer-motion";
import { projects, categories } from "./data";
import { ProjectCategory } from "./types";
import ProjectCard from "./project-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const pacifico = Pacifico({
  variable: "--font-pacifico",
  subsets: ["latin"],
  weight: "400",
});

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
});

const PortfolioPage = () => {
  const [selectedCategory, setSelectedCategory] = useState<
    ProjectCategory | "all"
  >("all");

  const filteredProjects =
    selectedCategory === "all"
      ? projects
      : projects.filter((p) => p.category === selectedCategory);

  const featuredProjects = projects.filter((p) => p.featured);

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
            <h1 className={`text-5xl lg:text-6xl ${pacifico.className}`}>
              Portfolio & Projects
            </h1>
            <div className="w-24 h-1 bg-primary rounded-full mx-auto"></div>
            <p
              className={`text-xl text-gray-700 max-w-3xl mx-auto ${oswald.className}`}
            >
              Explore the creative works, programs, and collaborative
              initiatives dedicated to mental health advocacy and community
              building.
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
                className={`text-3xl lg:text-4xl text-center ${pacifico.className}`}
              >
                Featured Projects
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {featuredProjects.map((project) => (
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
