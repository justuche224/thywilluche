"use client";

import React from "react";
import Image from "next/image";
import { Oswald } from "next/font/google";
import { motion } from "framer-motion";

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
});

interface NGOProps {
  heroTitle?: string;
  heroSubtitle?: string;
  heroDescription?: string;
  heroButton1Text?: string;
  heroButton2Text?: string;
  heroImage?: string;
  missionTitle?: string;
  missionDescription1?: string;
  missionDescription2?: string;
  missionImage?: string;
  visionTitle?: string;
  visionDescription1?: string;
  visionDescription2?: string;
  visionImage?: string;
  programsTitle?: string;
  programsSubtitle?: string;
  educationTitle?: string;
  educationDescription?: string;
  educationImage?: string;
  healthcareTitle?: string;
  healthcareDescription?: string;
  healthcareImage?: string;
  developmentTitle?: string;
  developmentDescription?: string;
  developmentImage?: string;
  impactTitle?: string;
  impactSubtitle?: string;
  livesImpacted?: string;
  communitiesServed?: string;
  partnerOrganizations?: string;
  yearsOfService?: string;
  successStoriesTitle?: string;
  successStory1?: string;
  successStory1Author?: string;
  successStory2?: string;
  successStory2Author?: string;
  impactImage?: string;
  ctaTitle?: string;
  ctaDescription?: string;
  ctaButton1Text?: string;
  ctaButton2Text?: string;
  ctaButton3Text?: string;
}

