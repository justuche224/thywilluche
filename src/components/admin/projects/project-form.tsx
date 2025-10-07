"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { createProject, updateProject } from "@/actions/admin/projects";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Image from "next/image";
import uploadImageAction from "@/actions/admin/upload-image";

const categories = [
  { id: "books", name: "Books" },
  { id: "poetry", name: "Poetry" },
  { id: "coaching-programs", name: "Coaching Programs" },
  { id: "films", name: "Films" },
  { id: "partnerships", name: "Partnerships" },
  { id: "events", name: "Events" },
];

const mediaTypes = [
  { id: "image", name: "Image" },
  { id: "video", name: "Video" },
  { id: "pdf", name: "PDF" },
];

interface ProjectFormProps {
  project?: {
    id: string;
    title: string;
    category: string;
    description: string;
    longDescription: string | null;
    mediaType: string;
    mediaUrl: string;
    thumbnailUrl: string | null;
    downloadableExcerpt: string | null;
    externalLink: string | null;
    date: Date;
    featured: boolean | null;
  };
}

export function ProjectForm({ project }: ProjectFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mediaPreview, setMediaPreview] = useState<string | null>(
    project?.mediaUrl || null
  );
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(
    project?.thumbnailUrl || null
  );
  const [selectedMediaType, setSelectedMediaType] = useState(
    project?.mediaType || "image"
  );
  const router = useRouter();

  const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setMediaPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formRef.current) return;

    setIsSubmitting(true);

    try {
      const formData = new FormData(formRef.current);

      let mediaUrl = project?.mediaUrl || "";
      let thumbnailUrl = project?.thumbnailUrl || "";

      const mediaFile = formData.get("media") as File;
      if (mediaFile && mediaFile.size > 0) {
        const mediaFormData = new FormData();
        mediaFormData.append("image", mediaFile);
        mediaFormData.append("path", "projects");
        const uploadResult = await uploadImageAction(mediaFormData);
        if (uploadResult.success && uploadResult.imageUrl) {
          mediaUrl = uploadResult.imageUrl;
        }
      } else if (selectedMediaType === "video") {
        mediaUrl = formData.get("videoUrl") as string;
      }

      const thumbnailFile = formData.get("thumbnail") as File;
      if (thumbnailFile && thumbnailFile.size > 0) {
        const thumbnailFormData = new FormData();
        thumbnailFormData.append("image", thumbnailFile);
        thumbnailFormData.append("path", "projects/thumbnails");
        const uploadResult = await uploadImageAction(thumbnailFormData);
        if (uploadResult.success && uploadResult.imageUrl) {
          thumbnailUrl = uploadResult.imageUrl;
        }
      }

      const projectData = {
        title: formData.get("title") as string,
        category: formData.get("category") as string,
        description: formData.get("description") as string,
        longDescription: formData.get("longDescription") as string,
        mediaType: selectedMediaType,
        mediaUrl,
        thumbnailUrl: thumbnailUrl || undefined,
        downloadableExcerpt: formData.get("downloadableExcerpt") as string,
        externalLink: formData.get("externalLink") as string,
        date: new Date(formData.get("date") as string),
        featured: formData.get("featured") === "on",
      };

      const result = project
        ? await updateProject(project.id, projectData)
        : await createProject(projectData);

      if (result.success) {
        toast.success(result.message);
        router.push("/admin/projects");
        router.refresh();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Error submitting project:", error);
      toast.error("Failed to save project");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form ref={formRef} className="space-y-6" onSubmit={handleSubmit}>
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          name="title"
          placeholder="Project title"
          defaultValue={project?.title}
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select name="category" defaultValue={project?.category} required>
            <SelectTrigger>
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="date">Date</Label>
          <Input
            id="date"
            name="date"
            type="date"
            defaultValue={
              project?.date
                ? new Date(project.date).toISOString().split("T")[0]
                : new Date().toISOString().split("T")[0]
            }
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Short Description</Label>
        <Textarea
          id="description"
          name="description"
          placeholder="A brief description..."
          defaultValue={project?.description}
          rows={3}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="longDescription">Long Description</Label>
        <Textarea
          id="longDescription"
          name="longDescription"
          placeholder="Detailed description..."
          defaultValue={project?.longDescription || ""}
          rows={6}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="mediaType">Media Type</Label>
        <Select
          name="mediaType"
          defaultValue={selectedMediaType}
          onValueChange={setSelectedMediaType}
          required
        >
          <SelectTrigger>
            <SelectValue placeholder="Select media type" />
          </SelectTrigger>
          <SelectContent>
            {mediaTypes.map((type) => (
              <SelectItem key={type.id} value={type.id}>
                {type.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedMediaType === "video" ? (
        <div className="space-y-2">
          <Label htmlFor="videoUrl">
            Video URL (YouTube embed or direct link)
          </Label>
          <Input
            id="videoUrl"
            name="videoUrl"
            type="url"
            placeholder="https://www.youtube.com/embed/..."
            defaultValue={
              project?.mediaType === "video" ? project.mediaUrl : ""
            }
          />
        </div>
      ) : (
        <div className="space-y-2">
          <Label htmlFor="media">Media File</Label>
          <Input
            id="media"
            name="media"
            type="file"
            accept={
              selectedMediaType === "image" ? "image/*" : "application/pdf"
            }
            onChange={handleMediaChange}
          />
          {mediaPreview && selectedMediaType === "image" && (
            <div className="mt-2 relative w-full h-64">
              <Image
                src={mediaPreview}
                alt="Preview"
                fill
                className="object-cover rounded-md"
              />
            </div>
          )}
        </div>
      )}

      {selectedMediaType === "video" && (
        <div className="space-y-2">
          <Label htmlFor="thumbnail">Thumbnail Image</Label>
          <Input
            id="thumbnail"
            name="thumbnail"
            type="file"
            accept="image/*"
            onChange={handleThumbnailChange}
          />
          {thumbnailPreview && (
            <div className="mt-2 relative w-full h-64">
              <Image
                src={thumbnailPreview}
                alt="Thumbnail Preview"
                fill
                className="object-cover rounded-md"
              />
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="externalLink">External Link</Label>
          <Input
            id="externalLink"
            name="externalLink"
            type="url"
            placeholder="https://example.com"
            defaultValue={project?.externalLink || ""}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="downloadableExcerpt">Downloadable Excerpt URL</Label>
          <Input
            id="downloadableExcerpt"
            name="downloadableExcerpt"
            type="url"
            placeholder="https://example.com/excerpt.pdf"
            defaultValue={project?.downloadableExcerpt || ""}
          />
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="featured"
          name="featured"
          defaultChecked={project?.featured || false}
        />
        <Label htmlFor="featured">Featured Project</Label>
      </div>

      <div className="flex gap-4">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? "Saving..."
            : project
            ? "Update Project"
            : "Create Project"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/projects")}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
