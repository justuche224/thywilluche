"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Send, Loader2, Handshake } from "lucide-react";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { sendPartnershipInquiry } from "@/actions/partner";

export const PartnerForm: React.FC = () => {
  const [formData, setFormData] = useState({
    organizationName: "",
    contactName: "",
    email: "",
    phone: "",
    website: "",
    partnershipType: "",
    partnershipDetails: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.organizationName.trim())
      newErrors.organizationName = "Organization name is required";
    if (!formData.contactName.trim())
      newErrors.contactName = "Contact name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Email is invalid";
    if (!formData.partnershipType.trim())
      newErrors.partnershipType = "Please select a partnership type";
    if (!formData.partnershipDetails.trim())
      newErrors.partnershipDetails = "Please provide partnership details";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const result = await sendPartnershipInquiry(formData);

      if (result.success) {
        setIsSubmitted(true);
      } else {
        setErrors({ submit: result.message });
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setErrors({ submit: "Failed to submit inquiry. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="max-w-2xl mx-auto p-8 text-center">
        <div className="space-y-4">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <Handshake className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-2xl font-semibold text-gray-900">Thank You!</h3>
          <p className="text-gray-600">
            Your partnership inquiry has been submitted successfully. We&apos;ll
            review your proposal and get back to you soon.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-[#800000] mb-2">
          Partnership Inquiry
        </h2>
        <p className="text-gray-600">
          Build hope that lasts. Let&apos;s explore how we can work together to
          create lasting positive change.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <FieldSet>
          <FieldLegend>Organization Information</FieldLegend>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="organizationName">
                Organization Name *
              </FieldLabel>
              <Input
                id="organizationName"
                value={formData.organizationName}
                onChange={(e) =>
                  setFormData({ ...formData, organizationName: e.target.value })
                }
                placeholder="Enter your organization name"
                aria-invalid={!!errors.organizationName}
              />
              <FieldError>{errors.organizationName}</FieldError>
            </Field>

            <Field>
              <FieldLabel htmlFor="contactName">Contact Name *</FieldLabel>
              <Input
                id="contactName"
                value={formData.contactName}
                onChange={(e) =>
                  setFormData({ ...formData, contactName: e.target.value })
                }
                placeholder="Enter your full name"
                aria-invalid={!!errors.contactName}
              />
              <FieldError>{errors.contactName}</FieldError>
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

            <Field>
              <FieldLabel htmlFor="website">Website</FieldLabel>
              <Input
                id="website"
                type="url"
                value={formData.website}
                onChange={(e) =>
                  setFormData({ ...formData, website: e.target.value })
                }
                placeholder="https://yourwebsite.com (optional)"
              />
            </Field>
          </FieldGroup>
        </FieldSet>

        <FieldSet>
          <FieldLegend>Partnership Details</FieldLegend>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="partnershipType">
                Partnership Type *
              </FieldLabel>
              <Input
                id="partnershipType"
                value={formData.partnershipType}
                onChange={(e) =>
                  setFormData({ ...formData, partnershipType: e.target.value })
                }
                placeholder="e.g., Sponsorship, Joint Events, Social Campaigns, Long-term Collaboration"
                aria-invalid={!!errors.partnershipType}
              />
              <FieldDescription>
                What type of partnership are you interested in?
              </FieldDescription>
              <FieldError>{errors.partnershipType}</FieldError>
            </Field>

            <Field>
              <FieldLabel htmlFor="partnershipDetails">
                Partnership Details *
              </FieldLabel>
              <Textarea
                id="partnershipDetails"
                value={formData.partnershipDetails}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    partnershipDetails: e.target.value,
                  })
                }
                placeholder="Tell us about your proposed partnership, collaboration ideas, or how you envision working together"
                rows={5}
                aria-invalid={!!errors.partnershipDetails}
              />
              <FieldDescription>
                Describe your partnership proposal and how it aligns with our
                mission.
              </FieldDescription>
              <FieldError>{errors.partnershipDetails}</FieldError>
            </Field>
          </FieldGroup>
        </FieldSet>

        <FieldSet>
          <FieldLegend>Additional Information</FieldLegend>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="message">Additional Message</FieldLabel>
              <Textarea
                id="message"
                value={formData.message}
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
                }
                placeholder="Anything else you'd like us to know about your organization or partnership proposal?"
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
              Submitting Inquiry...
            </>
          ) : (
            <>
              <Send className="mr-2 h-4 w-4" />
              Submit Partnership Inquiry
            </>
          )}
        </Button>
      </form>
    </div>
  );
};