const NGO = ({
  heroTitle = "Thywill Fountain of Hope for the Poor Initiative",
  heroSubtitle = "Building bridges of hope, one community at a time",
  heroDescription = "We are dedicated to empowering communities through education, healthcare, and sustainable development initiatives. Our mission is to create lasting positive change by addressing the root causes of poverty, inequality and mental health challenges.",
  heroButton1Text = "Get Involved",
  heroButton2Text = "Learn More",
  heroImage = "/images/community.jpg",
  missionTitle = "Our Mission",
  missionDescription1 = "To empower underserved communities through comprehensive education programs, accessible healthcare services, and sustainable development initiatives that create lasting positive change.",
  missionDescription2 = "We believe that every individual deserves the opportunity to reach their full potential, regardless of their circumstances or background.",
  missionImage = "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
  visionTitle = "Our Vision",
  visionDescription1 = "A world where every community has access to quality education, healthcare, and economic opportunities that enable them to thrive and contribute meaningfully to society.",
  visionDescription2 = "We envision empowered communities that are self-sustainable, resilient, and capable of creating their own pathways to prosperity.",
  visionImage = "https://images.unsplash.com/photo-1559027615-cd4628902d4a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
  programsTitle = "Our Programs",
  programsSubtitle = "We implement comprehensive programs designed to address the multifaceted challenges faced by underserved communities.",
  educationTitle = "Education Initiative",
  educationDescription = "Providing quality education resources, teacher training, and learning materials to schools in underserved communities.",
  educationImage = "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
  healthcareTitle = "Healthcare Access",
  healthcareDescription = "Bringing essential healthcare services directly to communities through mobile clinics and health education programs.",
  healthcareImage = "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
  developmentTitle = "Community Development",
  developmentDescription = "Supporting sustainable community projects that create economic opportunities and improve quality of life.",
  developmentImage = "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
  impactTitle = "Our Impact",
  impactSubtitle = "Together, we're making a measurable difference in communities across the region.",
  livesImpacted = "15,000+",
  communitiesServed = "50+",
  partnerOrganizations = "25",
  yearsOfService = "8",
  successStoriesTitle = "Success Stories",
  successStory1 = "Thanks to Thywill Fountain of Hope, our village now has access to clean water and our children can attend school regularly.",
  successStory1Author = "Sarah M., Community Leader",
  successStory2 = "The healthcare program saved my daughter's life. We are forever grateful for the support and care we received.",
  successStory2Author = "John K., Father",
  impactImage = "https://images.unsplash.com/photo-1593113598332-cd288d649433?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
  ctaTitle = "Join Us in Making a Difference",
  ctaDescription = "Your support helps us reach more communities and create lasting change. Together, we can build a brighter future for everyone.",
  ctaButton1Text = "Donate Now",
  ctaButton2Text = "Volunteer",
  ctaButton3Text = "Partner With Us",
}: NGOProps) => {
  return (
    <div className="min-h-screen">
      <div className="fixed top-0 left-0 bottom-0 right-0 flex justify-center items-center w-full h-screen z-[-1]">
        <Image
          src="/images/NGO.jpg"
          alt="Thywill Fountain of Hope"
          width={500}
          height={500}
          className="object-contain opacity-20"
        />
      </div>
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-5 md:px-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              className="space-y-8"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <motion.div
                className="space-y-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <h1
                  className={`text-4xl lg:text-6xl font-bold text-[#800000] ${oswald.className}`}
                >
                  {heroTitle}
                </h1>
                <p className="text-xl lg:text-2xl text-gray-600 font-light">
                  {heroSubtitle}
                </p>
              </motion.div>
              <motion.p
                className="text-lg text-gray-700 leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                {heroDescription}
              </motion.p>
              <motion.div
                className="flex flex-col sm:flex-row gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <motion.button
                  className="bg-[#800000] text-white px-8 py-4 rounded-lg font-semibold hover:bg-[#600000] transition-colors"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {heroButton1Text}
                </motion.button>
                <motion.button
                  className="border-2 border-[#800000] text-[#800000] px-8 py-4 rounded-lg font-semibold hover:bg-[#800000] hover:text-white transition-colors"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {heroButton2Text}
                </motion.button>
              </motion.div>
            </motion.div>
            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            >
              <motion.div
                className="aspect-[4/3] relative overflow-hidden rounded-2xl shadow-2xl"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <Image
                  src={heroImage}
                  alt="Community members working together"
                  fill
                  className="object-cover"
                  priority
                />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-5 md:px-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              className="space-y-8"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <div>
                <h2
                  className={`text-3xl lg:text-4xl font-bold text-[#800000] mb-6 ${oswald.className}`}
                >
                  {missionTitle}
                </h2>
                <p className="text-lg text-gray-700 leading-relaxed mb-6">
                  {missionDescription1}
                </p>
                <p className="text-lg text-gray-700 leading-relaxed">
                  {missionDescription2}
                </p>
              </div>
            </motion.div>
            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <motion.div
                className="aspect-[4/3] relative overflow-hidden rounded-2xl shadow-xl"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <Image
                  src={missionImage}
                  alt="Children in a classroom learning"
                  fill
                  className="object-cover"
                />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-5 md:px-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              className="relative order-2 lg:order-1"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <motion.div
                className="aspect-[4/3] relative overflow-hidden rounded-2xl shadow-xl"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <Image
                  src={visionImage}
                  alt="Community development project"
                  fill
                  className="object-cover"
                />
              </motion.div>
            </motion.div>
            <motion.div
              className="space-y-8 order-1 lg:order-2"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <div>
                <h2
                  className={`text-3xl lg:text-4xl font-bold text-[#800000] mb-6 ${oswald.className}`}
                >
                  {visionTitle}
                </h2>
                <p className="text-lg text-gray-700 leading-relaxed mb-6">
                  {visionDescription1}
                </p>
                <p className="text-lg text-gray-700 leading-relaxed">
                  {visionDescription2}
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Programs Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-5 md:px-10">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2
              className={`text-3xl lg:text-4xl font-bold text-[#800000] mb-6 ${oswald.className}`}
            >
              {programsTitle}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {programsSubtitle}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Education Program */}
            <motion.div
              className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              whileHover={{ y: -5 }}
            >
              <div className="relative aspect-video">
                <Image
                  src={educationImage}
                  alt="Education program"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-8">
                <h3
                  className={`text-2xl font-bold text-[#800000] mb-4 ${oswald.className}`}
                >
                  {educationTitle}
                </h3>
                <p className="text-gray-700 leading-relaxed mb-6">
                  {educationDescription}
                </p>
                <div className="space-y-2 text-sm text-gray-600">
                  <p>• School supplies distribution</p>
                  <p>• Teacher development programs</p>
                  <p>• Scholarship opportunities</p>
                  <p>• Digital learning resources</p>
                </div>
              </div>
            </motion.div>

            {/* Healthcare Program */}
            <motion.div
              className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              whileHover={{ y: -5 }}
            >
              <div className="relative aspect-video">
                <Image
                  src={healthcareImage}
                  alt="Healthcare program"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-8">
                <h3
                  className={`text-2xl font-bold text-[#800000] mb-4 ${oswald.className}`}
                >
                  {healthcareTitle}
                </h3>
                <p className="text-gray-700 leading-relaxed mb-6">
                  {healthcareDescription}
                </p>
                <div className="space-y-2 text-sm text-gray-600">
                  <p>• Mobile medical clinics</p>
                  <p>• Health screening programs</p>
                  <p>• Medication assistance</p>
                  <p>• Preventive care education</p>
                </div>
              </div>
            </motion.div>

            {/* Community Development */}
            <motion.div
              className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              whileHover={{ y: -5 }}
            >
              <div className="relative aspect-video">
                <Image
                  src={developmentImage}
                  alt="Community development"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-8">
                <h3
                  className={`text-2xl font-bold text-[#800000] mb-4 ${oswald.className}`}
                >
                  {developmentTitle}
                </h3>
                <p className="text-gray-700 leading-relaxed mb-6">
                  {developmentDescription}
                </p>
                <div className="space-y-2 text-sm text-gray-600">
                  <p>• Skills training programs</p>
                  <p>• Microfinance initiatives</p>
                  <p>• Infrastructure development</p>
                  <p>• Environmental conservation</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-5 md:px-10">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2
              className={`text-3xl lg:text-4xl font-bold text-[#800000] mb-6 ${oswald.className}`}
            >
              {impactTitle}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {impactSubtitle}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            <motion.div
              className="text-center"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div
                className={`text-4xl lg:text-5xl font-bold text-[#800000] mb-2 ${oswald.className}`}
              >
                {livesImpacted}
              </div>
              <p className="text-lg text-gray-600">Lives Impacted</p>
            </motion.div>
            <motion.div
              className="text-center"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div
                className={`text-4xl lg:text-5xl font-bold text-[#800000] mb-2 ${oswald.className}`}
              >
                {communitiesServed}
              </div>
              <p className="text-lg text-gray-600">Communities Served</p>
            </motion.div>
            <motion.div
              className="text-center"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div
                className={`text-4xl lg:text-5xl font-bold text-[#800000] mb-2 ${oswald.className}`}
              >
                {partnerOrganizations}
              </div>
              <p className="text-lg text-gray-600">Partner Organizations</p>
            </motion.div>
            <motion.div
              className="text-center"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div
                className={`text-4xl lg:text-5xl font-bold text-[#800000] mb-2 ${oswald.className}`}
              >
                {yearsOfService}
              </div>
              <p className="text-lg text-gray-600">Years of Service</p>
            </motion.div>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              className="relative"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <motion.div
                className="aspect-[4/3] relative overflow-hidden rounded-2xl shadow-xl"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <Image
                  src={impactImage}
                  alt="Success story - community celebration"
                  fill
                  className="object-cover"
                />
              </motion.div>
            </motion.div>
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <h3
                className={`text-2xl lg:text-3xl font-bold text-[#800000] ${oswald.className}`}
              >
                {successStoriesTitle}
              </h3>
              <div className="space-y-4">
                <motion.div
                  className="border-l-4 border-[#800000] pl-6"
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <p className="text-gray-700 italic">
                    &quot;{successStory1}&quot;
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    - {successStory1Author}
                  </p>
                </motion.div>
                <motion.div
                  className="border-l-4 border-[#800000] pl-6"
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  <p className="text-gray-700 italic">
                    &quot;{successStory2}&quot;
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    - {successStory2Author}
                  </p>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-[#800000] text-white">
        <div className="max-w-7xl mx-auto px-5 md:px-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2
              className={`text-3xl lg:text-4xl font-bold mb-6 ${oswald.className}`}
            >
              {ctaTitle}
            </h2>
            <p className="text-xl text-gray-200 mb-8 max-w-3xl mx-auto">
              {ctaDescription}
            </p>
          </motion.div>
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <motion.button
              className="bg-white text-[#800000] px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              {ctaButton1Text}
            </motion.button>
            <motion.button
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-[#800000] transition-colors"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              {ctaButton2Text}
            </motion.button>
            <motion.button
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-[#800000] transition-colors"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              {ctaButton3Text}
            </motion.button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default NGO;
