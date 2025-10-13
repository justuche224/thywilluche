"use client";

import React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface HelpTooltipProps {
  content: string;
  children?: React.ReactNode;
  className?: string;
}

export function HelpTooltip({
  content,
  children,
  className,
}: HelpTooltipProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {children || (
            <HelpCircle
              className={cn(
                "w-4 h-4 text-muted-foreground hover:text-foreground",
                className
              )}
            />
          )}
        </TooltipTrigger>
        <TooltipContent>
          <p className="max-w-xs">{content}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
