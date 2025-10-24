"use client";

import * as React from "react";
import Link from "next/link";
import { Menu, ChevronDown, Home, Users, User, Gamepad2, Trophy } from "lucide-react";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import Image from "next/image";
import { Oswald } from "next/font/google";
import { useRouter } from "next/navigation";
import { useBreakpoint } from "@/hooks/use-breakpoint";
import UserMenu from "./user-menu";

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
});

const moreItems: { title: string; href: string; description: string }[] = [
  {
    title: "About Me",
    href: "/about",
    description: "Discover the person behind the creative works and vision.",
  },
  {
    title: "Shop",
    href: "/shop/books",
    description:
      "Browse our collection of inspirational and motivational books.",
  },
  {
    title: "Services",
    href: "/services/coaching",
    description: "Coaching, ghostwriting, and consulting services.",
  },
  {
    title: "Projects",
    href: "/portfolio",
    description: "Explore my creative projects and portfolio.",
  },
  {
    title: "Blog",
    href: "/blog",
    description: "Read my latest thoughts and insights.",
  },
  {
    title: "NGO",
    href: "/ngo",
    description: "Learn about my NGO work and initiatives.",
  },
  {
    title: "Contact",
    href: "/contact",
    description: "Get in touch for any questions or inquiries.",
  },
  {
    title: "FAQ",
    href: "/faq",
    description: "Frequently asked questions and answers.",
  },
  {
    title: "Testimonials",
    href: "/testimonials",
    description: "What others have to say about me.",
  },
  {
    title: "Privacy Policy",
    href: "/privacy",
    description: "Our privacy policy and data protection.",
  },
];

