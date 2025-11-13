"use client";

import * as React from "react";
import {
  AudioWaveform,
  BookOpen,
  NotepadText,
  Command,
  MessageCircleQuestionMark,
  GalleryVerticalEnd,
  FolderKanban,
  Settings2,
  Store,
  Star,
  FileText,
  UserRoundCheck,
  LayoutDashboard,
  Users,
  Headphones,
} from "lucide-react";

import { NavMain } from "@/components/admin/nav-main";
import { NavProjects } from "@/components/admin/nav-projects";
import { NavUser } from "@/components/admin/nav-user";
import { TeamSwitcher } from "@/components/admin/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "/admin",
      icon: LayoutDashboard,
      isActive: true,
    },
    {
      title: "Shop",
      url: "#",
      icon: Store,
      isActive: true,
      items: [
        {
          title: "Books",
          url: "/admin/shop/books",
        },
        {
          title: "Merch",
          url: "/admin/shop/merch",
        },
        {
          title: "Tickets",
          url: "/admin/shop/tickets",
        },
        {
          title: "Orders",
          url: "/admin/shop/orders",
        },
      ],
    },
    {
      title: "Pages",
      url: "#",
      icon: NotepadText,
      isActive: true,
      items: [
        {
          title: "Home",
          url: "/admin/pages/home",
        },
        {
          title: "About",
          url: "/admin/pages/about",
        },
        {
          title: "Services",
          url: "/admin/pages/services",
        },
        {
          title: "NGO",
          url: "/admin/pages/ngo",
        },
      ],
    },
    {
      title: "Portfolio",
      url: "#",
      icon: FolderKanban,
      isActive: true,
      items: [
        {
          title: "Projects",
          url: "/admin/projects",
        },
        {
          title: "Reviews",
          url: "/admin/projects/reviews",
        },
      ],
    },
    {
      title: "Support",
      url: "/admin/support",
      icon: Headphones,
      isActive: true,
    },
    {
      title: "Championship",
      url: "/admin/championship",
      icon: UserRoundCheck,
      isActive: true,
    },
    {
      title: "Community",
      url: "#",
      icon: Users,
      isActive: true,
      items: [
        {
          title: "Dashboard",
          url: "/admin/community",
        },
        {
          title: "Posts",
          url: "/admin/community/posts",
        },
        {
          title: "Groups",
          url: "/admin/community/groups",
        },
        {
          title: "Users",
          url: "/admin/community/users",
        },
        {
          title: "Announcements",
          url: "/admin/community/announcements",
        },
        {
          title: "Games",
          url: "/admin/community/games",
        },
        {
          title: "Badges",
          url: "/admin/community/badges",
        },
      ],
    },
    {
      title: "Documentation",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "Introduction",
          url: "#",
        },
        {
          title: "Get Started",
          url: "#",
        },
        {
          title: "Tutorials",
          url: "#",
        },
        {
          title: "Changelog",
          url: "#",
        },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "General",
          url: "#",
        },
        {
          title: "Team",
          url: "#",
        },
        {
          title: "Billing",
          url: "#",
        },
        {
          title: "Limits",
          url: "#",
        },
      ],
    },
  ],
  projects: [
    {
      name: "Socials & Contact Info",
      url: "/admin/contact",
      icon: MessageCircleQuestionMark,
    },
    {
      name: "Media Highlights",
      url: "/admin/media-highlights",
      icon: Star,
    },
    {
      name: "Blog",
      url: "/admin/blog",
      icon: FileText,
    },
    {
      name: "Testimonials",
      url: "/admin/testimonials",
      icon: UserRoundCheck,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar
      collapsible="icon"
      {...props}
      className={"bg-sidebar/50 backdrop-blur-md"}
    >
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
