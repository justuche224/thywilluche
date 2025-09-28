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
} from "lucide-react";
import { Oswald } from "next/font/google";

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
});

const Footer = () => {
  const socials = [
    {
      name: "Facebook",
      url: "#",
      icon: <Facebook className="w-5 h-5" />,
    },
    {
      name: "Instagram",
      url: "#",
      icon: <Instagram className="w-5 h-5" />,
    },
    {
      name: "Youtube",
      url: "#",
      icon: <Youtube className="w-5 h-5" />,
    },
    {
      name: "X",
      url: "#",
      icon: <X className="w-5 h-5" />,
    },
  ];

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
                <p className={`text-sm text-gray-400 ${oswald.className}`}>
                  Author & Motivator
                </p>
              </div>
            </div>
            <p className={`text-gray-300 leading-relaxed ${oswald.className}`}>
              Connecting hearts, uplifting minds, and living one day at a time.
              Join me on this journey of growth and daily victories.
            </p>
            <div className="flex space-x-3">
              {socials.map((social) => (
                <Button
                  key={social.name}
                  size="icon"
                  asChild
                  className="h-10 w-10 border-gray-700 hover:border-primary hover:bg-primary/10"
                >
                  <Link href={social.url}>{social.icon}</Link>
                </Button>
              ))}
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
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-primary" />
                <span className={`text-gray-300 ${oswald.className}`}>
                  hello@thywilluche.com
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-primary" />
                <span className={`text-gray-300 ${oswald.className}`}>
                  +1 (555) 123-4567
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-primary" />
                <span className={`text-gray-300 ${oswald.className}`}>
                  Nigeria
                </span>
              </div>
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
