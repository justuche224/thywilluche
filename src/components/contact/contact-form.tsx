"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Send, Loader2 } from "lucide-react";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { sendContactMessage } from "@/actions/contact";

interface ContactFormProps {
  recipientEmail: string;
}

export const ContactForm: React.FC<ContactFormProps> = ({ recipientEmail }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Email is invalid";
    if (!formData.subject.trim()) newErrors.subject = "Subject is required";
    if (!formData.message.trim()) newErrors.message = "Message is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const result = await sendContactMessage({
        ...formData,
        recipientEmail,
      });

      if (result.success) {
        setIsSubmitted(true);
      } else {
        setErrors({ submit: result.message });
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setErrors({ submit: "Failed to send message. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="max-w-2xl mx-auto p-8 text-center">
        <div className="space-y-4">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <Send className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-2xl font-semibold text-gray-900">Thank You!</h3>
          <p className="text-gray-600">
            Your message has been sent successfully. I&apos;ll get back to you
            within 24 hours.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Send a Message
        </h2>
        <p className="text-gray-600">
          Have a question or want to connect? I&apos;d love to hear from you.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <FieldSet>
          <FieldLegend>Contact Information</FieldLegend>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="name">Full Name *</FieldLabel>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Enter your full name"
                aria-invalid={!!errors.name}
              />
              <FieldError>{errors.name}</FieldError>
            </Field>

            <Field>
              <FieldLabel htmlFor="email">Email Address *</FieldLabel>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="Enter your email address"
                aria-invalid={!!errors.email}
              />
              <FieldError>{errors.email}</FieldError>
            </Field>

            <Field>
              <FieldLabel htmlFor="subject">Subject *</FieldLabel>
              <Input
                id="subject"
                value={formData.subject}
                onChange={(e) =>
                  setFormData({ ...formData, subject: e.target.value })
                }
                placeholder="What is this about?"
                aria-invalid={!!errors.subject}
              />
              <FieldError>{errors.subject}</FieldError>
            </Field>
          </FieldGroup>
        </FieldSet>

        <FieldSet>
          <FieldLegend>Message</FieldLegend>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="message">Your Message *</FieldLabel>
              <Textarea
                id="message"
                value={formData.message}
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
                }
                placeholder="Tell me what's on your mind..."
                rows={6}
                aria-invalid={!!errors.message}
              />
              <FieldDescription>
                Share your thoughts, questions, or feedback
              </FieldDescription>
              <FieldError>{errors.message}</FieldError>
            </Field>
          </FieldGroup>
        </FieldSet>

        {errors.submit && (
          <div className="text-red-600 text-sm text-center">
            {errors.submit}
          </div>
        )}

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sending Message...
            </>
          ) : (
            <>
              <Send className="mr-2 h-4 w-4" />
              Send Message
            </>
          )}
        </Button>
      </form>
    </div>
  );
};
