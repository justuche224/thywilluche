"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  MessageSquare,
  Heart,
  Share2,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  Users2,
  ArrowRight,
  AlertTriangle,
} from "lucide-react";
import Link from "next/link";
import { Breadcrumb } from "@/components/admin/breadcrumb";
import { HelpTooltip } from "@/components/admin/help-tooltip";

interface CommunityStats {
  totalPosts: number;
  pendingPosts: number;
  approvedPosts: number;
  rejectedPosts: number;
  totalComments: number;
  totalLikes: number;
  totalShares: number;
  totalUsers: number;
  totalGroups: number;
}

interface RecentActivity {
  recentPosts: Array<{
    id: string;
    content: string;
    status: string;
    createdAt: Date;
    author: {
      name: string;
      username: string;
      displayUsername: string | null;
    } | null;
  }>;
  recentComments: Array<{
    id: string;
    content: string;
    createdAt: Date;
    author: {
      name: string;
      username: string;
      displayUsername: string | null;
    } | null;
    post: {
      id: string;
      content: string;
    } | null;
  }>;
  recentUsers: Array<{
    id: string;
    name: string;
    username: string;
    displayUsername: string | null;
    createdAt: Date;
  }>;
}

interface CommunityDashboardProps {
  stats: CommunityStats;
  recentActivity: RecentActivity | null;
}

