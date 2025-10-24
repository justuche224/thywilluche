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
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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
  HelpCircle,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Plus,
  Eye,
  Settings2,
  Users,
  MessageSquare,
  Heart,
  Share2,
  Hash,
  Headphones,
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
  support: {
    total: number;
    open: number;
    inProgress: number;
    resolved: number;
    closed: number;
  };
  community: {
    posts: {
      total: number;
      pending: number;
      approved: number;
    };
    groups: {
      total: number;
    };
    users: {
      total: number;
    };
    engagement: {
      comments: number;
      likes: number;
      shares: number;
    };
  };
}

interface AdminDashboardProps {
  stats: DashboardStats;
}

export function AdminDashboard({ stats }: AdminDashboardProps) {
  const quickActions = [
    {
      label: "Support Tickets",
      href: "/admin/support",
      icon: Headphones,
      variant:
        stats.support.open > 0 ? ("default" as const) : ("outline" as const),
      description: "Manage support tickets and help users",
      urgent: stats.support.open > 0,
      count: stats.support.open,
    },
    {
      label: "Review Posts",
      href: "/admin/community/posts?status=pending",
      icon: MessageSquare,
      variant:
        stats.community.posts.pending > 0
          ? ("default" as const)
          : ("outline" as const),
      description: "Review pending community posts",
      urgent: stats.community.posts.pending > 0,
      count: stats.community.posts.pending,
    },
    {
      label: "New Blog Post",
      href: "/admin/blog/new",
      icon: FileText,
      variant: "outline" as const,
      description: "Write and publish a new article",
    },
    {
      label: "View Site",
      href: "/",
      icon: Eye,
      variant: "outline" as const,
      description: "Preview your live website",
    },
  ];

  const tasksNeedingAttention = [
    {
      title: "Open Support Tickets",
      count: stats.support.open,
      href: "/admin/support",
      icon: Headphones,
      show: stats.support.open > 0,
      description: "Respond to user support requests",
      urgency: "high" as const,
    },
    {
      title: "Community Posts Pending",
      count: stats.community.posts.pending,
      href: "/admin/community/posts?status=pending",
      icon: MessageSquare,
      show: stats.community.posts.pending > 0,
      description: "Review and approve community posts",
      urgency: "high" as const,
    },
    {
      title: "Testimonials Pending Approval",
      count: stats.testimonials.pending,
      href: "/admin/testimonials",
      icon: UserRoundCheck,
      show: stats.testimonials.pending > 0,
      description: "Review and approve client testimonials",
      urgency: "medium" as const,
    },
    {
      title: "Draft Blog Posts",
      count: stats.blog.drafts,
      href: "/admin/blog",
      icon: FileText,
      show: stats.blog.drafts > 0,
      description: "Complete and publish draft articles",
      urgency: "low" as const,
    },
    {
      title: "Project Reviews",
      count: stats.projects.needsReview,
      href: "/admin/projects/reviews",
      icon: FolderKanban,
      show: stats.projects.needsReview > 0,
      description: "Review and approve project feedback",
      urgency: "medium" as const,
    },
    {
      title: "Books Out of Stock",
      count: stats.books.outOfStock,
      href: "/admin/shop/books",
      icon: Store,
      show: stats.books.outOfStock > 0,
      description: "Restock books or update availability",
      urgency: "high" as const,
    },
  ].filter((task) => task.show);

  const contentSections = [
    {
      title: "Support",
      description: "Help users with their questions and issues",
      icon: Headphones,
      stats: [
        {
          label: "Open",
          value: stats.support.open,
          icon: AlertTriangle,
          color: "text-red-600",
        },
        {
          label: "In Progress",
          value: stats.support.inProgress,
          icon: Clock,
          color: "text-amber-600",
        },
        {
          label: "Resolved",
          value: stats.support.resolved,
          icon: CheckCircle,
          color: "text-green-600",
        },
        {
          label: "Total",
          value: stats.support.total,
          icon: Headphones,
          color: "text-blue-600",
        },
      ],
      actions: [
        {
          label: "Manage Support",
          href: "/admin/support",
          icon: Settings2,
        },
        {
          label: "View Open Tickets",
          href: "/admin/support?status=OPEN",
          icon: Eye,
        },
      ],
    },
    {
      title: "Community",
      description: "Manage your community posts, groups, and users",
      icon: Users,
      stats: [
        {
          label: "Posts",
          value: stats.community.posts.total,
          icon: MessageSquare,
          color: "text-blue-600",
        },
        {
          label: "Pending",
          value: stats.community.posts.pending,
          icon: Clock,
          color: "text-amber-600",
        },
        {
          label: "Users",
          value: stats.community.users.total,
          icon: Users,
          color: "text-green-600",
        },
        {
          label: "Groups",
          value: stats.community.groups.total,
          icon: Hash,
          color: "text-purple-600",
        },
      ],
      actions: [
        {
          label: "Manage Community",
          href: "/admin/community",
          icon: Settings2,
        },
        {
          label: "Review Posts",
          href: "/admin/community/posts?status=pending",
          icon: Eye,
        },
      ],
    },
    {
      title: "Blog",
      description: "Write and publish articles to share your expertise",
      icon: FileText,
      stats: [
        {
          label: "Published",
          value: stats.blog.published,
          icon: CheckCircle,
          color: "text-green-600",
        },
        {
          label: "Drafts",
          value: stats.blog.drafts,
          icon: Clock,
          color: "text-amber-600",
        },
      ],
      actions: [
        { label: "View All Posts", href: "/admin/blog", icon: Eye },
        { label: "New Post", href: "/admin/blog/new", icon: Plus },
      ],
    },
    {
      title: "Portfolio",
      description: "Showcase your projects and client work",
      icon: FolderKanban,
      stats: [
        {
          label: "Projects",
          value: stats.projects.total,
          icon: FolderKanban,
          color: "text-blue-600",
        },
        {
          label: "Reviews",
          value: stats.projects.needsReview,
          icon: AlertTriangle,
          color: "text-orange-600",
        },
      ],
      actions: [
        { label: "View Projects", href: "/admin/projects", icon: Eye },
        {
          label: "View Reviews",
          href: "/admin/projects/reviews",
          icon: MessageCircleQuestionMark,
        },
      ],
    },
    {
      title: "Testimonials",
      description: "Manage client feedback and reviews",
      icon: UserRoundCheck,
      stats: [
        {
          label: "Approved",
          value: stats.testimonials.approved,
          icon: CheckCircle,
          color: "text-green-600",
        },
        {
          label: "Pending",
          value: stats.testimonials.pending,
          icon: Clock,
          color: "text-amber-600",
        },
      ],
      actions: [
        {
          label: "Manage Testimonials",
          href: "/admin/testimonials",
          icon: Settings2,
        },
      ],
    },
    {
      title: "Shop",
      description: "Manage your books and products",
      icon: Store,
      stats: [
        {
          label: "Books",
          value: stats.books.total,
          icon: BookOpen,
          color: "text-blue-600",
        },
        {
          label: "Out of Stock",
          value: stats.books.outOfStock,
          icon: AlertTriangle,
          color: "text-red-600",
        },
      ],
      actions: [
        { label: "View Books", href: "/admin/shop/books", icon: Eye },
        { label: "Add Book", href: "/admin/shop/books/add", icon: Plus },
      ],
    },
  ];

  const websitePages = [
    {
      name: "Home Page",
      href: "/admin/pages/home",
      icon: Edit,
      description: "Edit your homepage content and hero section",
    },
    {
      name: "About Page",
      href: "/admin/pages/about",
      icon: Edit,
      description: "Update your personal story and background",
    },
    {
      name: "Services Page",
      href: "/admin/pages/services",
      icon: Edit,
      description: "Manage your services and pricing",
    },
    {
      name: "NGO Page",
      href: "/admin/pages/ngo",
      icon: Edit,
      description: "Update your NGO initiatives and impact",
    },
  ];

  const otherSettings = [
    {
      name: "Contact & Social Links",
      href: "/admin/contact",
      icon: MessageCircleQuestionMark,
      description: "Manage contact information and social media links",
    },
    {
      name: "Media Highlights",
      href: "/admin/media-highlights",
      icon: Star,
      description: "Showcase press coverage and media mentions",
    },
  ];

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "high":
        return "border-red-200 bg-red-50";
      case "medium":
        return "border-orange-200 bg-orange-50";
      case "low":
        return "border-blue-200 bg-blue-50";
      default:
        return "border-gray-200 bg-gray-50";
    }
  };

  const getUrgencyIcon = (urgency: string) => {
    switch (urgency) {
      case "high":
        return AlertTriangle;
      case "medium":
        return Clock;
      case "low":
        return TrendingUp;
      default:
        return HelpCircle;
    }
  };

  return (
    <TooltipProvider>
      <div className="space-y-8">
        {/* Header */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight">
                Welcome back! 👋
              </h1>
              <p className="text-muted-foreground mt-1">
                Here&apos;s what&apos;s happening with your content today.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/" className="gap-2">
                      <Eye className="h-4 w-4" />
                      View Site
                    </Link>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Preview your live website</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <HelpCircle className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Need help? Check our documentation</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-medium">Quick Actions</h2>
            <Tooltip>
              <TooltipTrigger asChild>
                <HelpCircle className="h-4 w-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Common tasks you can do right now</p>
              </TooltipContent>
            </Tooltip>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {quickActions.map((action) => (
              <Tooltip key={action.label}>
                <TooltipTrigger asChild>
                  <Button
                    variant={action.variant}
                    asChild
                    className={`gap-2 h-auto p-4 flex-col relative ${
                      action.urgent
                        ? "border-yellow-200 bg-yellow-50 hover:bg-yellow-100"
                        : ""
                    }`}
                  >
                    <Link href={action.href} className="text-center">
                      <div className="relative">
                        <action.icon className="h-5 w-5" />
                        {action.count !== undefined && action.count > 0 && (
                          <Badge
                            variant="secondary"
                            className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs bg-yellow-100 text-yellow-800"
                          >
                            {action.count}
                          </Badge>
                        )}
                      </div>
                      <span className="font-medium">{action.label}</span>
                      <span className="text-xs text-muted-foreground">
                        {action.description}
                      </span>
                    </Link>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{action.description}</p>
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
        </div>

        {/* Tasks Needing Attention */}
        {tasksNeedingAttention.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-medium">⚠️ Needs Your Attention</h2>
              <Badge variant="destructive" className="text-xs">
                {tasksNeedingAttention.length} items
              </Badge>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {tasksNeedingAttention.map((task) => {
                const UrgencyIcon = getUrgencyIcon(task.urgency);
                return (
                  <Link key={task.title} href={task.href}>
                    <Card
                      className={`transition-all hover:shadow-md cursor-pointer border-l-4 ${getUrgencyColor(
                        task.urgency
                      )}`}
                    >
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-2">
                              <task.icon className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm font-medium">
                                {task.title}
                              </span>
                            </div>
                            <UrgencyIcon
                              className={`h-4 w-4 ${
                                task.urgency === "high"
                                  ? "text-red-600"
                                  : task.urgency === "medium"
                                  ? "text-orange-600"
                                  : "text-blue-600"
                              }`}
                            />
                          </div>
                          <div className="flex items-baseline gap-2">
                            <span className="text-2xl font-bold">
                              {task.count}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              items
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {task.description}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* No pending tasks message */}
        {tasksNeedingAttention.length === 0 && (
          <div className="text-center py-8">
            <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-green-600 mb-2">
              All caught up! 🎉
            </h3>
            <p className="text-muted-foreground">
              No pending tasks require your attention right now.
            </p>
          </div>
        )}

        {/* Content Sections */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-medium">📊 Content Overview</h2>
            <Tooltip>
              <TooltipTrigger asChild>
                <HelpCircle className="h-4 w-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Overview of all your content and its status</p>
              </TooltipContent>
            </Tooltip>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {contentSections.map((section) => (
              <Card
                key={section.title}
                className="hover:shadow-md transition-shadow"
              >
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
                  <div
                    className={`grid gap-4 ${
                      section.stats.length > 2 ? "grid-cols-2" : "grid-cols-2"
                    }`}
                  >
                    {section.stats.map((stat) => (
                      <div key={stat.label} className="space-y-2">
                        <div className="flex items-center gap-2">
                          <stat.icon className={`h-4 w-4 ${stat.color}`} />
                          <p className="text-sm text-muted-foreground">
                            {stat.label}
                          </p>
                        </div>
                        <p className="text-2xl font-bold">{stat.value}</p>
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-2 pt-2 border-t">
                    {section.actions.map((action) => (
                      <Button
                        key={action.label}
                        variant="ghost"
                        size="sm"
                        asChild
                        className="h-8 gap-1"
                      >
                        <Link href={action.href}>
                          <action.icon className="h-3 w-3" />
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

        {/* Community Engagement Overview */}
        {stats.community.posts.total > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-medium">💬 Community Engagement</h2>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>How your community is engaging with posts</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Comments</p>
                      <p className="text-2xl font-bold">
                        {stats.community.engagement.comments}
                      </p>
                    </div>
                    <MessageSquare className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Likes</p>
                      <p className="text-2xl font-bold">
                        {stats.community.engagement.likes}
                      </p>
                    </div>
                    <Heart className="h-8 w-8 text-red-600" />
                  </div>
                </CardContent>
              </Card>
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Shares</p>
                      <p className="text-2xl font-bold">
                        {stats.community.engagement.shares}
                      </p>
                    </div>
                    <Share2 className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Website Pages and Settings */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Website Pages */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-medium">🌐 Website Pages</h2>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Edit content for your public website pages</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-0">
                {websitePages.map((page) => (
                  <Tooltip key={page.name}>
                    <TooltipTrigger asChild>
                      <Link
                        href={page.href}
                        className="flex items-center justify-between p-4 transition-colors hover:bg-muted/50 border-b last:border-0 group"
                      >
                        <div className="flex items-center gap-3">
                          <page.icon className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                          <div>
                            <span className="text-sm font-medium">
                              {page.name}
                            </span>
                            <p className="text-xs text-muted-foreground">
                              {page.description}
                            </p>
                          </div>
                        </div>
                        <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{page.description}</p>
                    </TooltipContent>
                  </Tooltip>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Other Settings */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-medium">⚙️ Settings & More</h2>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Manage your site settings and additional features</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-0">
                {otherSettings.map((setting) => (
                  <Tooltip key={setting.name}>
                    <TooltipTrigger asChild>
                      <Link
                        href={setting.href}
                        className="flex items-center justify-between p-4 transition-colors hover:bg-muted/50 border-b last:border-0 group"
                      >
                        <div className="flex items-center gap-3">
                          <setting.icon className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                          <div>
                            <span className="text-sm font-medium">
                              {setting.name}
                            </span>
                            <p className="text-xs text-muted-foreground">
                              {setting.description}
                            </p>
                          </div>
                        </div>
                        <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{setting.description}</p>
                    </TooltipContent>
                  </Tooltip>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
