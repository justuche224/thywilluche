"use client";

import * as React from "react";
import Link from "next/link";
import { Menu, ChevronDown } from "lucide-react";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { useIsMobile } from "@/hooks/use-mobile";
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

const components: { title: string; href: string; description: string }[] = [
  {
    title: "Alert Dialog",
    href: "/docs/primitives/alert-dialog",
    description:
      "A modal dialog that interrupts the user with important content and expects a response.",
  },
  {
    title: "Hover Card",
    href: "/docs/primitives/hover-card",
    description:
      "For sighted users to preview content available behind a link.",
  },
  {
    title: "Progress",
    href: "/docs/primitives/progress",
    description:
      "Displays an indicator showing the completion progress of a task, typically displayed as a progress bar.",
  },
  {
    title: "Scroll-area",
    href: "/docs/primitives/scroll-area",
    description: "Visually or semantically separates content.",
  },
  {
    title: "Tabs",
    href: "/docs/primitives/tabs",
    description:
      "A set of layered sections of content—known as tab panels—that are displayed one at a time.",
  },
  {
    title: "Tooltip",
    href: "/docs/primitives/tooltip",
    description:
      "A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.",
  },
];

export function Navbar() {
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <>
      {isMobile && (
        <div className="flex justify-between items-center">
          <p>Thy Will Uche</p>
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <MobileNavContent onClose={() => setIsOpen(false)} />
          </Sheet>
        </div>
      )}
      {!isMobile && (
        <div className="flex justify-between items-center">
          <p>Thy Will Uche</p>
          <NavigationMenu viewport={false}>
            <NavigationMenuList>
              {/* Home */}
              <NavigationMenuItem>
                <NavigationMenuLink
                  asChild
                  className={navigationMenuTriggerStyle() + " bg-transparent"}
                >
                  <Link href="/">Home</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              {/* About Me */}
              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent">
                  About Me
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid gap-2 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                    <ListItem href="/about" title="My Story">
                      Re-usable components built using Radix UI and Tailwind
                      CSS.
                    </ListItem>
                    <ListItem href="/about#vision" title="My Vision">
                      How to install dependencies and structure your app.
                    </ListItem>
                    <ListItem href="/about#mission" title="My Mission">
                      Styles for headings, paragraphs, lists...etc
                    </ListItem>
                    <ListItem href="/about#media" title="Media Mentions">
                      Styles for headings, paragraphs, lists...etc
                    </ListItem>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              {/* Bookshop */}
              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent">
                  Bookshop
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-2 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                    {components.map((component) => (
                      <ListItem
                        key={component.title}
                        title={component.title}
                        href={component.href}
                      >
                        {component.description}
                      </ListItem>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              {/* Services */}
              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent">
                  Services
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[300px] gap-4">
                    <li>
                      <NavigationMenuLink asChild>
                        <Link href="/services/coaching">
                          <div className="font-medium">Coaching</div>
                          <div className="text-muted-foreground">
                            Personalized coaching to help you achieve your
                            goals.
                          </div>
                        </Link>
                      </NavigationMenuLink>
                      <NavigationMenuLink asChild>
                        <Link href="/services/ghostwriting">
                          <div className="font-medium">Ghostwriting</div>
                          <div className="text-muted-foreground">
                            Professional ghostwriting services to help you
                            create high-quality content.
                          </div>
                        </Link>
                      </NavigationMenuLink>
                      <NavigationMenuLink asChild>
                        <Link href="/services/consulting">
                          <div className="font-medium">Consulting</div>
                          <div className="text-muted-foreground">
                            Expert consulting services to help you achieve your
                            goals.
                          </div>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              {/* Community */}
              <NavigationMenuItem>
                <NavigationMenuLink
                  asChild
                  className={navigationMenuTriggerStyle() + " bg-transparent"}
                >
                  <Link href="/community">Community</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              {/* Projects */}
              <NavigationMenuItem>
                <NavigationMenuLink
                  asChild
                  className={navigationMenuTriggerStyle() + " bg-transparent"}
                >
                  <Link href="/projects">Projects</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      )}
    </>
  );
}

function MobileNavContent({ onClose }: { onClose: () => void }) {
  const [aboutOpen, setAboutOpen] = React.useState(false);
  const [bookshopOpen, setBookshopOpen] = React.useState(false);
  const [servicesOpen, setServicesOpen] = React.useState(false);

  return (
    <SheetContent side="left" className="w-[300px] sm:w-[400px]">
      <SheetHeader>
        <SheetTitle>Navigation</SheetTitle>
      </SheetHeader>
      <nav className="flex flex-col gap-4 mt-6">
        {/* Home */}
        <Link
          href="/"
          className="text-lg font-medium hover:text-primary transition-colors"
          onClick={onClose}
        >
          Home
        </Link>

        {/* About Me */}
        <Collapsible open={aboutOpen} onOpenChange={setAboutOpen}>
          <CollapsibleTrigger className="flex items-center justify-between text-lg font-medium hover:text-primary transition-colors">
            About Me
            <ChevronDown
              className={`h-4 w-4 transition-transform ${
                aboutOpen ? "rotate-180" : ""
              }`}
            />
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-2 space-y-2">
            <Link
              href="/about"
              className="block pl-4 text-base text-muted-foreground hover:text-foreground transition-colors"
              onClick={onClose}
            >
              My Story
            </Link>
            <Link
              href="/about#vision"
              className="block pl-4 text-base text-muted-foreground hover:text-foreground transition-colors"
              onClick={onClose}
            >
              My Vision
            </Link>
            <Link
              href="/about#mission"
              className="block pl-4 text-base text-muted-foreground hover:text-foreground transition-colors"
              onClick={onClose}
            >
              My Mission
            </Link>
            <Link
              href="/about#media"
              className="block pl-4 text-base text-muted-foreground hover:text-foreground transition-colors"
              onClick={onClose}
            >
              Media Mentions
            </Link>
          </CollapsibleContent>
        </Collapsible>

        {/* Bookshop */}
        <Collapsible open={bookshopOpen} onOpenChange={setBookshopOpen}>
          <CollapsibleTrigger className="flex items-center justify-between text-lg font-medium hover:text-primary transition-colors">
            Bookshop
            <ChevronDown
              className={`h-4 w-4 transition-transform ${
                bookshopOpen ? "rotate-180" : ""
              }`}
            />
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-2 space-y-2">
            {components.map((component) => (
              <Link
                key={component.title}
                href={component.href}
                className="block pl-4 text-base text-muted-foreground hover:text-foreground transition-colors"
                onClick={onClose}
              >
                {component.title}
              </Link>
            ))}
          </CollapsibleContent>
        </Collapsible>

        {/* Services */}
        <Collapsible open={servicesOpen} onOpenChange={setServicesOpen}>
          <CollapsibleTrigger className="flex items-center justify-between text-lg font-medium hover:text-primary transition-colors">
            Services
            <ChevronDown
              className={`h-4 w-4 transition-transform ${
                servicesOpen ? "rotate-180" : ""
              }`}
            />
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-2 space-y-2">
            <Link
              href="/services/coaching"
              className="block pl-4 text-base text-muted-foreground hover:text-foreground transition-colors"
              onClick={onClose}
            >
              Coaching
            </Link>
            <Link
              href="/services/ghostwriting"
              className="block pl-4 text-base text-muted-foreground hover:text-foreground transition-colors"
              onClick={onClose}
            >
              Ghostwriting
            </Link>
            <Link
              href="/services/consulting"
              className="block pl-4 text-base text-muted-foreground hover:text-foreground transition-colors"
              onClick={onClose}
            >
              Consulting
            </Link>
          </CollapsibleContent>
        </Collapsible>

        {/* Community */}
        <Link
          href="/community"
          className="text-lg font-medium hover:text-primary transition-colors"
          onClick={onClose}
        >
          Community
        </Link>

        {/* Projects */}
        <Link
          href="/projects"
          className="text-lg font-medium hover:text-primary transition-colors"
          onClick={onClose}
        >
          Projects
        </Link>
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
