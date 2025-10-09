import React from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  FileText,
  FolderKanban,
  UserRoundCheck,
  BookOpen,
  Star,
  MessageCircleQuestionMark,
  ChevronRight,
  Edit,
  Clock,
  Store,
} from "lucide-react";

interface DashboardStats {
  blog: {
    total: number;
    drafts: number;
    published: number;
  };
  projects: {
    total: number;
    needsReview: number;
  };
  testimonials: {
    total: number;
    pending: number;
    approved: number;
  };
  books: {
    total: number;
    outOfStock: number;
  };
}

interface AdminDashboardProps {
  stats: DashboardStats;
}

export function AdminDashboard({ stats }: AdminDashboardProps) {
  const quickActions = [
    {
      label: "New Blog Post",
      href: "/admin/blog/new",
      icon: FileText,
      variant: "default" as const,
    },
    {
      label: "New Project",
      href: "/admin/projects/new",
      icon: FolderKanban,
      variant: "outline" as const,
    },
    {
      label: "Add Book",
      href: "/admin/shop/books/add",
      icon: BookOpen,
      variant: "outline" as const,
    },
  ];

  const tasksNeedingAttention = [
    {
      title: "Testimonials Pending Approval",
      count: stats.testimonials.pending,
      href: "/admin/testimonials",
      icon: UserRoundCheck,
      show: stats.testimonials.pending > 0,
    },
    {
      title: "Draft Blog Posts",
      count: stats.blog.drafts,
      href: "/admin/blog",
      icon: FileText,
      show: stats.blog.drafts > 0,
    },
    {
      title: "Project Reviews",
      count: stats.projects.needsReview,
      href: "/admin/projects/reviews",
      icon: FolderKanban,
      show: stats.projects.needsReview > 0,
    },
    {
      title: "Books Out of Stock",
      count: stats.books.outOfStock,
      href: "/admin/shop/books",
      icon: Store,
      show: stats.books.outOfStock > 0,
    },
  ].filter((task) => task.show);

  const contentSections = [
    {
      title: "Blog",
      description: "Write and publish articles",
      icon: FileText,
      stats: [
        { label: "Published", value: stats.blog.published },
        { label: "Drafts", value: stats.blog.drafts },
      ],
      actions: [
        { label: "View All", href: "/admin/blog" },
        { label: "New Post", href: "/admin/blog/new" },
      ],
    },
    {
      title: "Portfolio",
      description: "Showcase your work",
      icon: FolderKanban,
      stats: [
        { label: "Projects", value: stats.projects.total },
        { label: "Reviews", value: stats.projects.needsReview },
      ],
      actions: [
        { label: "View Projects", href: "/admin/projects" },
        { label: "View Reviews", href: "/admin/projects/reviews" },
      ],
    },
    {
      title: "Testimonials",
      description: "Client feedback & reviews",
      icon: UserRoundCheck,
      stats: [
        { label: "Approved", value: stats.testimonials.approved },
        { label: "Pending", value: stats.testimonials.pending },
      ],
      actions: [{ label: "Manage", href: "/admin/testimonials" }],
    },
    {
      title: "Shop",
      description: "Books and products",
      icon: Store,
      stats: [
        { label: "Books", value: stats.books.total },
        { label: "Out of Stock", value: stats.books.outOfStock },
      ],
      actions: [
        { label: "View Books", href: "/admin/shop/books" },
        { label: "Add Book", href: "/admin/shop/books/add" },
      ],
    },
  ];

  const websitePages = [
    { name: "Home Page", href: "/admin/pages/home", icon: Edit },
    { name: "About Page", href: "/admin/pages/about", icon: Edit },
    { name: "Services Page", href: "/admin/pages/services", icon: Edit },
    { name: "NGO Page", href: "/admin/pages/ngo", icon: Edit },
  ];

  const otherSettings = [
    {
      name: "Contact & Social Links",
      href: "/admin/contact",
      icon: MessageCircleQuestionMark,
    },
    { name: "Media Highlights", href: "/admin/media-highlights", icon: Star },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here&apos;s what&apos;s happening with your content.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="space-y-4">
        <h2 className="text-lg font-medium">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          {quickActions.map((action) => (
            <Button
              key={action.label}
              variant={action.variant}
              asChild
              className="gap-2"
            >
              <Link href={action.href}>
                <action.icon className="h-4 w-4" />
                {action.label}
              </Link>
            </Button>
          ))}
        </div>
      </div>

      {/* Tasks Needing Attention */}
      {tasksNeedingAttention.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-medium">Needs Your Attention</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {tasksNeedingAttention.map((task) => (
              <Link key={task.title} href={task.href}>
                <Card className="transition-colors hover:bg-muted/50 cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between space-x-4">
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <task.icon className="h-4 w-4" />
                          <span>{task.title}</span>
                        </div>
                        <div className="flex items-baseline gap-2">
                          <span className="text-2xl font-semibold">
                            {task.count}
                          </span>
                          <Clock className="h-4 w-4 text-amber-600" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Content Sections */}
      <div className="space-y-4">
        <h2 className="text-lg font-medium">Content Management</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {contentSections.map((section) => (
            <Card key={section.title}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <section.icon className="h-4 w-4" />
                      {section.title}
                    </CardTitle>
                    <CardDescription className="text-sm">
                      {section.description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {section.stats.map((stat) => (
                    <div key={stat.label} className="space-y-1">
                      <p className="text-sm text-muted-foreground">
                        {stat.label}
                      </p>
                      <p className="text-2xl font-semibold">{stat.value}</p>
                    </div>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2 pt-2">
                  {section.actions.map((action) => (
                    <Button
                      key={action.label}
                      variant="ghost"
                      size="sm"
                      asChild
                      className="h-8"
                    >
                      <Link href={action.href} className="gap-1">
                        {action.label}
                        <ChevronRight className="h-3 w-3" />
                      </Link>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Website Pages and Settings */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Website Pages */}
        <div className="space-y-4">
          <h2 className="text-lg font-medium">Website Pages</h2>
          <Card>
            <CardContent className="p-0">
              {websitePages.map((page) => (
                <Link
                  key={page.name}
                  href={page.href}
                  className="flex items-center justify-between p-4 transition-colors hover:bg-muted/50 border-b last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <page.icon className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">{page.name}</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </Link>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Other Settings */}
        <div className="space-y-4">
          <h2 className="text-lg font-medium">Settings & More</h2>
          <Card>
            <CardContent className="p-0">
              {otherSettings.map((setting) => (
                <Link
                  key={setting.name}
                  href={setting.href}
                  className="flex items-center justify-between p-4 transition-colors hover:bg-muted/50 border-b last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <setting.icon className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">{setting.name}</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </Link>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
