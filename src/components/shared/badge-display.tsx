"use client";

import React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface BadgeData {
  id: string;
  name: string;
  description: string;
  icon: string;
  type: string;
  rarity: "common" | "rare" | "epic" | "legendary";
}

interface BadgeDisplayProps {
  badges: BadgeData[];
  maxDisplay?: number;
  size?: "sm" | "md" | "lg";
  showTooltip?: boolean;
  className?: string;
}

export default function BadgeDisplay({
  badges,
  maxDisplay = 2,
  size = "sm",
  showTooltip = true,
  className = "",
}: BadgeDisplayProps) {
  if (!badges || badges.length === 0) return null;

  const displayedBadges = badges.slice(0, maxDisplay);
  const remainingCount = badges.length - maxDisplay;

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "common":
        return "bg-gray-100 text-gray-800 border-gray-300";
      case "rare":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "epic":
        return "bg-purple-100 text-purple-800 border-purple-300";
      case "legendary":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const getSizeClasses = (size: string) => {
    switch (size) {
      case "sm":
        return "h-4 w-4 text-xs";
      case "md":
        return "h-5 w-5 text-sm";
      case "lg":
        return "h-6 w-6 text-base";
      default:
        return "h-4 w-4 text-xs";
    }
  };

  const BadgeIcon = ({ badge }: { badge: BadgeData }) => {
    const iconContent = (
      <div
        className={`${getSizeClasses(
          size
        )} rounded-full border-2 ${getRarityColor(
          badge.rarity
        )} flex items-center justify-center font-bold`}
      >
        {badge.icon || "🏆"}
      </div>
    );

    if (showTooltip) {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>{iconContent}</TooltipTrigger>
            <TooltipContent>
              <div className="text-center">
                <p className="font-semibold">{badge.name}</p>
                <p className="text-xs text-muted-foreground">
                  {badge.description}
                </p>
                <p className="text-xs capitalize text-muted-foreground mt-1">
                  {badge.rarity} • {badge.type.replace("_", " ")}
                </p>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }

    return iconContent;
  };

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {displayedBadges.map((badge) => (
        <BadgeIcon key={badge.id} badge={badge} />
      ))}

      {remainingCount > 0 && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div
                className={`${getSizeClasses(
                  size
                )} rounded-full bg-gray-100 text-gray-600 border border-gray-300 flex items-center justify-center font-bold cursor-help`}
              >
                +{remainingCount}
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <div className="space-y-2">
                <p className="font-semibold">More badges ({remainingCount})</p>
                <div className="space-y-1 max-h-32 overflow-y-auto">
                  {badges.slice(maxDisplay).map((badge) => (
                    <div key={badge.id} className="text-xs">
                      <span className="font-medium">{badge.name}</span>
                      <span className="text-muted-foreground ml-1">
                        ({badge.rarity})
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  );
}
