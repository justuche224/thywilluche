"use client";

import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor";
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
import { createBlogPost, updateBlogPost } from "@/actions/admin/blog";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Image from "next/image";
import { blogCategories } from "@/db/schema";

interface BlogPostFormProps {
  post?: {
    id: string;
    title: string;
    excerpt: string;
    category: string;
    tags: string[];
    imageUrl: string | null;
    content: object;
    status: string;
    isFeatured: boolean;
  };
}

export function BlogPostForm({ post }: BlogPostFormProps) {
  const editorRef = useRef<{ getContent: () => object }>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(
    post?.imageUrl || null
  );
  const router = useRouter();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (status: string) => {
    if (!formRef.current) return;

    setIsSubmitting(true);

    try {
      const formData = new FormData(formRef.current);

      if (editorRef.current) {
        const content = editorRef.current.getContent();
        formData.set("content", JSON.stringify(content));
      }

      formData.set("status", status);

      const result = post
        ? await updateBlogPost(post.id, formData)
        : await createBlogPost(formData);

      if (result.success) {
        toast.success(result.message);
        router.push("/admin/blog");
        router.refresh();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Error submitting blog post:", error);
      toast.error("Failed to save blog post");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      ref={formRef}
      className="space-y-6"
      onSubmit={(e) => e.preventDefault()}
    >
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          name="title"
          placeholder="365 TIPS, 365 WINS, EVERY DAY IS VICTORY"
          defaultValue={post?.title}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="excerpt">Excerpt</Label>
        <Textarea
          id="excerpt"
          name="excerpt"
          placeholder="A brief summary of the blog post..."
          defaultValue={post?.excerpt}
          rows={3}
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select name="category" defaultValue={post?.category}>
            <SelectTrigger>
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {blogCategories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="tags">Tags (comma-separated)</Label>
          <Input
            id="tags"
            name="tags"
            placeholder="motivation, success, tips"
            defaultValue={post?.tags?.join(", ")}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="image">Featured Image</Label>
        <Input
          id="image"
          name="image"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
        />
        {imagePreview && (
          <div className="mt-2 relative w-full h-64">
            <Image
              src={imagePreview}
              alt="Preview"
              fill
              className="object-cover rounded-md"
            />
          </div>
        )}
        {post?.imageUrl && (
          <input type="hidden" name="existingImageUrl" value={post.imageUrl} />
        )}
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="isFeatured"
          name="isFeatured"
          defaultChecked={post?.isFeatured}
        />
        <Label htmlFor="isFeatured">Featured Post</Label>
      </div>

      <div className="space-y-2">
        <Label>Content</Label>
        <SimpleEditor
          ref={editorRef}
          initialContent={
            post?.content || { type: "doc", content: [{ type: "paragraph" }] }
          }
          onContentChange={(content) => {
            console.log("Content updated:", content);
          }}
        />
      </div>

      <div className="flex gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => handleSave("draft")}
          disabled={isSubmitting}
        >
          Save as Draft
        </Button>
        <Button
          type="button"
          onClick={() => handleSave("published")}
          disabled={isSubmitting}
        >
          {post?.status === "published" ? "Update & Publish" : "Publish"}
        </Button>
      </div>
    </form>
  );
}
