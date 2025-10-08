import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Facebook,
  Instagram,
  X,
  Youtube,
  Mail,
  Phone,
  MapPin,
  Linkedin,
  LucideIcon,
} from "lucide-react";
import { Oswald } from "next/font/google";
import { getContactInfo, getSocials } from "@/actions/contact-info";

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
});

const iconMap: Record<string, LucideIcon> = {
  facebook: Facebook,
  instagram: Instagram,
  x: X,
  youtube: Youtube,
};

const Footer = async () => {
  const contactInfo = await getContactInfo();
  const socials = await getSocials();

  const quickLinks = [
    { name: "Home", url: "/" },
    { name: "About", url: "/about" },
    { name: "Books", url: "/books" },
    { name: "Community", url: "/community" },
    { name: "Contact", url: "/contact" },
  ];

  const resources = [
    { name: "Blog", url: "/blog" },
    { name: "Daily Tips", url: "/tips" },
    { name: "Testimonials", url: "/testimonials" },
    { name: "FAQ", url: "/faq" },
    { name: "Privacy Policy", url: "/privacy" },
  ];

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Section */}
          <div className="lg:col-span-1 space-y-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <span
                  className={`text-white font-bold text-lg ${oswald.className}`}
                >
                  T
                </span>
              </div>
              <div>
                <h3 className={`text-xl font-semibold ${oswald.className}`}>
                  Thywill Uche
                </h3>
                <p
                  className={`text-sm text-gray-400 ${oswald.className} italic`}
                >
                  Founder, Creator, and Life Coach
                </p>
                <p
                  className={`text-sm text-gray-400 ${oswald.className} italic`}
                >
                  Author of Days I Do Not Die
                </p>
              </div>
            </div>
            <p className={`text-gray-300 leading-relaxed ${oswald.className}`}>
              Empowering others to heal, create, and rise through authentic
              storytelling. Join me on this ongoing journey of growth, purpose,
              and daily victories.
            </p>
            <div className="flex space-x-3">
              {socials.map((social) => {
                const IconComponent = iconMap[social.key.toLowerCase()];
                return (
                  <Button
                    key={social.key}
                    size="icon"
                    asChild
                    className="h-10 w-10 border-gray-700 hover:border-primary hover:bg-primary/10"
                  >
                    <Link
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {IconComponent ? (
                        <IconComponent className="w-5 h-5" />
                      ) : (
                        <X className="w-5 h-5" />
                      )}
                    </Link>
                  </Button>
                );
              })}
              <Button
                size={"icon"}
                asChild
                className="h-10 w-10 border-gray-700 hover:border-primary hover:bg-primary/10"
              >
                <Link
                  target="_blank"
                  rel="noopener noreferrer"
                  href={
                    "https://www.linkedin.com/in/thywill-uche-551680273?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"
                  }
                >
                  <Linkedin className="w-5 h-5" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h4 className={`text-lg font-semibold ${oswald.className}`}>
              Quick Links
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.url}
                    className={`text-gray-300 hover:text-primary transition-colors ${oswald.className}`}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-6">
            <h4 className={`text-lg font-semibold ${oswald.className}`}>
              Resources
            </h4>
            <ul className="space-y-3">
              {resources.map((resource) => (
                <li key={resource.name}>
                  <Link
                    href={resource.url}
                    className={`text-gray-300 hover:text-primary transition-colors ${oswald.className}`}
                  >
                    {resource.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <h4 className={`text-lg font-semibold ${oswald.className}`}>
              Get In Touch
            </h4>
            <div className="space-y-4">
              {contactInfo.email?.value && (
                <a
                  href={`mailto:${contactInfo.email.value}`}
                  className="flex items-center space-x-3 hover:text-primary transition-colors"
                >
                  <Mail className="w-5 h-5 text-primary" />
                  <span className={`text-gray-300 ${oswald.className}`}>
                    {contactInfo.email.value}
                  </span>
                </a>
              )}
              {contactInfo.phone?.value && (
                <a
                  href={`tel:${contactInfo.phone.value}`}
                  className="flex items-center space-x-3 hover:text-primary transition-colors"
                >
                  <Phone className="w-5 h-5 text-primary" />
                  <span className={`text-gray-300 ${oswald.className}`}>
                    {contactInfo.phone.value}
                  </span>
                </a>
              )}
              {contactInfo.address?.value && (
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-primary" />
                  <span className={`text-gray-300 ${oswald.className}`}>
                    {contactInfo.address.value}
                  </span>
                </div>
              )}
            </div>
            <div className="pt-4">
              <Button
                asChild
                className={`bg-primary hover:bg-primary/90 ${oswald.className}`}
              >
                <Link href="/contact">Contact Me</Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-center md:text-left">
              <p className={`text-gray-400 ${oswald.className}`}>
                © {new Date().getFullYear()} Thywill Uche. All rights reserved.
              </p>
            </div>
            <div className="flex space-x-6">
              <Link
                href="/terms"
                className={`text-gray-400 hover:text-primary transition-colors ${oswald.className}`}
              >
                Terms of Service
              </Link>
              <Link
                href="/privacy"
                className={`text-gray-400 hover:text-primary transition-colors ${oswald.className}`}
              >
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
