"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getActiveGames } from "@/actions/community/games";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Gamepad2, Users, Clock, CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

interface Game {
  id: string;
  title: string;
  description: string;
  type: "quiz" | "writing_challenge" | "puzzle";
  difficulty: "easy" | "medium" | "hard";
  instructions: string | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  config: Record<string, any> | null;
  publishedAt: Date | null;
  expiresAt: Date | null;
  submissionCount: number;
  userParticipated: boolean;
}

export default function GamesListing() {
  const [filters, setFilters] = useState({
    search: "",
    type: "all",
    difficulty: "all",
    page: 1,
  });

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["active-games", filters],
    queryFn: () =>
      getActiveGames({
        page: filters.page,
        limit: 12,
        type:
          filters.type === "all"
            ? undefined
            : (filters.type as "quiz" | "writing_challenge" | "puzzle"),
        difficulty:
          filters.difficulty === "all"
            ? undefined
            : (filters.difficulty as "easy" | "medium" | "hard"),
        search: filters.search || undefined,
      }),
  });

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: 1,
    }));
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      type: "all",
      difficulty: "all",
      page: 1,
    });
  };

  const getGameTypeIcon = (type: string) => {
    switch (type) {
      case "quiz":
        return "🧠";
      case "writing_challenge":
        return "✍️";
      case "puzzle":
        return "🧩";
      default:
        return "🎮";
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-100 text-green-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "hard":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getGameStatus = (game: Game) => {
    if (game.expiresAt && new Date() > game.expiresAt) {
      return { status: "expired", color: "text-red-500", icon: XCircle };
    }
    return { status: "active", color: "text-green-500", icon: CheckCircle };
  };

  if (error) {
    toast.error("Failed to load games");
    return (
      <div className="text-center py-10">
        <p className="text-red-500 mb-4">Failed to load games</p>
        <Button onClick={() => refetch()}>Try Again</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search games..."
            value={filters.search}
            onChange={(e) => handleFilterChange("search", e.target.value)}
          />
        </div>
        <Select
          value={filters.type}
          onValueChange={(value) => handleFilterChange("type", value)}
        >
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="quiz">Quiz</SelectItem>
            <SelectItem value="writing_challenge">Writing Challenge</SelectItem>
            <SelectItem value="puzzle">Puzzle</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={filters.difficulty}
          onValueChange={(value) => handleFilterChange("difficulty", value)}
        >
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="All Difficulties" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Difficulties</SelectItem>
            <SelectItem value="easy">Easy</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="hard">Hard</SelectItem>
          </SelectContent>
        </Select>
        {(filters.search ||
          filters.type !== "all" ||
          filters.difficulty !== "all") && (
          <Button variant="outline" onClick={clearFilters}>
            Clear
          </Button>
        )}
      </div>

      {/* Games Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-20 w-full" />
                <div className="flex gap-2 mt-4">
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-6 w-16" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : data?.data && data.data.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.data.map((game: Game) => {
              const gameStatus = getGameStatus(game);
              const StatusIcon = gameStatus.icon;

              return (
                <Card
                  key={game.id}
                  className="hover:shadow-lg transition-shadow"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">
                          {getGameTypeIcon(game.type)}
                        </span>
                        <div>
                          <CardTitle className="text-lg line-clamp-1">
                            {game.title}
                          </CardTitle>
                          <CardDescription className="capitalize">
                            {game.type.replace("_", " ")} • {game.difficulty}
                          </CardDescription>
                        </div>
                      </div>
                      <StatusIcon className={`h-5 w-5 ${gameStatus.color}`} />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                      {game.description}
                    </p>

                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span>{game.submissionCount} participants</span>
                      </div>
                      {game.expiresAt && (
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>
                            Expires{" "}
                            {new Date(game.expiresAt).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <Badge className={getDifficultyColor(game.difficulty)}>
                        {game.difficulty}
                      </Badge>

                      {game.userParticipated ? (
                        <Badge
                          variant="secondary"
                          className="flex items-center gap-1"
                        >
                          <CheckCircle className="h-3 w-3" />
                          Participated
                        </Badge>
                      ) : gameStatus.status === "active" ? (
                        <Button asChild size="sm">
                          <Link href={`/community/games/${game.id}`}>
                            <Gamepad2 className="h-4 w-4 mr-1" />
                            Play
                          </Link>
                        </Button>
                      ) : (
                        <Button variant="outline" size="sm" disabled>
                          Expired
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Pagination */}
          {data.total > data.limit && (
            <div className="flex justify-center gap-2">
              <Button
                variant="outline"
                disabled={filters.page === 1}
                onClick={() =>
                  setFilters((prev) => ({ ...prev, page: prev.page - 1 }))
                }
              >
                Previous
              </Button>
              <span className="flex items-center px-4">
                Page {filters.page} of {Math.ceil(data.total / data.limit)}
              </span>
              <Button
                variant="outline"
                disabled={filters.page >= Math.ceil(data.total / data.limit)}
                onClick={() =>
                  setFilters((prev) => ({ ...prev, page: prev.page + 1 }))
                }
              >
                Next
              </Button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-10">
          <Gamepad2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No games found</h3>
          <p className="text-muted-foreground mb-4">
            {filters.search ||
            filters.type !== "all" ||
            filters.difficulty !== "all"
              ? "Try adjusting your filters to see more games."
              : "No games are available at the moment. Check back later!"}
          </p>
          {(filters.search ||
            filters.type !== "all" ||
            filters.difficulty !== "all") && (
            <Button onClick={clearFilters}>Clear Filters</Button>
          )}
        </div>
      )}
    </div>
  );
}
