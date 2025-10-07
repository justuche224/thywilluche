"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Send, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { submitBookingForm, BookingFormData } from "@/actions/booking";
import { AvailabilityCalendar } from "./availability-calendar";

interface BookingFormProps {
  serviceType: "coaching" | "consulting" | "ghostwriting" | "custom";
  serviceName: string;
}

type ServiceFields = {
  sessionType?: string[];
  projectType?: string[];
  requestType?: string[];
  duration?: string[];
  scope?: string[];
  timeline?: string[];
  urgency?: string[];
};

type ServiceDetail = {
  title: string;
  description: string;
  fields: ServiceFields;
};

const serviceDetails: Record<string, ServiceDetail> = {
  coaching: {
    title: "Personal Coaching Session",
    description: "Book a one-on-one coaching session",
    fields: {
      sessionType: [
        "Initial Consultation",
        "Regular Session",
        "Intensive Session",
      ],
      duration: ["60 minutes", "90 minutes", "120 minutes"],
    },
  },
  consulting: {
    title: "Strategic Consulting Call",
    description: "Schedule a strategic consultation",
    fields: {
      projectType: [
        "Mental Health Initiative",
        "Content Strategy",
        "Community Building",
        "Brand Development",
      ],
      scope: ["Discovery Call", "Strategy Session", "Ongoing Support"],
    },
  },
  ghostwriting: {
    title: "Ghostwriting Project Inquiry",
    description: "Discuss your writing project",
    fields: {
      projectType: [
        "Memoir",
        "Self-Help Book",
        "Personal Narrative",
        "Business Book",
      ],
      timeline: ["3-6 months", "6-12 months", "12+ months", "Flexible"],
    },
  },
  custom: {
    title: "Custom Request",
    description: "Tell us about your specific needs",
    fields: {
      requestType: [
        "General Inquiry",
        "Partnership",
        "Speaking Engagement",
        "Other",
      ],
      urgency: ["Low", "Medium", "High"],
    },
  },
};