export function CommunityNavbar() {
  const isMobile = useBreakpoint("max-lg");
  const [isOpen, setIsOpen] = React.useState(false);
  const router = useRouter();

  return (
    <>
      {isMobile && (
        <div className="flex justify-between items-center z-[999] p-4">
          <Image
            src="/logos/LANDSCAPE-LOGO-BLACK.png"
            alt="logo"
            width={150}
            height={60}
            className="w-auto h-16"
            onClick={() => router.push("/community/home")}
          />
          <div className="flex items-center gap-2">
            <UserMenu />
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <MobileNavContent onClose={() => setIsOpen(false)} />
            </Sheet>
          </div>
        </div>
      )}
      {!isMobile && (
        <div className="flex justify-between items-center max-w-7xl mx-auto z-[999] p-4">
          <Image
            src="/logos/LANDSCAPE-LOGO-BLACK.png"
            alt="logo"
            width={200}
            height={80}
            className="w-auto h-20"
            onClick={() => router.push("/community/home")}
          />
          <NavigationMenu viewport={false} className="relative z-[999]">
            <NavigationMenuList>
              {/* More */}
              <NavigationMenuItem>
                <NavigationMenuTrigger
                  className={
                    navigationMenuTriggerStyle() +
                    ` bg-transparent ${oswald.className} text-[#800000]`
                  }
                >
                  Menu
                </NavigationMenuTrigger>
                <NavigationMenuContent className="z-[9999]">
                  <ul className="grid w-[300px] gap-4">
                    {moreItems.map((item) => (
                      <ListItem
                        key={item.title}
                        title={item.title}
                        href={item.href}
                      >
                        {item.description}
                      </ListItem>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              {/* Home - Community Home */}
              <NavigationMenuItem className="mb-5">
                <NavigationMenuLink
                  asChild
                  className={
                    navigationMenuTriggerStyle() +
                    ` bg-transparent ${oswald.className} text-[#800000]`
                  }
                >
                  <Link
                    href="/community/home"
                    className="flex items-center gap-2"
                  >
                    <Home className="w-4 h-4" />
                    Home
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>

              {/* Groups */}
              <NavigationMenuItem className="mb-5">
                <NavigationMenuLink
                  asChild
                  className={
                    navigationMenuTriggerStyle() +
                    ` bg-transparent ${oswald.className} text-[#800000]`
                  }
                >
                  <Link
                    href="/community/groups"
                    className="flex items-center gap-2"
                  >
                    <Users className="w-4 h-4" />
                    Groups
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>

              {/* Profile */}
              <NavigationMenuItem className="mb-5">
                <NavigationMenuLink
                  asChild
                  className={
                    navigationMenuTriggerStyle() +
                    ` bg-transparent ${oswald.className} text-[#800000]`
                  }
                >
                  <Link
                    href="/community/profile"
                    className="flex items-center gap-2"
                  >
                    <User className="w-4 h-4" />
                    Profile
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>

              {/* Games */}
              <NavigationMenuItem className="mb-5">
                <NavigationMenuLink
                  asChild
                  className={
                    navigationMenuTriggerStyle() +
                    ` bg-transparent ${oswald.className} text-[#800000]`
                  }
                >
                  <Link
                    href="/community/games"
                    className="flex items-center gap-2"
                  >
                    <Gamepad2 className="w-4 h-4" />
                    Games
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>

              {/* Leaderboard */}
              <NavigationMenuItem className="mb-5">
                <NavigationMenuLink
                  asChild
                  className={
                    navigationMenuTriggerStyle() +
                    ` bg-transparent ${oswald.className} text-[#800000]`
                  }
                >
                  <Link
                    href="/community/games/leaderboard"
                    className="flex items-center gap-2"
                  >
                    <Trophy className="w-4 h-4" />
                    Leaderboard
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
          <UserMenu />
        </div>
      )}
    </>
  );
}

function MobileNavContent({ onClose }: { onClose: () => void }) {
  const [moreOpen, setMoreOpen] = React.useState(false);

  return (
    <SheetContent
      side="left"
      className="w-[300px] sm:w-[400px] flex flex-col z-[9999]"
    >
      <SheetHeader className="border-b pb-4">
        <SheetTitle className={`text-2xl ${oswald.className}`}>
          Community Menu
        </SheetTitle>
      </SheetHeader>
      <nav className="flex flex-col gap-1 mt-4 overflow-y-auto flex-1">
        {/* Home - Community Home */}
        <Link
          href="/community/home"
          className={`text-lg font-semibold px-4 py-3 rounded-lg hover:bg-accent hover:text-accent-foreground active:bg-accent/80 transition-all ${oswald.className} text-[#800000] flex items-center gap-2`}
          onClick={onClose}
        >
          <Home className="w-5 h-5" />
          Home
        </Link>

        <div className="h-px bg-border my-2" />

        {/* Groups */}
        <Link
          href="/community/groups"
          className={`text-lg font-semibold px-4 py-3 rounded-lg hover:bg-accent hover:text-accent-foreground active:bg-accent/80 transition-all ${oswald.className} text-[#800000] flex items-center gap-2`}
          onClick={onClose}
        >
          <Users className="w-5 h-5" />
          Groups
        </Link>

        <div className="h-px bg-border my-2" />

        {/* Profile */}
        <Link
          href="/community/profile"
          className={`text-lg font-semibold px-4 py-3 rounded-lg hover:bg-accent hover:text-accent-foreground active:bg-accent/80 transition-all ${oswald.className} text-[#800000] flex items-center gap-2`}
          onClick={onClose}
        >
          <User className="w-5 h-5" />
          Profile
        </Link>

        {/* Games */}
        <Link
          href="/community/games"
          className={`text-lg font-semibold px-4 py-3 rounded-lg hover:bg-accent hover:text-accent-foreground active:bg-accent/80 transition-all ${oswald.className} text-[#800000] flex items-center gap-2`}
          onClick={onClose}
        >
          <Gamepad2 className="w-5 h-5" />
          Games
        </Link>

        <div className="h-px bg-border my-2" />

        {/* Leaderboard */}
        <Link
          href="/community/games/leaderboard"
          className={`text-lg font-semibold px-4 py-3 rounded-lg hover:bg-accent hover:text-accent-foreground active:bg-accent/80 transition-all ${oswald.className} text-[#800000] flex items-center gap-2`}
          onClick={onClose}
        >
          <Trophy className="w-5 h-5" />
          Leaderboard
        </Link>

        <div className="h-px bg-border my-2" />

        {/* More */}
        <Collapsible open={moreOpen} onOpenChange={setMoreOpen}>
          <CollapsibleTrigger
            className={`w-full flex items-center justify-between text-lg font-semibold px-4 py-3 rounded-lg hover:bg-accent hover:text-accent-foreground active:bg-accent/80 transition-all ${oswald.className} text-[#800000]`}
          >
            More
            <ChevronDown
              className={`h-5 w-5 transition-transform duration-300 ${
                moreOpen ? "rotate-180" : ""
              }`}
            />
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-1 mb-2 space-y-1 bg-muted/30 rounded-lg py-2">
            {moreItems.map((item) => (
              <Link
                key={item.title}
                href={item.href}
                className="block pl-8 pr-4 py-2.5 text-base text-muted-foreground hover:text-foreground hover:bg-accent/50 rounded-md mx-2 transition-all"
                onClick={onClose}
              >
                {item.title}
              </Link>
            ))}
          </CollapsibleContent>
        </Collapsible>

        <div className="h-px bg-border my-2" />

        {/* User Menu Section */}
        {/* <div className="px-4 py-3">
          <UserMenu />
        </div> */}
      </nav>
    </SheetContent>
  );
}

function ListItem({
  title,
  children,
  href,
  ...props
}: React.ComponentPropsWithoutRef<"li"> & { href: string }) {
  return (
    <li {...props}>
      <NavigationMenuLink asChild>
        <Link href={href}>
          <div className="text-sm leading-none font-medium">{title}</div>
          <p className="text-muted-foreground line-clamp-2 text-sm leading-snug">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
}
