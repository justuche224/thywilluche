import { getBlogPostById } from "@/actions/admin/blog";
import { BlogPostForm } from "@/components/admin/blog/blog-post-form";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { requireAdmin } from "@/lib/server-auth";

interface EditBlogPostPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditBlogPostPage({
  params,
}: EditBlogPostPageProps) {
  const isAdmin = await requireAdmin();

  if (!isAdmin) {
    return redirect("/");
  }

  const { id } = await params;
  const post = await getBlogPostById(id);

  if (!post) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button asChild variant="ghost" size="icon">
          <Link href="/admin/blog">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Edit Blog Post</h1>
          <p className="text-muted-foreground">Update your blog post content</p>
        </div>
      </div>
      {/* @ts-expect-error: something */}
      <BlogPostForm post={post} />
    </div>
  );
}