export const BookingForm: React.FC<BookingFormProps> = ({
  serviceType,
  serviceName,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    service: serviceName,
    type: "",
    duration: "",
    scope: "",
    timeline: "",
    urgency: "",
    preferredDate: null as Date | null,
    preferredTime: "",
    brief: "",
    deliverables: "",
    deadline: "",
    budget: "",
    additionalInfo: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const details = serviceDetails[serviceType];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Email is invalid";
    if (!formData.type) newErrors.type = "Service type is required";
    if (!formData.brief.trim()) newErrors.brief = "Project brief is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const bookingData: BookingFormData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone || undefined,
        service: formData.service,
        type: formData.type,
        duration:
          formData.duration ||
          formData.scope ||
          formData.timeline ||
          formData.urgency ||
          undefined,
        preferredDate: formData.preferredDate
          ? format(formData.preferredDate, "PPP")
          : undefined,
        preferredTime: formData.preferredTime || undefined,
        brief: formData.brief,
        deliverables: formData.deliverables || undefined,
        deadline: formData.deadline || undefined,
        budget: formData.budget || undefined,
        additionalInfo: formData.additionalInfo || undefined,
      };

      const result = await submitBookingForm(bookingData);

      if (result.success) {
        setIsSubmitted(true);
      } else {
        if (result.errors) {
          const newErrors: Record<string, string> = {};
          result.errors.forEach(
            (error: { field: string | number; message: string }) => {
              newErrors[String(error.field)] = error.message;
            }
          );
          setErrors(newErrors);
        } else {
          setErrors({ submit: result.message });
        }
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
      <div className="max-w-4xl mx-auto p-8 text-center">
        <div className="space-y-4">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <Send className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-2xl font-semibold text-gray-900">Thank You!</h3>
          <p className="text-gray-600">
            Your booking request has been sent successfully. We&apos;ll get back
            to you within 24 hours to discuss your project and schedule a
            consultation.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl bg-white rounded-lg shadow-md mx-auto p-8">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          {details.title}
        </h2>
        <p className="text-gray-600">{details.description}</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
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
                    placeholder="Enter your phone number"
                  />
                  <FieldDescription>
                    Optional - for urgent matters
                  </FieldDescription>
                </Field>
              </FieldGroup>
            </FieldSet>

            <FieldSet>
              <FieldLegend>Service Details</FieldLegend>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="type">Service Type *</FieldLabel>
                  <Select
                    value={formData.type}
                    onValueChange={(value) =>
                      setFormData({ ...formData, type: value })
                    }
                  >
                    <SelectTrigger aria-invalid={!!errors.type}>
                      <SelectValue placeholder="Select service type" />
                    </SelectTrigger>
                    <SelectContent>
                      {details.fields.sessionType?.map((option: string) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                      {details.fields.projectType?.map((option: string) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                      {details.fields.requestType?.map((option: string) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FieldError>{errors.type}</FieldError>
                </Field>

                {details.fields.duration && (
                  <Field>
                    <FieldLabel htmlFor="duration">Duration</FieldLabel>
                    <Select
                      value={formData.duration}
                      onValueChange={(value) =>
                        setFormData({ ...formData, duration: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select duration" />
                      </SelectTrigger>
                      <SelectContent>
                        {details.fields.duration?.map((option: string) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                )}

                {details.fields.scope && (
                  <Field>
                    <FieldLabel htmlFor="scope">Project Scope</FieldLabel>
                    <Select
                      value={formData.scope}
                      onValueChange={(value) =>
                        setFormData({ ...formData, scope: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select project scope" />
                      </SelectTrigger>
                      <SelectContent>
                        {details.fields.scope?.map((option: string) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                )}

                {details.fields.timeline && (
                  <Field>
                    <FieldLabel htmlFor="timeline">
                      Preferred Timeline
                    </FieldLabel>
                    <Select
                      value={formData.timeline}
                      onValueChange={(value) =>
                        setFormData({ ...formData, timeline: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select timeline" />
                      </SelectTrigger>
                      <SelectContent>
                        {details.fields.timeline?.map((option: string) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                )}

                {details.fields.urgency && (
                  <Field>
                    <FieldLabel htmlFor="urgency">Urgency Level</FieldLabel>
                    <Select
                      value={formData.urgency}
                      onValueChange={(value) =>
                        setFormData({ ...formData, urgency: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select urgency level" />
                      </SelectTrigger>
                      <SelectContent>
                        {details.fields.urgency?.map((option: string) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                )}
              </FieldGroup>
            </FieldSet>

            <FieldSet>
              <FieldLegend>Schedule & Availability</FieldLegend>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="preferredDate">
                    Preferred Date
                  </FieldLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !formData.preferredDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.preferredDate
                          ? format(formData.preferredDate, "PPP")
                          : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={formData.preferredDate || undefined}
                        onSelect={(date) =>
                          setFormData({
                            ...formData,
                            preferredDate: date || null,
                          })
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FieldDescription>
                    When would you like to schedule?
                  </FieldDescription>
                </Field>

                <Field>
                  <FieldLabel htmlFor="preferredTime">
                    Preferred Time
                  </FieldLabel>
                  <Select
                    value={formData.preferredTime}
                    onValueChange={(value) =>
                      setFormData({ ...formData, preferredTime: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select time preference" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="morning">
                        Morning (9 AM - 12 PM)
                      </SelectItem>
                      <SelectItem value="afternoon">
                        Afternoon (12 PM - 5 PM)
                      </SelectItem>
                      <SelectItem value="evening">
                        Evening (5 PM - 8 PM)
                      </SelectItem>
                      <SelectItem value="flexible">Flexible</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
              </FieldGroup>
            </FieldSet>

            <FieldSet>
              <FieldLegend>Project Details</FieldLegend>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="brief">Project Brief *</FieldLabel>
                  <Textarea
                    id="brief"
                    value={formData.brief}
                    onChange={(e) =>
                      setFormData({ ...formData, brief: e.target.value })
                    }
                    placeholder="Tell us about your project, goals, and what you hope to achieve..."
                    rows={4}
                    aria-invalid={!!errors.brief}
                  />
                  <FieldDescription>
                    Provide a detailed description of your project or goals
                  </FieldDescription>
                  <FieldError>{errors.brief}</FieldError>
                </Field>

                <Field>
                  <FieldLabel htmlFor="deliverables">
                    Expected Deliverables
                  </FieldLabel>
                  <Textarea
                    id="deliverables"
                    value={formData.deliverables}
                    onChange={(e) =>
                      setFormData({ ...formData, deliverables: e.target.value })
                    }
                    placeholder="What specific deliverables are you looking for?"
                    rows={3}
                  />
                  <FieldDescription>
                    What would you like to receive from this engagement?
                  </FieldDescription>
                </Field>

                <Field>
                  <FieldLabel htmlFor="deadline">Timeline/Deadline</FieldLabel>
                  <Input
                    id="deadline"
                    value={formData.deadline}
                    onChange={(e) =>
                      setFormData({ ...formData, deadline: e.target.value })
                    }
                    placeholder="e.g., End of next month, ASAP, etc."
                  />
                  <FieldDescription>
                    When do you need this completed?
                  </FieldDescription>
                </Field>

                <Field>
                  <FieldLabel htmlFor="budget">Budget Range</FieldLabel>
                  <Select
                    value={formData.budget}
                    onValueChange={(value) =>
                      setFormData({ ...formData, budget: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select budget range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="under-1k">Under $1,000</SelectItem>
                      <SelectItem value="1k-5k">$1,000 - $5,000</SelectItem>
                      <SelectItem value="5k-10k">$5,000 - $10,000</SelectItem>
                      <SelectItem value="10k-25k">$10,000 - $25,000</SelectItem>
                      <SelectItem value="25k-plus">$25,000+</SelectItem>
                      <SelectItem value="discuss">
                        Let&apos;s discuss
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FieldDescription>
                    Help us understand your investment range
                  </FieldDescription>
                </Field>

                <Field>
                  <FieldLabel htmlFor="additionalInfo">
                    Additional Information
                  </FieldLabel>
                  <Textarea
                    id="additionalInfo"
                    value={formData.additionalInfo}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        additionalInfo: e.target.value,
                      })
                    }
                    placeholder="Any other details, questions, or requirements..."
                    rows={3}
                  />
                  <FieldDescription>
                    Anything else we should know?
                  </FieldDescription>
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
                  Sending Request...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Send Booking Request
                </>
              )}
            </Button>
          </form>
        </div>

        <div className="lg:col-span-1">
          {serviceType !== "custom" && (
            <AvailabilityCalendar serviceType={serviceType} />
          )}
        </div>
      </div>
    </div>
  );
};
