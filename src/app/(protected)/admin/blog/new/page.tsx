import { BlogPostForm } from "@/components/admin/blog/blog-post-form";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { requireAdmin } from "@/lib/server-auth";
import { redirect } from "next/navigation";

export default async function NewBlogPostPage() {
  const isAdmin = await requireAdmin();

  if (!isAdmin) {
    return redirect("/");
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center gap-4">
        <Button asChild variant="ghost" size="icon">
          <Link href="/admin/blog">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Create New Blog Post</h1>
          <p className="text-muted-foreground">
            Write and publish a new blog post
          </p>
        </div>
      </div>

      <BlogPostForm />
    </div>
  );
}
