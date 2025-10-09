"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { updateNgoContent } from "@/actions/admin/ngo-content";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import Image from "next/image";

interface NgoContentManagerProps {
  initialData: {
    hero: Record<string, string>;
    mission: Record<string, string>;
    vision: Record<string, string>;
    programs: Record<string, string>;
    education: Record<string, string>;
    healthcare: Record<string, string>;
    development: Record<string, string>;
    impact: Record<string, string>;
    cta: Record<string, string>;
  };
}

export default function NgoContentManager({
  initialData,
}: NgoContentManagerProps) {
  const [isLoading, setIsLoading] = useState(false);

  const [heroPreviewImage, setHeroPreviewImage] = useState<string | null>(
    initialData.hero.image || null
  );
  const [missionPreviewImage, setMissionPreviewImage] = useState<string | null>(
    initialData.mission.image || null
  );
  const [visionPreviewImage, setVisionPreviewImage] = useState<string | null>(
    initialData.vision.image || null
  );
  const [educationPreviewImage, setEducationPreviewImage] = useState<
    string | null
  >(initialData.education.image || null);
  const [healthcarePreviewImage, setHealthcarePreviewImage] = useState<
    string | null
  >(initialData.healthcare.image || null);
  const [developmentPreviewImage, setDevelopmentPreviewImage] = useState<
    string | null
  >(initialData.development.image || null);
  const [impactPreviewImage, setImpactPreviewImage] = useState<string | null>(
    initialData.impact.image || null
  );

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: (value: string | null) => void
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setter(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveAll = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const formData = new FormData(e.currentTarget);
      formData.append("existingHeroImage", initialData.hero.image || "");
      formData.append("existingMissionImage", initialData.mission.image || "");
      formData.append("existingVisionImage", initialData.vision.image || "");
      formData.append(
        "existingEducationImage",
        initialData.education.image || ""
      );
      formData.append(
        "existingHealthcareImage",
        initialData.healthcare.image || ""
      );
      formData.append(
        "existingDevelopmentImage",
        initialData.development.image || ""
      );
      formData.append("existingImpactImage", initialData.impact.image || "");

      const result = await updateNgoContent(formData);

      if (result.success) {
        toast.success("NGO content updated successfully!");
        window.dispatchEvent(new CustomEvent("refreshNgoPreview"));
      } else {
        toast.error("Failed to update NGO content");
      }
    } catch (error) {
      console.error("Error updating NGO content:", error);
      toast.error("An error occurred while updating");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSaveAll} className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">NGO Page Content Manager</h1>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Save All Changes"
          )}
        </Button>
      </div>

      {/* Hero Section */}
      <Card>
        <CardHeader>
          <CardTitle>Hero Section</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="heroImage">Hero Image</Label>
            {heroPreviewImage && (
              <div className="mb-4">
                <Image
                  src={heroPreviewImage}
                  alt="Hero Preview"
                  width={200}
                  height={200}
                  className="rounded-lg object-cover"
                />
              </div>
            )}
            <Input
              id="heroImage"
              name="heroImage"
              type="file"
              accept="image/*"
              onChange={(e) => handleImageChange(e, setHeroPreviewImage)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="heroTitle">Hero Title</Label>
            <Input
              id="heroTitle"
              name="heroTitle"
              defaultValue={initialData.hero.title || ""}
              placeholder="Thywill Fountain of Hope for the Poor Initiative"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="heroSubtitle">Hero Subtitle</Label>
            <Input
              id="heroSubtitle"
              name="heroSubtitle"
              defaultValue={initialData.hero.subtitle || ""}
              placeholder="Building bridges of hope, one community at a time"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="heroDescription">Hero Description</Label>
            <Textarea
              id="heroDescription"
              name="heroDescription"
              defaultValue={initialData.hero.description || ""}
              rows={4}
              placeholder="We are dedicated to empowering communities through education, healthcare, and sustainable development initiatives..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="heroButton1Text">First Button Text</Label>
              <Input
                id="heroButton1Text"
                name="heroButton1Text"
                defaultValue={initialData.hero.button1Text || ""}
                placeholder="Get Involved"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="heroButton2Text">Second Button Text</Label>
              <Input
                id="heroButton2Text"
                name="heroButton2Text"
                defaultValue={initialData.hero.button2Text || ""}
                placeholder="Learn More"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Mission Section */}
      <Card>
        <CardHeader>
          <CardTitle>Mission Section</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="missionImage">Mission Image</Label>
            {missionPreviewImage && (
              <div className="mb-4">
                <Image
                  src={missionPreviewImage}
                  alt="Mission Preview"
                  width={200}
                  height={200}
                  className="rounded-lg object-cover"
                />
              </div>
            )}
            <Input
              id="missionImage"
              name="missionImage"
              type="file"
              accept="image/*"
              onChange={(e) => handleImageChange(e, setMissionPreviewImage)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="missionTitle">Mission Title</Label>
            <Input
              id="missionTitle"
              name="missionTitle"
              defaultValue={initialData.mission.title || ""}
              placeholder="Our Mission"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="missionDescription1">Mission Description 1</Label>
            <Textarea
              id="missionDescription1"
              name="missionDescription1"
              defaultValue={initialData.mission.description1 || ""}
              rows={4}
              placeholder="To empower underserved communities through comprehensive education programs..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="missionDescription2">Mission Description 2</Label>
            <Textarea
              id="missionDescription2"
              name="missionDescription2"
              defaultValue={initialData.mission.description2 || ""}
              rows={4}
              placeholder="We believe that every individual deserves the opportunity to reach their full potential..."
            />
          </div>
        </CardContent>
      </Card>

      {/* Vision Section */}
      <Card>
        <CardHeader>
          <CardTitle>Vision Section</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="visionImage">Vision Image</Label>
            {visionPreviewImage && (
              <div className="mb-4">
                <Image
                  src={visionPreviewImage}
                  alt="Vision Preview"
                  width={200}
                  height={200}
                  className="rounded-lg object-cover"
                />
              </div>
            )}
            <Input
              id="visionImage"
              name="visionImage"
              type="file"
              accept="image/*"
              onChange={(e) => handleImageChange(e, setVisionPreviewImage)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="visionTitle">Vision Title</Label>
            <Input
              id="visionTitle"
              name="visionTitle"
              defaultValue={initialData.vision.title || ""}
              placeholder="Our Vision"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="visionDescription1">Vision Description 1</Label>
            <Textarea
              id="visionDescription1"
              name="visionDescription1"
              defaultValue={initialData.vision.description1 || ""}
              rows={4}
              placeholder="A world where every community has access to quality education, healthcare, and economic opportunities..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="visionDescription2">Vision Description 2</Label>
            <Textarea
              id="visionDescription2"
              name="visionDescription2"
              defaultValue={initialData.vision.description2 || ""}
              rows={4}
              placeholder="We envision empowered communities that are self-sustainable, resilient, and capable of creating their own pathways to prosperity..."
            />
          </div>
        </CardContent>
      </Card>

      {/* Programs Section */}
      <Card>
        <CardHeader>
          <CardTitle>Programs Section</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="programsTitle">Programs Title</Label>
            <Input
              id="programsTitle"
              name="programsTitle"
              defaultValue={initialData.programs.title || ""}
              placeholder="Our Programs"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="programsSubtitle">Programs Subtitle</Label>
            <Textarea
              id="programsSubtitle"
              name="programsSubtitle"
              defaultValue={initialData.programs.subtitle || ""}
              rows={3}
              placeholder="We implement comprehensive programs designed to address the multifaceted challenges faced by underserved communities."
            />
          </div>
        </CardContent>
      </Card>

      {/* Education Program */}
      <Card>
        <CardHeader>
          <CardTitle>Education Program</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="educationImage">Education Program Image</Label>
            {educationPreviewImage && (
              <div className="mb-4">
                <Image
                  src={educationPreviewImage}
                  alt="Education Preview"
                  width={200}
                  height={200}
                  className="rounded-lg object-cover"
                />
              </div>
            )}
            <Input
              id="educationImage"
              name="educationImage"
              type="file"
              accept="image/*"
              onChange={(e) => handleImageChange(e, setEducationPreviewImage)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="educationTitle">Education Program Title</Label>
            <Input
              id="educationTitle"
              name="educationTitle"
              defaultValue={initialData.education.title || ""}
              placeholder="Education Initiative"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="educationDescription">
              Education Program Description
            </Label>
            <Textarea
              id="educationDescription"
              name="educationDescription"
              defaultValue={initialData.education.description || ""}
              rows={4}
              placeholder="Providing quality education resources, teacher training, and learning materials to schools in underserved communities."
            />
          </div>
        </CardContent>
      </Card>

      {/* Healthcare Program */}
      <Card>
        <CardHeader>
          <CardTitle>Healthcare Program</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="healthcareImage">Healthcare Program Image</Label>
            {healthcarePreviewImage && (
              <div className="mb-4">
                <Image
                  src={healthcarePreviewImage}
                  alt="Healthcare Preview"
                  width={200}
                  height={200}
                  className="rounded-lg object-cover"
                />
              </div>
            )}
            <Input
              id="healthcareImage"
              name="healthcareImage"
              type="file"
              accept="image/*"
              onChange={(e) => handleImageChange(e, setHealthcarePreviewImage)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="healthcareTitle">Healthcare Program Title</Label>
            <Input
              id="healthcareTitle"
              name="healthcareTitle"
              defaultValue={initialData.healthcare.title || ""}
              placeholder="Healthcare Access"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="healthcareDescription">
              Healthcare Program Description
            </Label>
            <Textarea
              id="healthcareDescription"
              name="healthcareDescription"
              defaultValue={initialData.healthcare.description || ""}
              rows={4}
              placeholder="Bringing essential healthcare services directly to communities through mobile clinics and health education programs."
            />
          </div>
        </CardContent>
      </Card>

      {/* Community Development Program */}
      <Card>
        <CardHeader>
          <CardTitle>Community Development Program</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="developmentImage">Development Program Image</Label>
            {developmentPreviewImage && (
              <div className="mb-4">
                <Image
                  src={developmentPreviewImage}
                  alt="Development Preview"
                  width={200}
                  height={200}
                  className="rounded-lg object-cover"
                />
              </div>
            )}
            <Input
              id="developmentImage"
              name="developmentImage"
              type="file"
              accept="image/*"
              onChange={(e) => handleImageChange(e, setDevelopmentPreviewImage)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="developmentTitle">Development Program Title</Label>
            <Input
              id="developmentTitle"
              name="developmentTitle"
              defaultValue={initialData.development.title || ""}
              placeholder="Community Development"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="developmentDescription">
              Development Program Description
            </Label>
            <Textarea
              id="developmentDescription"
              name="developmentDescription"
              defaultValue={initialData.development.description || ""}
              rows={4}
              placeholder="Supporting sustainable community projects that create economic opportunities and improve quality of life."
            />
          </div>
        </CardContent>
      </Card>

      {/* Impact Section */}
      <Card>
        <CardHeader>
          <CardTitle>Impact Section</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="impactImage">Impact Image</Label>
            {impactPreviewImage && (
              <div className="mb-4">
                <Image
                  src={impactPreviewImage}
                  alt="Impact Preview"
                  width={200}
                  height={200}
                  className="rounded-lg object-cover"
                />
              </div>
            )}
            <Input
              id="impactImage"
              name="impactImage"
              type="file"
              accept="image/*"
              onChange={(e) => handleImageChange(e, setImpactPreviewImage)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="impactTitle">Impact Title</Label>
            <Input
              id="impactTitle"
              name="impactTitle"
              defaultValue={initialData.impact.title || ""}
              placeholder="Our Impact"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="impactSubtitle">Impact Subtitle</Label>
            <Textarea
              id="impactSubtitle"
              name="impactSubtitle"
              defaultValue={initialData.impact.subtitle || ""}
              rows={3}
              placeholder="Together, we're making a measurable difference in communities across the region."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="livesImpacted">Lives Impacted</Label>
              <Input
                id="livesImpacted"
                name="livesImpacted"
                defaultValue={initialData.impact.livesImpacted || ""}
                placeholder="15,000+"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="communitiesServed">Communities Served</Label>
              <Input
                id="communitiesServed"
                name="communitiesServed"
                defaultValue={initialData.impact.communitiesServed || ""}
                placeholder="50+"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="partnerOrganizations">
                Partner Organizations
              </Label>
              <Input
                id="partnerOrganizations"
                name="partnerOrganizations"
                defaultValue={initialData.impact.partnerOrganizations || ""}
                placeholder="25"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="yearsOfService">Years of Service</Label>
              <Input
                id="yearsOfService"
                name="yearsOfService"
                defaultValue={initialData.impact.yearsOfService || ""}
                placeholder="8"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="successStoriesTitle">Success Stories Title</Label>
            <Input
              id="successStoriesTitle"
              name="successStoriesTitle"
              defaultValue={initialData.impact.successStoriesTitle || ""}
              placeholder="Success Stories"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="successStory1">First Success Story</Label>
            <Textarea
              id="successStory1"
              name="successStory1"
              defaultValue={initialData.impact.successStory1 || ""}
              rows={3}
              placeholder="Thanks to Thywill Fountain of Hope, our village now has access to clean water and our children can attend school regularly."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="successStory1Author">
              First Success Story Author
            </Label>
            <Input
              id="successStory1Author"
              name="successStory1Author"
              defaultValue={initialData.impact.successStory1Author || ""}
              placeholder="Sarah M., Community Leader"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="successStory2">Second Success Story</Label>
            <Textarea
              id="successStory2"
              name="successStory2"
              defaultValue={initialData.impact.successStory2 || ""}
              rows={3}
              placeholder="The healthcare program saved my daughter's life. We are forever grateful for the support and care we received."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="successStory2Author">
              Second Success Story Author
            </Label>
            <Input
              id="successStory2Author"
              name="successStory2Author"
              defaultValue={initialData.impact.successStory2Author || ""}
              placeholder="John K., Father"
            />
          </div>
        </CardContent>
      </Card>

      {/* Call to Action Section */}
      <Card>
        <CardHeader>
          <CardTitle>Call to Action Section</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="ctaTitle">CTA Title</Label>
            <Input
              id="ctaTitle"
              name="ctaTitle"
              defaultValue={initialData.cta.title || ""}
              placeholder="Join Us in Making a Difference"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="ctaDescription">CTA Description</Label>
            <Textarea
              id="ctaDescription"
              name="ctaDescription"
              defaultValue={initialData.cta.description || ""}
              rows={4}
              placeholder="Your support helps us reach more communities and create lasting change. Together, we can build a brighter future for everyone."
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="ctaButton1Text">First Button Text</Label>
              <Input
                id="ctaButton1Text"
                name="ctaButton1Text"
                defaultValue={initialData.cta.button1Text || ""}
                placeholder="Donate Now"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ctaButton2Text">Second Button Text</Label>
              <Input
                id="ctaButton2Text"
                name="ctaButton2Text"
                defaultValue={initialData.cta.button2Text || ""}
                placeholder="Volunteer"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ctaButton3Text">Third Button Text</Label>
              <Input
                id="ctaButton3Text"
                name="ctaButton3Text"
                defaultValue={initialData.cta.button3Text || ""}
                placeholder="Partner With Us"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
