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
import { usePathname, useRouter } from "next/navigation";
import { useBreakpoint } from "@/hooks/use-breakpoint";

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
});

const components: { title: string; href: string; description: string }[] = [
  {
    title: "Books",
    href: "/shop/books",
    description:
      "Browse our collection of inspirational and motivational books to transform your life.",
  },
  {
    title: "Merchandise",
    href: "/shop/merch",
    description:
      "Shop our exclusive merchandise including apparel, accessories, and motivational items.",
  },
  {
    title: "New Releases",
    href: "/shop/books/new",
    description: "Discover our latest book releases and upcoming publications.",
  },
];

export function Navbar() {
  const isMobile = useBreakpoint("max-lg");
  const [isOpen, setIsOpen] = React.useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const isNGOPage = pathname.includes("/ngo");

  return (
    <>
      {isMobile && (
        <div className="flex justify-between items-center z-[999]">
          <Image
            src={
              isNGOPage ? "/logos/NGO.png" : "/logos/LANDSCAPE-LOGO-BLACK.png"
            }
            alt="logo"
            width={200}
            height={100}
            className={isNGOPage ? "w-auto h-30" : "w-auto h-20"}
            onClick={() => router.push("/")}
          />
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
      )}
      {!isMobile && (
        <div className="flex justify-between items-center max-w-7xl mx-auto z-[999]">
          <Image
            src={
              isNGOPage ? "/logos/NGO.png" : "/logos/LANDSCAPE-LOGO-BLACK.png"
            }
            alt="logo"
            width={200}
            height={100}
            className={isNGOPage ? "w-auto h-30" : "w-auto h-20"}
            onClick={() => router.push("/")}
          />
          <NavigationMenu viewport={false} className="relative z-[9999]">
            <NavigationMenuList>
              {/* Home */}
              <NavigationMenuItem>
                <NavigationMenuLink
                  asChild
                  className={
                    navigationMenuTriggerStyle() +
                    ` bg-transparent ${oswald.className} text-[#800000]`
                  }
                >
                  <Link href="/">Home</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              {/* About Me */}
              <NavigationMenuItem>
                <NavigationMenuTrigger
                  className={`bg-transparent font-semibold ${oswald.className} text-[#800000]`}
                >
                  About Me
                </NavigationMenuTrigger>
                <NavigationMenuContent className="z-[9999]">
                  <ul className="grid gap-2 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                    <ListItem href="/about" title="Who I Am">
                      Discover the person behind the creative works and vision.
                    </ListItem>
                    <ListItem href="/about#journey" title="My Journey">
                      Explore my journey, experiences, and the inspiration
                      behind my work.
                    </ListItem>
                    <ListItem href="/about#vision" title="My Vision">
                      Discover my vision for empowering others and creating
                      positive change.
                    </ListItem>
                    <ListItem href="/about#mission" title="My Mission">
                      Understand my mission to inspire, motivate, and help
                      others achieve their goals.
                    </ListItem>
                    <ListItem href="/about#media" title="Media Mentions">
                      See where I&apos;ve been featured and the impact of my
                      work in the media.
                    </ListItem>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              {/* Shop */}
              <NavigationMenuItem>
                <NavigationMenuTrigger
                  className={`bg-transparent font-semibold ${oswald.className} text-[#800000]`}
                >
                  Shop
                </NavigationMenuTrigger>
                <NavigationMenuContent className="z-[9999]">
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
                <NavigationMenuTrigger
                  className={`bg-transparent font-semibold ${oswald.className} text-[#800000]`}
                >
                  Services
                </NavigationMenuTrigger>
                <NavigationMenuContent className="z-[9999]">
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
              {/* NGO */}
              <NavigationMenuItem>
                <NavigationMenuLink
                  asChild
                  className={
                    navigationMenuTriggerStyle() +
                    ` bg-transparent font-semibold ${oswald.className} text-[#800000]`
                  }
                >
                  <Link href="/ngo">NGO</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              {/* Community */}
              <NavigationMenuItem>
                <NavigationMenuLink
                  asChild
                  className={
                    navigationMenuTriggerStyle() +
                    ` bg-transparent font-semibold ${oswald.className} text-[#800000]`
                  }
                >
                  <Link href="/community">Community</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              {/* Projects */}
              <NavigationMenuItem>
                <NavigationMenuLink
                  asChild
                  className={
                    navigationMenuTriggerStyle() +
                    ` bg-transparent font-semibold ${oswald.className} text-[#800000]`
                  }
                >
                  <Link href="/portfolio">Projects</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              {/* Blog */}
              <NavigationMenuItem>
                <NavigationMenuLink
                  asChild
                  className={
                    navigationMenuTriggerStyle() +
                    ` bg-transparent font-semibold ${oswald.className} text-[#800000]`
                  }
                >
                  <Link href="/blog">Blog</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              {/* FAQ */}
              <NavigationMenuItem>
                <NavigationMenuLink
                  asChild
                  className={
                    navigationMenuTriggerStyle() +
                    ` bg-transparent font-semibold ${oswald.className} text-[#800000]`
                  }
                >
                  <Link href="/faq">FAQ</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              {/* Contact Me */}
              <NavigationMenuItem>
                <NavigationMenuLink
                  asChild
                  className={
                    navigationMenuTriggerStyle() +
                    ` bg-transparent font-semibold ${oswald.className} text-[#800000]`
                  }
                >
                  <Link href="/contact">Contact Me</Link>
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
    <SheetContent
      side="left"
      className="w-[300px] sm:w-[400px] flex flex-col z-[999"
    >
      <SheetHeader className="border-b pb-4">
        <SheetTitle className={`text-2xl ${oswald.className}`}>Menu</SheetTitle>
      </SheetHeader>
      <nav className="flex flex-col gap-1 mt-4 overflow-y-auto flex-1">
        {/* Home */}
        <Link
          href="/"
          className={`text-lg font-semibold px-4 py-3 rounded-lg hover:bg-accent hover:text-accent-foreground active:bg-accent/80 transition-all ${oswald.className} text-[#800000]`}
          onClick={onClose}
        >
          Home
        </Link>

        <div className="h-px bg-border my-2" />

        {/* About Me */}
        <Collapsible open={aboutOpen} onOpenChange={setAboutOpen}>
          <CollapsibleTrigger
            className={`w-full flex items-center justify-between text-lg font-semibold px-4 py-3 rounded-lg hover:bg-accent hover:text-accent-foreground active:bg-accent/80 transition-all ${oswald.className} text-[#800000]`}
          >
            About Me
            <ChevronDown
              className={`h-5 w-5 transition-transform duration-300 ${
                aboutOpen ? "rotate-180" : ""
              }`}
            />
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-1 mb-2 space-y-1 bg-muted/30 rounded-lg py-2">
            <Link
              href="/about"
              className="block pl-8 pr-4 py-2.5 text-base text-muted-foreground hover:text-foreground hover:bg-accent/50 rounded-md mx-2 transition-all"
              onClick={onClose}
            >
              Who I Am
            </Link>
            <Link
              href="/about#journey"
              className="block pl-8 pr-4 py-2.5 text-base text-muted-foreground hover:text-foreground hover:bg-accent/50 rounded-md mx-2 transition-all"
              onClick={onClose}
            >
              My Journey
            </Link>
            <Link
              href="/about#vision"
              className="block pl-8 pr-4 py-2.5 text-base text-muted-foreground hover:text-foreground hover:bg-accent/50 rounded-md mx-2 transition-all"
              onClick={onClose}
            >
              My Vision
            </Link>
            <Link
              href="/about#mission"
              className="block pl-8 pr-4 py-2.5 text-base text-muted-foreground hover:text-foreground hover:bg-accent/50 rounded-md mx-2 transition-all"
              onClick={onClose}
            >
              My Mission
            </Link>
            <Link
              href="/about#media"
              className="block pl-8 pr-4 py-2.5 text-base text-muted-foreground hover:text-foreground hover:bg-accent/50 rounded-md mx-2 transition-all"
              onClick={onClose}
            >
              Media Mentions
            </Link>
          </CollapsibleContent>
        </Collapsible>

        <div className="h-px bg-border my-2" />

        {/* Shop */}
        <Collapsible open={bookshopOpen} onOpenChange={setBookshopOpen}>
          <CollapsibleTrigger
            className={`w-full flex items-center justify-between text-lg font-semibold px-4 py-3 rounded-lg hover:bg-accent hover:text-accent-foreground active:bg-accent/80 transition-all ${oswald.className} text-[#800000]`}
          >
            Shop
            <ChevronDown
              className={`h-5 w-5 transition-transform duration-300 ${
                bookshopOpen ? "rotate-180" : ""
              }`}
            />
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-1 mb-2 space-y-1 bg-muted/30 rounded-lg py-2">
            {components.map((component) => (
              <Link
                key={component.title}
                href={component.href}
                className="block pl-8 pr-4 py-2.5 text-base text-muted-foreground hover:text-foreground hover:bg-accent/50 rounded-md mx-2 transition-all"
                onClick={onClose}
              >
                {component.title}
              </Link>
            ))}
          </CollapsibleContent>
        </Collapsible>

        <div className="h-px bg-border my-2" />

        {/* Services */}
        <Collapsible open={servicesOpen} onOpenChange={setServicesOpen}>
          <CollapsibleTrigger
            className={`w-full flex items-center justify-between text-lg font-semibold px-4 py-3 rounded-lg hover:bg-accent hover:text-accent-foreground active:bg-accent/80 transition-all ${oswald.className} text-[#800000]`}
          >
            Services
            <ChevronDown
              className={`h-5 w-5 transition-transform duration-300 ${
                servicesOpen ? "rotate-180" : ""
              }`}
            />
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-1 mb-2 space-y-1 bg-muted/30 rounded-lg py-2">
            <Link
              href="/services/coaching"
              className="block pl-8 pr-4 py-2.5 text-base text-muted-foreground hover:text-foreground hover:bg-accent/50 rounded-md mx-2 transition-all"
              onClick={onClose}
            >
              Coaching
            </Link>
            <Link
              href="/services/ghostwriting"
              className="block pl-8 pr-4 py-2.5 text-base text-muted-foreground hover:text-foreground hover:bg-accent/50 rounded-md mx-2 transition-all"
              onClick={onClose}
            >
              Ghostwriting
            </Link>
            <Link
              href="/services/consulting"
              className="block pl-8 pr-4 py-2.5 text-base text-muted-foreground hover:bg-accent/50 hover:text-foreground rounded-md mx-2 transition-all"
              onClick={onClose}
            >
              Consulting
            </Link>
          </CollapsibleContent>
        </Collapsible>

        <div className="h-px bg-border my-2" />

        {/* NGO */}
        <Link
          href="/ngo"
          className={`text-lg font-semibold px-4 py-3 rounded-lg hover:bg-accent hover:text-accent-foreground active:bg-accent/80 transition-all ${oswald.className} text-[#800000]`}
          onClick={onClose}
        >
          NGO
        </Link>

        <div className="h-px bg-border my-2" />

        {/* Community */}
        <Link
          href="/community"
          className={`text-lg font-semibold px-4 py-3 rounded-lg hover:bg-accent hover:text-accent-foreground active:bg-accent/80 transition-all ${oswald.className} text-[#800000]`}
          onClick={onClose}
        >
          Community
        </Link>

        <div className="h-px bg-border my-2" />

        {/* Projects */}
        <Link
          href="/portfolio"
          className={`text-lg font-semibold px-4 py-3 rounded-lg hover:bg-accent hover:text-accent-foreground active:bg-accent/80 transition-all ${oswald.className} text-[#800000]`}
          onClick={onClose}
        >
          Projects
        </Link>

        <div className="h-px bg-border my-2" />

        {/* Blog */}
        <Link
          href="/blog"
          className={`text-lg font-semibold px-4 py-3 rounded-lg hover:bg-accent hover:text-accent-foreground active:bg-accent/80 transition-all ${oswald.className} text-[#800000]`}
          onClick={onClose}
        >
          Blog
        </Link>

        <div className="h-px bg-border my-2" />

        {/* FAQ */}
        <Link
          href="/faq"
          className={`text-lg font-semibold px-4 py-3 rounded-lg hover:bg-accent hover:text-accent-foreground active:bg-accent/80 transition-all ${oswald.className} text-[#800000]`}
          onClick={onClose}
        >
          FAQ
        </Link>

        <div className="h-px bg-border my-2" />

        {/* Contact Me */}
        <Link
          href="/contact"
          className={`text-lg font-semibold px-4 py-3 rounded-lg hover:bg-accent hover:text-accent-foreground active:bg-accent/80 transition-all ${oswald.className} text-[#800000]`}
          onClick={onClose}
        >
          Contact Me
        </Link>

        <div className="h-px bg-border my-2" />
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
