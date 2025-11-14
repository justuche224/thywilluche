"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Send, Loader2, Heart } from "lucide-react";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { sendDonationInquiry } from "@/actions/donation";

export const DonationForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    donationType: "",
    amount: "",
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
    if (!formData.donationType.trim())
      newErrors.donationType = "Please select a donation type";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const result = await sendDonationInquiry(formData);

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
            <Heart className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-2xl font-semibold text-gray-900">Thank You!</h3>
          <p className="text-gray-600">
            Your donation inquiry has been submitted successfully. We&apos;ll
            review your request and get back to you soon with next steps.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-[#800000] mb-2">
          Donation Inquiry
        </h2>
        <p className="text-gray-600">
          Fuel a dream. Your support helps us reach more communities and create
          lasting positive change.
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
          <FieldLegend>Donation Details</FieldLegend>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="donationType">Donation Type *</FieldLabel>
              <Input
                id="donationType"
                value={formData.donationType}
                onChange={(e) =>
                  setFormData({ ...formData, donationType: e.target.value })
                }
                placeholder="e.g., Community Work, Health Support, Production Costs, Coaching Outreach"
                aria-invalid={!!errors.donationType}
              />
              <FieldDescription>
                What would you like to support? (e.g., community work, health
                support, production costs, coaching outreach)
              </FieldDescription>
              <FieldError>{errors.donationType}</FieldError>
            </Field>

            <Field>
              <FieldLabel htmlFor="amount">Amount (Optional)</FieldLabel>
              <Input
                id="amount"
                type="text"
                value={formData.amount}
                onChange={(e) =>
                  setFormData({ ...formData, amount: e.target.value })
                }
                placeholder="e.g., $100, €50, or specify your contribution"
              />
              <FieldDescription>
                If you have a specific amount in mind, please let us know
              </FieldDescription>
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
                placeholder="Anything else you'd like us to know about your donation?"
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
              Submit Donation Inquiry
            </>
          )}
        </Button>
      </form>
    </div>
  );
};
