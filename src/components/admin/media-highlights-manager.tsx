"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import { Badge } from "@/components/ui/badge";
import { Trash2, Edit, Plus, EyeOff } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { MediaHighlight } from "@/db/schema/media-highlights";
import {
  getAllMediaHighlights,
  createMediaHighlight,
  updateMediaHighlight,
  deleteMediaHighlight,
} from "@/actions/admin/media-highlights";
import uploadImageAction from "@/actions/admin/upload-image";

interface MediaHighlightsManagerProps {
  initialHighlights: MediaHighlight[];
}

const MediaHighlightsManager = ({
  initialHighlights,
}: MediaHighlightsManagerProps) => {
  const [highlights, setHighlights] =
    useState<MediaHighlight[]>(initialHighlights);
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingHighlight, setEditingHighlight] =
    useState<MediaHighlight | null>(null);
  const [formData, setFormData] = useState({
    type: "",
    title: "",
    description: "",
    quote: "",
    image: "",
    color: "primary",
    date: "",
    isActive: true,
    sortOrder: 0,
  });

  const mediaTypes = [
    { value: "featured", label: "Featured" },
    { value: "podcast", label: "Podcast" },
    { value: "award", label: "Award" },
    { value: "social", label: "Social Media" },
    { value: "testimonial", label: "Testimonial" },
    { value: "feature", label: "Feature" },
  ];

  const colors = [
    { value: "primary", label: "Primary" },
    { value: "secondary", label: "Secondary" },
  ];

  const handleImageUpload = async (file: File) => {
    const maxSize = 3 * 1024 * 1024; // 3MB in bytes

    if (file.size > maxSize) {
      toast.error("Image size must be less than 3MB");
      return;
    }

    const formData = new FormData();
    formData.append("image", file);
    formData.append("path", "media-highlights");

    const result = await uploadImageAction(formData);
    if (result.success) {
      setFormData((prev) => ({ ...prev, image: result.imageUrl }));
      toast.success("Image uploaded successfully");
    } else {
      toast.error(result.message || "Failed to upload image");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let result;
      if (editingHighlight) {
        result = await updateMediaHighlight(editingHighlight.id, formData);
      } else {
        result = await createMediaHighlight(formData);
      }

      if (result.success) {
        toast.success(
          editingHighlight
            ? "Media highlight updated successfully"
            : "Media highlight created successfully"
        );
        await refreshHighlights();
        resetForm();
        setIsDialogOpen(false);
      } else {
        toast.error(result.error || "Failed to save media highlight");
      }
    } catch {
      toast.error("An error occurred while saving");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setIsLoading(true);
    try {
      const result = await deleteMediaHighlight(id);
      if (result.success) {
        toast.success("Media highlight deleted successfully");
        await refreshHighlights();
      } else {
        toast.error(result.error || "Failed to delete media highlight");
      }
    } catch {
      toast.error("An error occurred while deleting");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (highlight: MediaHighlight) => {
    setEditingHighlight(highlight);
    setFormData({
      type: highlight.type,
      title: highlight.title,
      description: highlight.description,
      quote: highlight.quote,
      image: highlight.image,
      color: highlight.color,
      date: highlight.date,
      isActive: highlight.isActive,
      sortOrder: highlight.sortOrder,
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      type: "",
      title: "",
      description: "",
      quote: "",
      image: "",
      color: "primary",
      date: "",
      isActive: true,
      sortOrder: 0,
    });
    setEditingHighlight(null);
  };

  const refreshHighlights = async () => {
    const result = await getAllMediaHighlights();
    if (result.success) {
      setHighlights(result.data || []);
    }
  };

  const openCreateDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Media Highlights</h2>
          <p className="text-gray-600">
            Manage your media mentions and features
          </p>
        </div>
        <Button onClick={openCreateDialog} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Media Highlight
        </Button>
      </div>

      <div className="grid gap-4">
        {highlights.map((highlight) => (
          <Card key={highlight.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold">{highlight.title}</h3>
                    <Badge
                      variant={
                        highlight.color === "primary" ? "default" : "secondary"
                      }
                    >
                      {highlight.type}
                    </Badge>
                    {!highlight.isActive && (
                      <Badge variant="outline" className="text-gray-500">
                        <EyeOff className="w-3 h-3 mr-1" />
                        Hidden
                      </Badge>
                    )}
                  </div>
                  <p className="text-gray-600 mb-2">{highlight.description}</p>
                  <p className="text-sm text-gray-500 italic">
                    &quot;{highlight.quote}&quot;
                  </p>
                  <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                    <span>Date: {highlight.date}</span>
                    <span>Order: {highlight.sortOrder}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(highlight)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Delete Media Highlight
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete &quot;
                          {highlight.title}&quot;? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(highlight.id)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingHighlight
                ? "Edit Media Highlight"
                : "Add Media Highlight"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, type: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {mediaTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="color">Color</Label>
                <Select
                  value={formData.color}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, color: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select color" />
                  </SelectTrigger>
                  <SelectContent>
                    {colors.map((color) => (
                      <SelectItem key={color.value} value={color.value}>
                        {color.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, title: e.target.value }))
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                required
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="quote">Quote</Label>
              <Textarea
                id="quote"
                value={formData.quote}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, quote: e.target.value }))
                }
                required
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">Image URL</Label>
              <Input
                id="image"
                value={formData.image}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, image: e.target.value }))
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="imageFile">Or Upload Image</Label>
              <Input
                id="imageFile"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleImageUpload(file);
                }}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  value={formData.date}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, date: e.target.value }))
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sortOrder">Sort Order</Label>
                <Input
                  id="sortOrder"
                  type="number"
                  value={formData.sortOrder}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      sortOrder: parseInt(e.target.value) || 0,
                    }))
                  }
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) =>
                  setFormData((prev) => ({ ...prev, isActive: checked }))
                }
              />
              <Label htmlFor="isActive">Active</Label>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading
                  ? "Saving..."
                  : editingHighlight
                  ? "Update"
                  : "Create"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MediaHighlightsManager;
