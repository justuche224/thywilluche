import React from "react";
import { getContactInfo, getSocials } from "@/actions/contact-info";
import { ContactForm } from "@/components/contact";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Facebook,
  Instagram,
  X,
  Youtube,
  LucideIcon,
} from "lucide-react";
import { Oswald } from "next/font/google";
import { georgiaItalic } from "@/utils/georgia-italic";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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

const ContactPage = async () => {
  const contactInfo = await getContactInfo();
  const socials = await getSocials();

  const contactItems = [
    {
      icon: Mail,
      label: "Email",
      value: contactInfo.email?.value,
      link: contactInfo.email?.value
        ? `mailto:${contactInfo.email.value}`
        : null,
    },
    {
      icon: Phone,
      label: "Phone",
      value: contactInfo.phone?.value,
      link: contactInfo.phone?.value ? `tel:${contactInfo.phone.value}` : null,
    },
    {
      icon: MapPin,
      label: "Location",
      value: contactInfo.address?.value,
      link: null,
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/5 to-primary/10 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h1
              className={`text-4xl lg:text-5xl xl:text-6xl ${georgiaItalic.className} font-bold text-gray-900 mb-6`}
            >
              Get In Touch
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
              I&apos;d love to hear from you. Whether you have a question, want
              to share your story, or just want to connect, don&apos;t hesitate
              to reach out.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-12 max-w-6xl mx-auto">
            {/* Contact Information */}
            <div className="lg:col-span-1 space-y-8">
              <div>
                <h2
                  className={`text-3xl font-bold text-gray-900 mb-6 ${oswald.className}`}
                >
                  Contact Information
                </h2>
                <p className="text-gray-600 mb-8">
                  Here are the best ways to reach me. I typically respond within
                  24 hours.
                </p>
              </div>

              {/* Contact Cards */}
              <div className="space-y-4">
                {contactItems.map((item, index) => {
                  const IconComponent = item.icon;
                  return (
                    <Card
                      key={index}
                      className="hover:shadow-md transition-shadow bg-white/20 backdrop-blur-sm"
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className="p-3 bg-primary/10 rounded-lg shrink-0">
                            <IconComponent className="w-6 h-6 text-primary" />
                          </div>
                          <div>
                            <h3
                              className={`font-semibold text-gray-900 mb-1 ${oswald.className}`}
                            >
                              {item.label}
                            </h3>
                            {item.value ? (
                              item.link ? (
                                <a
                                  href={item.link}
                                  className="text-gray-600 hover:text-primary transition-colors"
                                >
                                  {item.value}
                                </a>
                              ) : (
                                <p className="text-gray-600">{item.value}</p>
                              )
                            ) : (
                              <p className="text-gray-400 italic">
                                Not provided
                              </p>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {/* Social Media */}
              {socials.length > 0 && (
                <Card className="bg-white/20 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle
                      className={`flex items-center gap-2 ${oswald.className}`}
                    >
                      Follow Me
                    </CardTitle>
                    <CardDescription>
                      Connect with me on social media
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-3">
                      {socials.map((social) => {
                        const IconComponent = iconMap[social.key.toLowerCase()];
                        return (
                          <Button
                            key={social.key}
                            size="sm"
                            variant="outline"
                            asChild
                            className="gap-2"
                          >
                            <a
                              href={social.url}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {IconComponent && (
                                <IconComponent className="w-4 h-4" />
                              )}
                              <span className="capitalize">{social.label}</span>
                            </a>
                          </Button>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Response Time */}
              <Card className="bg-white/20 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-primary/10 rounded-lg shrink-0">
                      <Clock className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3
                        className={`font-semibold text-gray-900 mb-2 ${oswald.className}`}
                      >
                        Response Time
                      </h3>
                      <p className="text-gray-600 text-sm">
                        I typically respond to messages within 24 hours. For
                        urgent matters, please call or use the booking forms for
                        faster response.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card className="bg-white/20 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className={`text-2xl ${oswald.className}`}>
                    Send a Message
                  </CardTitle>
                  <CardDescription>
                    Fill out the form below and I&apos;ll get back to you as
                    soon as possible.
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-8">
                  <ContactForm
                    recipientEmail={contactInfo.email?.value || ""}
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h2
              className={`text-3xl lg:text-4xl font-bold text-gray-900 mb-6 ${oswald.className}`}
            >
              Ready to Work Together?
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              If you&apos;re interested in my services, check out my booking
              pages for coaching, consulting, or ghostwriting services.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button size="lg" asChild>
                <a href="/services/coaching/booking">Book Coaching Session</a>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <a href="/services/consulting/booking">Schedule Consultation</a>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <a href="/services/ghostwriting/booking">
                  Discuss Writing Project
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
