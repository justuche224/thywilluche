"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Send, Loader2, HeartHandshake } from "lucide-react";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { sendVolunteerApplication } from "@/actions/volunteer";

export const VolunteerForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    skills: "",
    availability: "",
    interests: "",
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
    if (!formData.skills.trim())
      newErrors.skills = "Please tell us about your skills";
    if (!formData.availability.trim())
      newErrors.availability = "Please tell us about your availability";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const result = await sendVolunteerApplication(formData);

      if (result.success) {
        setIsSubmitted(true);
      } else {
        setErrors({ submit: result.message });
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setErrors({ submit: "Failed to submit application. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="max-w-2xl mx-auto p-8 text-center">
        <div className="space-y-4">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <HeartHandshake className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-2xl font-semibold text-gray-900">Thank You!</h3>
          <p className="text-gray-600">
            Your volunteer application has been submitted successfully.
            We&apos;ll review your application and get back to you soon.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-[#800000] mb-2">
          Volunteer Application
        </h2>
        <p className="text-gray-600">
          Share your heart and hands. Tell us about yourself and how you&apos;d
          like to help.
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
              <FieldLabel htmlFor="phone">Phone Number</FieldLabel>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                placeholder="Enter your phone number (optional)"
              />
            </Field>
          </FieldGroup>
        </FieldSet>

        <FieldSet>
          <FieldLegend>Your Skills & Experience</FieldLegend>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="skills">Skills & Experience *</FieldLabel>
              <Textarea
                id="skills"
                value={formData.skills}
                onChange={(e) =>
                  setFormData({ ...formData, skills: e.target.value })
                }
                placeholder="Tell us about your skills, experience, or expertise (e.g., editing, marketing, event support, creative assistance)"
                rows={4}
                aria-invalid={!!errors.skills}
              />
              <FieldDescription>
                What skills or experience can you bring to our mission?
              </FieldDescription>
              <FieldError>{errors.skills}</FieldError>
            </Field>
          </FieldGroup>
        </FieldSet>

        <FieldSet>
          <FieldLegend>Availability</FieldLegend>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="availability">Availability *</FieldLabel>
              <Textarea
                id="availability"
                value={formData.availability}
                onChange={(e) =>
                  setFormData({ ...formData, availability: e.target.value })
                }
                placeholder="Tell us about your availability (e.g., hours per week, days available, time commitment)"
                rows={3}
                aria-invalid={!!errors.availability}
              />
              <FieldDescription>
                How much time can you commit to volunteering?
              </FieldDescription>
              <FieldError>{errors.availability}</FieldError>
            </Field>
          </FieldGroup>
        </FieldSet>

        <FieldSet>
          <FieldLegend>Additional Information</FieldLegend>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="interests">Areas of Interest</FieldLabel>
              <Textarea
                id="interests"
                value={formData.interests}
                onChange={(e) =>
                  setFormData({ ...formData, interests: e.target.value })
                }
                placeholder="Which areas interest you most? (e.g., education, healthcare, community development)"
                rows={3}
              />
              <FieldDescription>
                What areas of our work are you most passionate about?
              </FieldDescription>
            </Field>

            <Field>
              <FieldLabel htmlFor="message">Additional Message</FieldLabel>
              <Textarea
                id="message"
                value={formData.message}
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
                }
                placeholder="Anything else you'd like us to know?"
                rows={4}
              />
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
              Submitting Application...
            </>
          ) : (
            <>
              <Send className="mr-2 h-4 w-4" />
              Submit Application
            </>
          )}
        </Button>
      </form>
    </div>
  );
};
