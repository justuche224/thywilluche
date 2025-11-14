import { getAllBlogPosts } from "@/actions/admin/blog";
import { BlogPostsList } from "@/components/admin/blog/blog-posts-list";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { requireAdmin } from "@/lib/server-auth";
import { redirect } from "next/navigation";

export default async function BlogPage() {
  const isAdmin = await requireAdmin();

  if (!isAdmin) {
    return redirect("/");
  }

  const posts = await getAllBlogPosts();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Blog Posts</h1>
          <p className="text-muted-foreground">
            Manage your blog posts, categories, and content
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/blog/new">Create New Post</Link>
        </Button>
      </div>

      <BlogPostsList posts={posts} />
    </div>
  );
}
