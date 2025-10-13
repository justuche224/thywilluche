"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import {
  getGroupsForAdmin,
  createGroup,
  updateGroup,
  deleteGroup,
} from "@/actions/admin/community";
import {
  Plus,
  Edit,
  Trash2,
  Users,
  FileText,
  Calendar,
  Hash,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { Breadcrumb } from "@/components/admin/breadcrumb";
import { HelpTooltip } from "@/components/admin/help-tooltip";

interface Group {
  id: string;
  name: string;
  slug: string;
  type: string;
  description: string | null;
  isActive: boolean;
  createdAt: Date;
  postCount: number;
  memberCount: number;
}

interface GroupFormData {
  name: string;
  slug: string;
  type: string;
  description: string;
  isActive: boolean;
}

export function GroupsManagement() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<Group | null>(null);
  const [formData, setFormData] = useState<GroupFormData>({
    name: "",
    slug: "",
    type: "",
    description: "",
    isActive: true,
  });
  const queryClient = useQueryClient();

  const {
    data: groupsData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["admin-groups"],
    queryFn: getGroupsForAdmin,
  });

  const createGroupMutation = useMutation({
    mutationFn: createGroup,
    onSuccess: (data) => {
      if (data.success) {
        toast.success(data.message);
        setIsCreateDialogOpen(false);
        resetForm();
        queryClient.invalidateQueries({ queryKey: ["admin-groups"] });
      } else {
        toast.error(data.message);
      }
    },
    onError: () => {
      toast.error("Failed to create group");
    },
  });

  const updateGroupMutation = useMutation({
    mutationFn: updateGroup,
    onSuccess: (data) => {
      if (data.success) {
        toast.success(data.message);
        setEditingGroup(null);
        resetForm();
        queryClient.invalidateQueries({ queryKey: ["admin-groups"] });
      } else {
        toast.error(data.message);
      }
    },
    onError: () => {
      toast.error("Failed to update group");
    },
  });

  const deleteGroupMutation = useMutation({
    mutationFn: deleteGroup,
    onSuccess: (data) => {
      if (data.success) {
        toast.success(data.message);
        queryClient.invalidateQueries({ queryKey: ["admin-groups"] });
      } else {
        toast.error(data.message);
      }
    },
    onError: () => {
      toast.error("Failed to delete group");
    },
  });

  const resetForm = () => {
    setFormData({
      name: "",
      slug: "",
      type: "",
      description: "",
      isActive: true,
    });
  };

  const handleEdit = (group: Group) => {
    setEditingGroup(group);
    setFormData({
      name: group.name,
      slug: group.slug,
      type: group.type,
      description: group.description || "",
      isActive: group.isActive,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingGroup) {
      updateGroupMutation.mutate({
        groupId: editingGroup.id,
        ...formData,
      });
    } else {
      createGroupMutation.mutate(formData);
    }
  };

  const handleDelete = (groupId: string) => {
    deleteGroupMutation.mutate({ groupId });
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const handleNameChange = (name: string) => {
    setFormData((prev) => ({
      ...prev,
      name,
      slug: generateSlug(name),
    }));
  };

  if (error) {
    return (
      <div className="p-6">
        <p className="text-red-600">Failed to load groups</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          { label: "Community", href: "/admin/community" },
          { label: "Groups", current: true },
        ]}
      />

      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold">Groups Management</h1>
            <HelpTooltip content="Create and manage discussion groups for your community. Groups help organize posts by topics like Poetry, Lifestyle, etc." />
          </div>
          <p className="text-muted-foreground">
            Create and manage community groups
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>
              <Plus className="w-4 h-4 mr-2" />
              Create Group
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create New Group</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Group Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="Enter group name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">Slug</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, slug: e.target.value }))
                  }
                  placeholder="group-slug"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Type</Label>
                <Input
                  id="type"
                  value={formData.type}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, type: e.target.value }))
                  }
                  placeholder="e.g., Poetry, Lifestyle, Coaching"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  placeholder="Enter group description"
                  rows={3}
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      isActive: e.target.checked,
                    }))
                  }
                />
                <Label htmlFor="isActive">Active</Label>
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsCreateDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={createGroupMutation.isPending}>
                  {createGroupMutation.isPending
                    ? "Creating..."
                    : "Create Group"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Groups List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          [...Array(6)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-6 w-[150px]" />
                    <Skeleton className="h-6 w-[60px]" />
                  </div>
                  <Skeleton className="h-4 w-[100px]" />
                  <Skeleton className="h-16 w-full" />
                  <div className="flex justify-between">
                    <div className="flex gap-4">
                      <Skeleton className="h-4 w-[60px]" />
                      <Skeleton className="h-4 w-[60px]" />
                    </div>
                    <div className="flex gap-2">
                      <Skeleton className="h-8 w-8" />
                      <Skeleton className="h-8 w-8" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : groupsData?.data && groupsData.data.length > 0 ? (
          groupsData.data.map((group) => (
            <Card key={group.id}>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{group.name}</h3>
                        {group.isActive ? (
                          <Badge
                            variant="secondary"
                            className="bg-green-100 text-green-800"
                          >
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Active
                          </Badge>
                        ) : (
                          <Badge
                            variant="secondary"
                            className="bg-red-100 text-red-800"
                          >
                            <XCircle className="w-3 h-3 mr-1" />
                            Inactive
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        #{group.slug}
                      </p>
                    </div>
                  </div>

                  {/* Type */}
                  <div className="flex items-center gap-2">
                    <Hash className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{group.type}</span>
                  </div>

                  {/* Description */}
                  {group.description && (
                    <p className="text-sm text-muted-foreground">
                      {group.description}
                    </p>
                  )}

                  {/* Stats */}
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <FileText className="w-4 h-4" />
                        <span>{group.postCount} posts</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>{group.memberCount} members</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {new Date(group.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2 border-t">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(group)}
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          size="sm"
                          variant="destructive"
                          disabled={group.postCount > 0}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently
                            delete the group &quot;{group.name}&quot;.
                            {group.postCount > 0 && (
                              <span className="block mt-2 text-red-600 font-medium">
                                Cannot delete group with existing posts.
                              </span>
                            )}
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(group.id)}
                            disabled={group.postCount > 0}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="col-span-full">
            <CardContent className="p-6 text-center">
              <p className="text-muted-foreground">No groups found</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editingGroup} onOpenChange={() => setEditingGroup(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Group</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Group Name</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-slug">Slug</Label>
              <Input
                id="edit-slug"
                value={formData.slug}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, slug: e.target.value }))
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-type">Type</Label>
              <Input
                id="edit-type"
                value={formData.type}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, type: e.target.value }))
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                rows={3}
              />
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="edit-isActive"
                checked={formData.isActive}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    isActive: e.target.checked,
                  }))
                }
              />
              <Label htmlFor="edit-isActive">Active</Label>
            </div>
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditingGroup(null)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={updateGroupMutation.isPending}>
                {updateGroupMutation.isPending ? "Updating..." : "Update Group"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
