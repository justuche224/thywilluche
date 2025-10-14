"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";
import { updateUserProfile } from "@/actions/user";
import { authClient } from "@/lib/auth-client";
import { Loader2, Upload, X } from "lucide-react";

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must be less than 20 characters"),
  displayUsername: z.string().optional(),
  bio: z.string().max(500, "Bio must be less than 500 characters").optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

interface ProfileEditFormProps {
  userId: string;
  initialData: {
    name: string;
    email: string;
    image?: string | null;
    username?: string | null;
    displayUsername?: string | null;
    bio?: string | null;
  };
  onSuccess?: () => void;
}

export default function ProfileEditForm({
  userId,
  initialData,
  onSuccess,
}: ProfileEditFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [profileImage, setProfileImage] = useState(initialData.image || "");
  const [imageFile, setImageFile] = useState<File | null>(null);

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: initialData.name,
      username: initialData.username || "",
      displayUsername: initialData.displayUsername || "",
      bio: initialData.bio || "",
    },
  });

  const watchedUsername = form.watch("username");

  useEffect(() => {
    const checkUsername = async () => {
      const current = watchedUsername?.trim() ?? "";
      if (!current || current.length < 3) return;
      if (current === (initialData.username || "")) return;
      setIsCheckingUsername(true);
      try {
        const { data, error } = await authClient.isUsernameAvailable({
          username: current,
        });
        if (error || !data?.available) {
          form.setError("username", {
            type: "manual",
            message: error?.message || "Username is already taken",
          });
        } else {
          form.clearErrors("username");
        }
      } catch {
      } finally {
        setIsCheckingUsername(false);
      }
    };

    const timeoutId = setTimeout(checkUsername, 500);
    return () => clearTimeout(timeoutId);
  }, [watchedUsername, initialData.username, form]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size must be less than 5MB");
        return;
      }

      if (!file.type.startsWith("image/")) {
        toast.error("Please select a valid image file");
        return;
      }

      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setProfileImage("");
    setImageFile(null);
  };

  const onSubmit = async (data: ProfileFormData) => {
    setIsLoading(true);
    try {
      const updateData: {
        name?: string;
        username?: string | null;
        displayUsername?: string | null;
        bio?: string | null;
        image?: string;
      } = {
        name: data.name,
        username: data.username || null,
        displayUsername: data.displayUsername || null,
        bio: data.bio || null,
      };

      if (imageFile) {
        const formData = new FormData();
        formData.append("images", imageFile);
        formData.append("path", "profiles");

        try {
          const response = await fetch("/api/upload", {
            method: "POST",
            body: formData,
          });

          if (response.ok) {
            const result = await response.json();
            if (Array.isArray(result.imageUrls) && result.imageUrls[0]) {
              updateData.image = result.imageUrls[0];
            }
          }
        } catch (error) {
          console.error("Error uploading image:", error);
          toast.error("Failed to upload image");
        }
      }

      const result = await updateUserProfile(userId, {
        name: updateData.name,
        username: updateData.username,
        displayUsername: updateData.displayUsername,
        bio: updateData.bio,
        image: updateData.image,
      });

      if (result.success) {
        toast.success("Profile updated successfully");
        onSuccess?.();
      } else {
        toast.error(result.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center space-y-4">
        <div className="relative">
          <Avatar className="h-24 w-24">
            <AvatarImage src={profileImage} alt="Profile" />
            <AvatarFallback className="bg-[#800000] text-white text-lg">
              {getInitials(form.watch("name") || initialData.name)}
            </AvatarFallback>
          </Avatar>
          {profileImage && (
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
              onClick={removeImage}
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>

        <div className="flex flex-col items-center space-y-2">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
            id="profile-image-upload"
          />
          <label
            htmlFor="profile-image-upload"
            className="flex items-center space-x-2 cursor-pointer text-sm text-gray-600 hover:text-gray-800"
          >
            <Upload className="h-4 w-4" />
            <span>Upload new photo</span>
          </label>
          <p className="text-xs text-gray-500">
            JPG, PNG or GIF. Max size 5MB.
          </p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter your full name" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            disabled={true}
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      {...field}
                      placeholder="Enter username"
                      className="pr-10"
                    />
                    {isCheckingUsername && (
                      <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-gray-400" />
                    )}
                  </div>
                </FormControl>
                <FormMessage />
                <p className="text-xs text-gray-500">
                  Choose a unique username. Letters, numbers, underscores, dots,
                  and hyphens are allowed.
                </p>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="displayUsername"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Display Name</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter display name" />
                </FormControl>
                <FormMessage />
                <p className="text-xs text-gray-500">
                  This is how your name appears to others. Leave empty to use
                  your username.
                </p>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bio</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Tell us about yourself..."
                    rows={4}
                    maxLength={500}
                  />
                </FormControl>
                <FormMessage />
                <p className="text-xs text-gray-500">
                  {field.value?.length || 0}/500 characters
                </p>
              </FormItem>
            )}
          />

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => form.reset()}
              disabled={isLoading}
            >
              Reset
            </Button>
            <Button type="submit" disabled={isLoading || isCheckingUsername}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