export function CommunityDashboard({
  stats,
  recentActivity,
}: CommunityDashboardProps) {
  const statCards = [
    {
      title: "Total Posts",
      value: stats.totalPosts,
      icon: FileText,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      description: "All posts in the community",
      helpText: "This includes all posts regardless of their approval status",
    },
    {
      title: "Pending Posts",
      value: stats.pendingPosts,
      icon: Clock,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
      description: "Posts waiting for approval",
      helpText:
        "These posts need to be reviewed and approved before they become visible to users",
      urgent: stats.pendingPosts > 0,
    },
    {
      title: "Approved Posts",
      value: stats.approvedPosts,
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-50",
      description: "Posts visible to users",
      helpText: "These posts have been approved and are live in the community",
    },
    {
      title: "Rejected Posts",
      value: stats.rejectedPosts,
      icon: XCircle,
      color: "text-red-600",
      bgColor: "bg-red-50",
      description: "Posts that were declined",
      helpText: "These posts were reviewed and not approved for publication",
    },
    {
      title: "Total Comments",
      value: stats.totalComments,
      icon: MessageSquare,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      description: "User comments on posts",
      helpText: "All comments made by users on approved posts",
    },
    {
      title: "Total Likes",
      value: stats.totalLikes,
      icon: Heart,
      color: "text-pink-600",
      bgColor: "bg-pink-50",
      description: "User likes on posts",
      helpText: "All likes given by users to posts and comments",
    },
    {
      title: "Total Shares",
      value: stats.totalShares,
      icon: Share2,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
      description: "Posts shared by users",
      helpText: "Posts that have been shared by users to external platforms",
    },
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: Users,
      color: "text-gray-600",
      bgColor: "bg-gray-50",
      description: "Registered community members",
      helpText: "All users who have registered for the community",
    },
    {
      title: "Total Groups",
      value: stats.totalGroups,
      icon: Users2,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
      description: "Community discussion groups",
      helpText: "All groups created for organizing community discussions",
    },
  ];

  const quickActions = [
    {
      title: "Review Pending Posts",
      description: "Approve or reject posts waiting for review",
      href: "/admin/community/posts?status=pending",
      icon: Clock,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
      urgent: stats.pendingPosts > 0,
      count: stats.pendingPosts,
    },
    {
      title: "Manage All Posts",
      description: "View and manage all community posts",
      href: "/admin/community/posts",
      icon: FileText,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Manage Groups",
      description: "Create and organize discussion groups",
      href: "/admin/community/groups",
      icon: Users2,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Manage Users",
      description: "View users and manage admin roles",
      href: "/admin/community/users",
      icon: Users,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb items={[{ label: "Community", current: true }]} />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Community Management</h1>
          <p className="text-muted-foreground">
            Manage posts, groups, and users in your community
          </p>
        </div>
      </div>

      {/* Alert for pending posts */}
      {stats.pendingPosts > 0 && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-yellow-600" />
              <div>
                <p className="font-medium text-yellow-800">
                  {stats.pendingPosts} post{stats.pendingPosts !== 1 ? "s" : ""}{" "}
                  need{stats.pendingPosts === 1 ? "s" : ""} your review
                </p>
                <p className="text-sm text-yellow-700">
                  These posts are waiting for approval before they become
                  visible to users.
                </p>
              </div>
              <Button asChild className="ml-auto">
                <Link href="/admin/community/posts?status=pending">
                  Review Posts
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card
              key={stat.title}
              className={stat.urgent ? "border-yellow-200 bg-yellow-50/50" : ""}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="flex items-center gap-2">
                  <CardTitle className="text-sm font-medium">
                    {stat.title}
                  </CardTitle>
                  <HelpTooltip content={stat.helpText} />
                  {stat.urgent && (
                    <Badge
                      variant="secondary"
                      className="bg-yellow-100 text-yellow-800 text-xs"
                    >
                      Action Required
                    </Badge>
                  )}
                </div>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold mb-1">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <h2 className="text-2xl font-bold">Quick Actions</h2>
          <HelpTooltip content="Common tasks you can perform to manage your community" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Card
                key={action.title}
                className={`hover:shadow-lg transition-shadow ${
                  action.urgent ? "border-yellow-200 bg-yellow-50/50" : ""
                }`}
              >
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <div className={`p-3 rounded-lg ${action.bgColor}`}>
                      <Icon className={`h-6 w-6 ${action.color}`} />
                    </div>
                    {action.count !== undefined && action.count > 0 && (
                      <Badge
                        variant="secondary"
                        className="bg-yellow-100 text-yellow-800"
                      >
                        {action.count}
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-lg">{action.title}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {action.description}
                  </p>
                </CardHeader>
                <CardContent>
                  <Button asChild className="w-full">
                    <Link href={action.href}>
                      {action.title}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Recent Activity */}
      {recentActivity && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Posts */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <CardTitle className="text-lg">Recent Posts</CardTitle>
                <HelpTooltip content="Latest posts submitted to the community" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentActivity.recentPosts.map((post) => (
                  <div
                    key={post.id}
                    className="border-l-2 border-gray-200 pl-3"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-muted-foreground">
                        {new Date(post.createdAt).toLocaleDateString()}
                      </span>
                      <Badge
                        variant="secondary"
                        className={`text-xs ${
                          post.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : post.status === "approved"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {post.status}
                      </Badge>
                    </div>
                    <p className="text-sm font-medium truncate">
                      {post.author?.name || "Unknown User"}
                    </p>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {post.content}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Comments */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <CardTitle className="text-lg">Recent Comments</CardTitle>
                <HelpTooltip content="Latest comments made by users" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentActivity.recentComments.map((comment) => (
                  <div
                    key={comment.id}
                    className="border-l-2 border-blue-200 pl-3"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-muted-foreground">
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm font-medium truncate">
                      {comment.author?.name || "Unknown User"}
                    </p>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {comment.content}
                    </p>
                    {comment.post && (
                      <p className="text-xs text-blue-600 truncate">
                        on: {comment.post.content}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Users */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <CardTitle className="text-lg">New Users</CardTitle>
                <HelpTooltip content="Users who recently joined the community" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentActivity.recentUsers.map((user) => (
                  <div
                    key={user.id}
                    className="border-l-2 border-green-200 pl-3"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-muted-foreground">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-muted-foreground">
                      @{user.displayUsername || user.username}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Community Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <CardTitle>Community Overview</CardTitle>
            <HelpTooltip content="Summary of community activity and engagement metrics" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-2">Post Status Breakdown</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Approved</span>
                  <span className="font-medium text-green-600">
                    {stats.approvedPosts}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Pending</span>
                  <span className="font-medium text-yellow-600">
                    {stats.pendingPosts}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Rejected</span>
                  <span className="font-medium text-red-600">
                    {stats.rejectedPosts}
                  </span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Engagement Metrics</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Total Comments</span>
                  <span className="font-medium">{stats.totalComments}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Total Likes</span>
                  <span className="font-medium">{stats.totalLikes}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Total Shares</span>
                  <span className="font-medium">{stats.totalShares}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
