"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { getUsersForAdmin, updateUserRole } from "@/actions/admin/community";
import {
  Search,
  Users,
  Shield,
  User,
  FileText,
  MessageSquare,
  Calendar,
  Crown,
} from "lucide-react";
import Image from "next/image";
import { Breadcrumb } from "@/components/admin/breadcrumb";
import { HelpTooltip } from "@/components/admin/help-tooltip";

interface User {
  id: string;
  name: string;
  username: string;
  displayUsername: string | null;
  email: string;
  image: string | null;
  role: "USER" | "ADMIN";
  createdAt: Date;
  postCount: number;
  commentCount: number;
}

export function UsersManagement() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [role, setRole] = useState<"USER" | "ADMIN" | "all">("all");
  const queryClient = useQueryClient();

  const {
    data: usersData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["admin-users", page, search, role],
    queryFn: () =>
      getUsersForAdmin({
        page,
        limit: 12,
        search: search || undefined,
        role: role === "all" ? undefined : role,
      }),
  });

  const updateRoleMutation = useMutation({
    mutationFn: updateUserRole,
    onSuccess: (data) => {
      if (data.success) {
        toast.success(data.message);
        queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      } else {
        toast.error(data.message);
      }
    },
    onError: () => {
      toast.error("Failed to update user role");
    },
  });

  const handleSearch = () => {
    setSearch(searchInput);
    setPage(1);
  };

  const handleRoleFilter = (value: string) => {
    setRole(value as typeof role);
    setPage(1);
  };

  const handleRoleUpdate = (userId: string, newRole: "USER" | "ADMIN") => {
    updateRoleMutation.mutate({ userId, role: newRole });
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "ADMIN":
        return (
          <Badge variant="secondary" className="bg-purple-100 text-purple-800">
            <Crown className="w-3 h-3 mr-1" />
            Admin
          </Badge>
        );
      case "USER":
        return (
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            <User className="w-3 h-3 mr-1" />
            User
          </Badge>
        );
      default:
        return null;
    }
  };

  if (error) {
    return (
      <div className="p-6">
        <p className="text-red-600">Failed to load users</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          { label: "Community", href: "/admin/community" },
          { label: "Users", current: true },
        ]}
      />

      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold">Users Management</h1>
            <HelpTooltip content="View and manage community members. You can promote users to admin roles or view their activity statistics." />
          </div>
          <p className="text-muted-foreground">
            View and manage community users
          </p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <CardTitle>Filters</CardTitle>
            <HelpTooltip content="Search for users by name or filter by their role (User or Admin)." />
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="flex gap-2">
                <Input
                  placeholder="Search users..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
                <Button onClick={handleSearch} size="icon">
                  <Search className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <Select value={role} onValueChange={handleRoleFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Users</SelectItem>
                <SelectItem value="USER">Users</SelectItem>
                <SelectItem value="ADMIN">Admins</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Users Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {isLoading ? (
          [...Array(8)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-[120px]" />
                      <Skeleton className="h-3 w-[80px]" />
                    </div>
                  </div>
                  <div className="flex justify-center">
                    <Skeleton className="h-6 w-[60px]" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Skeleton className="h-3 w-[60px]" />
                      <Skeleton className="h-3 w-[40px]" />
                    </div>
                    <div className="flex justify-between">
                      <Skeleton className="h-3 w-[80px]" />
                      <Skeleton className="h-3 w-[40px]" />
                    </div>
                  </div>
                  <Skeleton className="h-8 w-full" />
                </div>
              </CardContent>
            </Card>
          ))
        ) : usersData?.data && usersData.data.length > 0 ? (
          usersData.data.map((user) => (
            <Card key={user.id}>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {/* User Info */}
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      {user.image ? (
                        <Image
                          src={user.image}
                          alt={user.name}
                          width={48}
                          height={48}
                          className="rounded-full"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                          <Users className="w-6 h-6 text-gray-500" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{user.name}</p>
                      <p className="text-sm text-muted-foreground truncate">
                        @{user.displayUsername || user.username}
                      </p>
                    </div>
                  </div>

                  {/* Role Badge */}
                  <div className="flex justify-center">
                    {getRoleBadge(user.role || "USER")}
                  </div>

                  {/* Stats */}
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <FileText className="w-4 h-4 text-muted-foreground" />
                        <span>Posts</span>
                      </div>
                      <span className="font-medium">{user.postCount}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <MessageSquare className="w-4 h-4 text-muted-foreground" />
                        <span>Comments</span>
                      </div>
                      <span className="font-medium">{user.commentCount}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span>Joined</span>
                      </div>
                      <span className="font-medium">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {/* Role Change Actions */}
                  <div className="space-y-2">
                    {user.role === "USER" ? (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleRoleUpdate(user.id, "ADMIN")}
                        disabled={updateRoleMutation.isPending}
                        className="w-full"
                      >
                        <Shield className="w-4 h-4 mr-2" />
                        Make Admin
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleRoleUpdate(user.id, "USER")}
                        disabled={updateRoleMutation.isPending}
                        className="w-full"
                      >
                        <User className="w-4 h-4 mr-2" />
                        Remove Admin
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="col-span-full">
            <CardContent className="p-6 text-center">
              <p className="text-muted-foreground">No users found</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Pagination */}
      {usersData &&
        usersData?.total &&
        usersData?.limit &&
        usersData?.total > usersData?.limit && (
          <div className="flex justify-center gap-2">
            <Button
              variant="outline"
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
            >
              Previous
            </Button>
            <span className="flex items-center px-4">
              Page {page} of {Math.ceil(usersData.total / usersData.limit)}
            </span>
            <Button
              variant="outline"
              onClick={() => setPage(page + 1)}
              disabled={page >= Math.ceil(usersData.total / usersData.limit)}
            >
              Next
            </Button>
          </div>
        )}

      {/* Summary Stats */}
      {usersData && (
        <Card>
          <CardHeader>
            <CardTitle>User Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold">{usersData.total || 0}</div>
                <div className="text-sm text-muted-foreground">Total Users</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {usersData.data?.filter((u) => u.role === "ADMIN").length}
                </div>
                <div className="text-sm text-muted-foreground">Admins</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {usersData.data?.filter((u) => u.role === "USER").length}
                </div>
                <div className="text-sm text-muted-foreground">
                  Regular Users
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
