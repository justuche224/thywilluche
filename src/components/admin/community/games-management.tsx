"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getGamesForAdmin, deleteGame } from "@/actions/admin/games";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Plus,
  Search,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Users,
  Trophy,
  Calendar,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

interface Game {
  id: string;
  title: string;
  description: string;
  type: "quiz" | "writing_challenge" | "puzzle";
  difficulty: "easy" | "medium" | "hard";
  status: "draft" | "published" | "archived";
  publishedAt: Date | null;
  createdAt: Date;
  submissionCount: number;
  winnerCount: number;
}

export default function GamesManagement() {
  const [filters, setFilters] = useState({
    search: "",
    status: "all",
    type: "all",
    page: 1,
  });
  const [deleteGameId, setDeleteGameId] = useState<string | null>(null);

  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["admin-games", filters],
    queryFn: () =>
      getGamesForAdmin({
        page: filters.page,
        limit: 20,
        status:
          filters.status === "all"
            ? undefined
            : (filters.status as "draft" | "published" | "archived"),
        type:
          filters.type === "all"
            ? undefined
            : (filters.type as "quiz" | "writing_challenge" | "puzzle"),
        search: filters.search || undefined,
      }),
  });

  const deleteMutation = useMutation({
    mutationFn: (gameId: string) => deleteGame({ gameId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-games"] });
      setDeleteGameId(null);
      toast.success("Game deleted successfully");
    },
    onError: () => {
      toast.error("Failed to delete game");
    },
  });

  const updateLeaderboardMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/admin/update-leaderboard", {
        method: "POST",
      });
      if (!response.ok) throw new Error("Failed to update leaderboard");
      return response.json();
    },
    onSuccess: () => {
      toast.success("Leaderboard updated successfully");
    },
    onError: () => {
      toast.error("Failed to update leaderboard");
    },
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
      status: "all",
      type: "all",
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "bg-green-100 text-green-800";
      case "draft":
        return "bg-gray-100 text-gray-800";
      case "archived":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (error) {
    toast.error("Failed to load games");
    return (
      <div className="text-center py-10">
        <p className="text-red-500 mb-4">Failed to load games</p>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Button asChild>
            <Link href="/admin/community/games/new">
              <Plus className="h-4 w-4 mr-2" />
              Create Game
            </Link>
          </Button>
          <Button
          className="hidden"
            variant="outline"
            onClick={() => updateLeaderboardMutation.mutate()}
            disabled={updateLeaderboardMutation.isPending}
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${
                updateLeaderboardMutation.isPending ? "animate-spin" : ""
              }`}
            />
            Update Leaderboard
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      {data?.data && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Games</CardTitle>
              <span className="text-2xl">🎮</span>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.total}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Published</CardTitle>
              <span className="text-2xl">✅</span>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {data.data.filter((g: Game) => g.status === "published").length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Submissions
              </CardTitle>
              <Users className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {data.data.reduce(
                  (sum: number, game: Game) => sum + game.submissionCount,
                  0
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Winners
              </CardTitle>
              <Trophy className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {data.data.reduce(
                  (sum: number, game: Game) => sum + game.winnerCount,
                  0
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filter Games</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search games..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange("search", e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select
              value={filters.status}
              onValueChange={(value) => handleFilterChange("status", value)}
            >
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
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
                <SelectItem value="writing_challenge">
                  Writing Challenge
                </SelectItem>
                <SelectItem value="puzzle">Puzzle</SelectItem>
              </SelectContent>
            </Select>
            {(filters.search ||
              filters.status !== "all" ||
              filters.type !== "all") && (
              <Button variant="outline" onClick={clearFilters}>
                Clear
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Games Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Games</CardTitle>
              <CardDescription>
                Manage all games, quizzes, and challenges
              </CardDescription>
            </div>
            <Button asChild>
              <Link href="/admin/community/games/new">
                <Plus className="h-4 w-4 mr-2" />
                Create Game
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <Skeleton className="h-4 w-4" />
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-20" />
                </div>
              ))}
            </div>
          ) : data?.data && data.data.length > 0 ? (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Difficulty</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Submissions</TableHead>
                      <TableHead>Winners</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="w-12"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.data.map((game: Game) => (
                      <TableRow key={game.id}>
                        <TableCell className="max-w-xs">
                          <div className="flex items-center gap-2">
                            <span className="text-lg flex-shrink-0">
                              {getGameTypeIcon(game.type)}
                            </span>
                            <div className="min-w-0 flex-1">
                              <div className="font-medium truncate">
                                {game.title}
                              </div>
                              <div className="text-sm text-muted-foreground truncate">
                                {game.description}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">
                            {game.type.replace("_", " ")}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={getDifficultyColor(game.difficulty)}
                          >
                            {game.difficulty}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(game.status)}>
                            {game.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            <span>{game.submissionCount}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Trophy className="h-4 w-4 text-muted-foreground" />
                            <span>{game.winnerCount}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            {new Date(game.createdAt).toLocaleDateString()}
                          </div>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem asChild>
                                <Link href={`/community/games/${game.id}`}>
                                  <Eye className="h-4 w-4 mr-2" />
                                  View
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <Link
                                  href={`/admin/community/games/${game.id}/edit`}
                                >
                                  <Edit className="h-4 w-4 mr-2" />
                                  Edit
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <Link
                                  href={`/admin/community/games/${game.id}/submissions`}
                                >
                                  <Users className="h-4 w-4 mr-2" />
                                  Submissions
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => setDeleteGameId(game.id)}
                                className="text-red-600"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {data.total > data.limit && (
                <div className="flex justify-center gap-2 mt-6">
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
                    disabled={
                      filters.page >= Math.ceil(data.total / data.limit)
                    }
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
              <div className="text-6xl mb-4">🎮</div>
              <h3 className="text-lg font-semibold mb-2">No games found</h3>
              <p className="text-muted-foreground mb-4">
                {filters.search || filters.status || filters.type
                  ? "Try adjusting your filters to see more games."
                  : "Get started by creating your first game."}
              </p>
              <Button asChild>
                <Link href="/admin/community/games/new">Create Game</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!deleteGameId}
        onOpenChange={() => setDeleteGameId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Game</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this game? This action cannot be
              undone and will also delete all associated submissions, questions,
              and rewards.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() =>
                deleteGameId && deleteMutation.mutate(deleteGameId)
              }
              disabled={deleteMutation.isPending}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete Game"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
