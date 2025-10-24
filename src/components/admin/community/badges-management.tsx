"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getBadgesForAdmin,
  createBadge,
  updateBadge,
  deleteBadge,
} from "@/actions/admin/games";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Plus,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  Trophy,
  Star,
  Users,
  Award,
} from "lucide-react";
import { toast } from "sonner";

interface BadgeData {
  id: string;
  name: string;
  description: string;
  icon: string;
  type: "game_winner" | "participation" | "streak" | "milestone";
  rarity: "common" | "rare" | "epic" | "legendary";
  createdAt: Date;
  usageCount: number;
}

export default function BadgesManagement() {
  const [filters, setFilters] = useState({
    search: "",
    type: "",
    rarity: "",
    page: 1,
  });
  const [deleteBadgeId, setDeleteBadgeId] = useState<string | null>(null);
  const [editingBadge, setEditingBadge] = useState<BadgeData | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["admin-badges", filters],
    queryFn: () =>
      getBadgesForAdmin({
        page: filters.page,
        limit: 20,
        type: filters.type as "game_winner" | "participation" | "streak" | "milestone",
        rarity: filters.rarity as "common" | "rare" | "epic" | "legendary",
        search: filters.search || undefined,
      }),
  });

  const createMutation = useMutation({
    mutationFn: (badgeData: { name: string; description: string; icon: string; type: "game_winner" | "participation" | "streak" | "milestone"; rarity: "common" | "rare" | "epic" | "legendary"; }) => createBadge(badgeData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-badges"] });
      setShowCreateDialog(false);
      toast.success("Badge created successfully");
    },
    onError: () => {
      toast.error("Failed to create badge");
    },
  });

  const updateMutation = useMutation({
    mutationFn: (badgeData: { name: string; description: string; icon: string; type: "game_winner" | "participation" | "streak" | "milestone"; rarity: "common" | "rare" | "epic" | "legendary"; }) =>
      updateBadge({ badgeId: editingBadge!.id, ...badgeData }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-badges"] });
      setEditingBadge(null);
      toast.success("Badge updated successfully");
    },
    onError: () => {
      toast.error("Failed to update badge");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (badgeId: string) => deleteBadge({ badgeId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-badges"] });
      setDeleteBadgeId(null);
      toast.success("Badge deleted successfully");
    },
    onError: () => {
      toast.error("Failed to delete badge");
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
      type: "",
      rarity: "",
      page: 1,
    });
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "common":
        return "bg-gray-100 text-gray-800";
      case "rare":
        return "bg-blue-100 text-blue-800";
      case "epic":
        return "bg-purple-100 text-purple-800";
      case "legendary":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "game_winner":
        return <Trophy className="h-4 w-4" />;
      case "participation":
        return <Users className="h-4 w-4" />;
      case "streak":
        return <Star className="h-4 w-4" />;
      case "milestone":
        return <Award className="h-4 w-4" />;
      default:
        return <Trophy className="h-4 w-4" />;
    }
  };

  if (error) {
    toast.error("Failed to load badges");
    return (
      <div className="text-center py-10">
        <p className="text-red-500 mb-4">Failed to load badges</p>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Button onClick={() => setShowCreateDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Badge
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      {data?.data && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Badges
              </CardTitle>
              <Trophy className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.total}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Common</CardTitle>
              <span className="text-2xl">🥉</span>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {
                  data.data.filter((b: BadgeData) => b.rarity === "common")
                    .length
                }
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rare</CardTitle>
              <span className="text-2xl">🥈</span>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {data.data.filter((b: BadgeData) => b.rarity === "rare").length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Epic/Legendary
              </CardTitle>
              <span className="text-2xl">🥇</span>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {
                  data.data.filter(
                    (b: BadgeData) =>
                      b.rarity === "epic" || b.rarity === "legendary"
                  ).length
                }
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filter Badges</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search badges..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange("search", e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select
              value={filters.type}
              onValueChange={(value) => handleFilterChange("type", value)}
            >
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Types</SelectItem>
                <SelectItem value="game_winner">Game Winner</SelectItem>
                <SelectItem value="participation">Participation</SelectItem>
                <SelectItem value="streak">Streak</SelectItem>
                <SelectItem value="milestone">Milestone</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={filters.rarity}
              onValueChange={(value) => handleFilterChange("rarity", value)}
            >
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="All Rarities" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Rarities</SelectItem>
                <SelectItem value="common">Common</SelectItem>
                <SelectItem value="rare">Rare</SelectItem>
                <SelectItem value="epic">Epic</SelectItem>
                <SelectItem value="legendary">Legendary</SelectItem>
              </SelectContent>
            </Select>
            {(filters.search || filters.type || filters.rarity) && (
              <Button variant="outline" onClick={clearFilters}>
                Clear
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Badges Table */}
      <Card>
        <CardHeader>
          <CardTitle>Badges</CardTitle>
          <CardDescription>Manage all available badges</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <Skeleton className="h-8 w-8" />
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
                    <TableHead>Badge</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Rarity</TableHead>
                    <TableHead>Usage</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="w-12"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.data.map((badge: BadgeData) => (
                    <TableRow key={badge.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="text-2xl">{badge.icon}</div>
                          <div>
                            <div className="font-medium">{badge.name}</div>
                            <div className="text-sm text-muted-foreground line-clamp-1">
                              {badge.description}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          {getTypeIcon(badge.type)}
                          <Badge variant="outline" className="capitalize">
                            {badge.type.replace("_", " ")}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getRarityColor(badge.rarity)}>
                          {badge.rarity}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span>{badge.usageCount} users</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-muted-foreground">
                          {new Date(badge.createdAt).toLocaleDateString()}
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
                            <DropdownMenuItem
                              onClick={() => setEditingBadge(badge)}
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => setDeleteBadgeId(badge.id)}
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
              <div className="text-6xl mb-4">🏆</div>
              <h3 className="text-lg font-semibold mb-2">No badges found</h3>
              <p className="text-muted-foreground mb-4">
                {filters.search || filters.type || filters.rarity
                  ? "Try adjusting your filters to see more badges."
                  : "Get started by creating your first badge."}
              </p>
              <Button onClick={() => setShowCreateDialog(true)}>
                Create Badge
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create/Edit Badge Dialog */}
      <BadgeFormDialog
        isOpen={showCreateDialog || !!editingBadge}
        onClose={() => {
          setShowCreateDialog(false);
          setEditingBadge(null);
        }}
        badge={editingBadge}
        onSubmit={(badgeData) => {
          if (editingBadge) {
            updateMutation.mutate(badgeData);
          } else {
            createMutation.mutate(badgeData);
          }
        }}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!deleteBadgeId}
        onOpenChange={() => setDeleteBadgeId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Badge</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this badge? This action cannot be
              undone and will remove the badge from all users who have earned
              it.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() =>
                deleteBadgeId && deleteMutation.mutate(deleteBadgeId)
              }
              disabled={deleteMutation.isPending}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete Badge"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// Badge Form Dialog Component
function BadgeFormDialog({
  isOpen,
  onClose,
  badge,
  onSubmit,
  isSubmitting,
}: {
  isOpen: boolean;
  onClose: () => void;
  badge: BadgeData | null;
  onSubmit: (data: { name: string; description: string; icon: string; type: "game_winner" | "participation" | "streak" | "milestone"; rarity: "common" | "rare" | "epic" | "legendary"; }) => void;
  isSubmitting: boolean;
}) {
  const [formData, setFormData] = useState({
    name: badge?.name || "",
    description: badge?.description || "",
    icon: badge?.icon || "🏆",
    type: badge?.type || "game_winner",
    rarity: badge?.rarity || "common",
  });

  React.useEffect(() => {
    if (badge) {
      setFormData({
        name: badge.name,
        description: badge.description,
        icon: badge.icon,
        type: badge.type,
        rarity: badge.rarity,
      });
    } else {
      setFormData({
        name: "",
        description: "",
        icon: "🏆",
        type: "game_winner",
        rarity: "common",
      });
    }
  }, [badge]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{badge ? "Edit Badge" : "Create New Badge"}</DialogTitle>
          <DialogDescription>
            {badge
              ? "Update badge information"
              : "Create a new badge for users to earn"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              placeholder="Badge name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              placeholder="Badge description"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="icon">Icon *</Label>
            <Input
              id="icon"
              value={formData.icon}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, icon: e.target.value }))
              }
              placeholder="🏆"
              maxLength={2}
              required
            />
            <p className="text-xs text-muted-foreground">
              Use emoji or short text (max 2 characters)
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Type *</Label>
              <Select
                value={formData.type}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, type: value as "game_winner" | "participation" | "streak" | "milestone" }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="game_winner">Game Winner</SelectItem>
                  <SelectItem value="participation">Participation</SelectItem>
                  <SelectItem value="streak">Streak</SelectItem>
                  <SelectItem value="milestone">Milestone</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="rarity">Rarity *</Label>
              <Select
                value={formData.rarity}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, rarity: value as "common" | "rare" | "epic" | "legendary" }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="common">Common</SelectItem>
                  <SelectItem value="rare">Rare</SelectItem>
                  <SelectItem value="epic">Epic</SelectItem>
                  <SelectItem value="legendary">Legendary</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? "Saving..."
                : badge
                ? "Update Badge"
                : "Create Badge"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
