"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils";

interface BreadcrumbItem {
  label: string;
  href?: string;
  current?: boolean;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumb({ items, className }: BreadcrumbProps) {
  return (
    <nav
      className={cn(
        "flex items-center space-x-1 text-sm text-muted-foreground",
        className
      )}
      aria-label="Breadcrumb"
    >
      <Link
        href="/admin"
        className="flex items-center hover:text-foreground transition-colors"
      >
        <Home className="w-4 h-4 mr-1" />
        Dashboard
      </Link>

      {items.map((item, index) => (
        <React.Fragment key={index}>
          <ChevronRight className="w-4 h-4" />
          {item.current ? (
            <span className="font-medium text-foreground">{item.label}</span>
          ) : item.href ? (
            <Link
              href={item.href}
              className="hover:text-foreground transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span>{item.label}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}
