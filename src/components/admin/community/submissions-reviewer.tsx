"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getGameSubmissions, selectWinners } from "@/actions/admin/games";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
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
  Trophy,
  Users,
  Calendar,
  Search,
  CheckCircle,
  Clock,
} from "lucide-react";
import { toast } from "sonner";

interface Submission {
  id: string;
  answers: {
    [key: string]: unknown;
    questionId?: string;
    answer?: string | string[];
    text?: string;
    wordCount?: number;
    characterCount?: number;
    puzzleAnswer?: string;
    hintsUsed?: number;
  };
  submittedAt: Date;
  score: number | null;
  isWinner: boolean;
  feedback: string | null;
  user: {
    id: string;
    name: string;
    username: string | null;
    displayUsername: string | null;
    image: string | null;
  } | null;
}

interface SubmissionsReviewerProps {
  gameId: string;
  gameType: "quiz" | "writing_challenge" | "puzzle";
}

export default function SubmissionsReviewer({
  gameId,
  gameType,
}: SubmissionsReviewerProps) {
  const [filters, setFilters] = useState({
    search: "",
    isWinner: "",
    page: 1,
  });
  const [selectedSubmissions, setSelectedSubmissions] = useState<string[]>([]);
  const [showWinnerDialog, setShowWinnerDialog] = useState(false);

  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["game-submissions", gameId, filters],
    queryFn: () =>
      getGameSubmissions({
        gameId,
        page: filters.page,
        limit: 20,
        isWinner: filters.isWinner ? filters.isWinner === "true" : undefined,
      }),
  });

  const selectWinnersMutation = useMutation({
    mutationFn: (submissionIds: string[]) =>
      selectWinners({
        submissionIds,
        gameId,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["game-submissions"] });
      setSelectedSubmissions([]);
      setShowWinnerDialog(false);
      toast.success("Winners selected successfully");
    },
    onError: () => {
      toast.error("Failed to select winners");
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
      isWinner: "",
      page: 1,
    });
  };

  const handleSelectSubmission = (submissionId: string, checked: boolean) => {
    if (checked) {
      setSelectedSubmissions((prev) => [...prev, submissionId]);
    } else {
      setSelectedSubmissions((prev) =>
        prev.filter((id) => id !== submissionId)
      );
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked && data?.data) {
      setSelectedSubmissions(data.data.map((s) => s.id));
    } else {
      setSelectedSubmissions([]);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const renderSubmissionContent = (submission: Submission) => {
    switch (gameType) {
      case "quiz":
        return (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="font-medium">Score:</span>
              <Badge variant="secondary">{submission.score || 0} points</Badge>
            </div>
          </div>
        );

      case "writing_challenge":
        return (
          <div className="space-y-2">
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-sm whitespace-pre-wrap">
                {submission.answers.text || "No content"}
              </p>
            </div>
            <div className="flex gap-2 text-xs text-muted-foreground">
              <span>{submission.answers.wordCount || 0} words</span>
              <span>{submission.answers.characterCount || 0} characters</span>
            </div>
          </div>
        );

      case "puzzle":
        return (
          <div className="space-y-2">
            <div className="p-3 bg-muted rounded-lg">
              <p className="font-medium">
                Answer: {submission.answers.puzzleAnswer || "No answer"}
              </p>
              {submission.answers.hintsUsed &&
                submission.answers.hintsUsed > 0 && (
                  <p className="text-sm text-muted-foreground">
                    Used {submission.answers.hintsUsed} hints
                  </p>
                )}
            </div>
          </div>
        );

      default:
        return (
          <div className="p-3 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">
              Submission data not available
            </p>
          </div>
        );
    }
  };

  if (error) {
    toast.error("Failed to load submissions");
    return (
      <div className="text-center py-10">
        <p className="text-red-500 mb-4">Failed to load submissions</p>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      {data?.data && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Submissions
              </CardTitle>
              <Users className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.total}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Winners</CardTitle>
              <Trophy className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {data.data.filter((s) => s.isWinner).length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Pending Review
              </CardTitle>
              <Clock className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {data.data.filter((s) => !s.isWinner).length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Selected</CardTitle>
              <CheckCircle className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {selectedSubmissions.length}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filter Submissions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by user name..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange("search", e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <select
              value={filters.isWinner}
              onChange={(e) => handleFilterChange("isWinner", e.target.value)}
              className="px-3 py-2 border border-input bg-background rounded-md text-sm"
            >
              <option value="">All Submissions</option>
              <option value="true">Winners Only</option>
              <option value="false">Non-winners Only</option>
            </select>
            {(filters.search || filters.isWinner) && (
              <Button variant="outline" onClick={clearFilters}>
                Clear
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      {selectedSubmissions.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="font-medium">
                  {selectedSubmissions.length} submission
                  {selectedSubmissions.length !== 1 ? "s" : ""} selected
                </span>
              </div>
              <Button
                onClick={() => setShowWinnerDialog(true)}
                className="bg-green-600 hover:bg-green-700"
              >
                <Trophy className="h-4 w-4 mr-2" />
                Select as Winners
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Submissions Table */}
      <Card>
        <CardHeader>
          <CardTitle>Submissions</CardTitle>
          <CardDescription>
            Review and select winners for this game
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <Skeleton className="h-4 w-4" />
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
              ))}
            </div>
          ) : data?.data && data.data.length > 0 ? (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox
                        checked={
                          selectedSubmissions.length === data.data.length &&
                          data.data.length > 0
                        }
                        onCheckedChange={handleSelectAll}
                      />
                    </TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Submission</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Submitted</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.data.map((submission) => (
                    <TableRow key={submission.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedSubmissions.includes(submission.id)}
                          onCheckedChange={(checked) =>
                            handleSelectSubmission(
                              submission.id,
                              checked as boolean
                            )
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage
                              src={submission.user?.image || ""}
                              alt={submission.user?.name || "User"}
                            />
                            <AvatarFallback className="bg-[#800000] text-white">
                              {submission.user?.name
                                ? getInitials(submission.user.name)
                                : "U"}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">
                              {submission.user?.name || "Unknown User"}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              @
                              {submission.user?.displayUsername ||
                                submission.user?.username ||
                                "user"}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-md">
                        {renderSubmissionContent(submission)}
                      </TableCell>
                      <TableCell>
                        {submission.isWinner ? (
                          <Badge className="bg-green-100 text-green-800 flex items-center gap-1 w-fit">
                            <Trophy className="h-3 w-3" />
                            Winner
                          </Badge>
                        ) : (
                          <Badge variant="secondary">Pending</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          {new Date(
                            submission.submittedAt
                          ).toLocaleDateString()}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

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
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-lg font-semibold mb-2">
                No submissions found
              </h3>
              <p className="text-muted-foreground">
                No one has submitted entries for this game yet.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Winner Selection Dialog */}
      <AlertDialog open={showWinnerDialog} onOpenChange={setShowWinnerDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Select Winners</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to select {selectedSubmissions.length}{" "}
              submission{selectedSubmissions.length !== 1 ? "s" : ""} as winner
              {selectedSubmissions.length !== 1 ? "s" : ""}? This will award
              them badges, points, and other configured rewards.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => selectWinnersMutation.mutate(selectedSubmissions)}
              disabled={selectWinnersMutation.isPending}
              className="bg-green-600 hover:bg-green-700"
            >
              {selectWinnersMutation.isPending
                ? "Selecting..."
                : "Select Winners"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
