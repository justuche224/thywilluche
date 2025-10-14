"use client";

import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Grid, List } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import {
  getActiveGroups,
  getUserGroupMemberships,
} from "@/actions/community/posts";
import GroupCard from "./group-card";

type ViewMode = "grid" | "list";
type SortBy = "name" | "type" | "members" | "posts";

interface Group {
  id: string;
  name: string;
  slug: string;
  description: string;
  type: string;
  imageUrl?: string | null;
  memberCount?: number;
  postCount?: number;
}

interface GroupMembership {
  id: string;
  groupId: string;
  joinedAt: Date;
  isActive: boolean;
  group: Group;
}

export default function GroupsListing() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [sortBy, setSortBy] = useState<SortBy>("name");

  const { data: groupsData, isLoading: groupsLoading } = useQuery({
    queryKey: ["active-groups"],
    queryFn: getActiveGroups,
  });

  const { data: membershipsData, isLoading: membershipsLoading } = useQuery({
    queryKey: ["user-group-memberships"],
    queryFn: () => getUserGroupMemberships(),
  });

  const groups = useMemo(() => groupsData?.data || [], [groupsData?.data]);
  const memberships = useMemo(
    () => membershipsData?.data || [],
    [membershipsData?.data]
  );
  const userGroupIds = useMemo(
    () => new Set(memberships.map((m: GroupMembership) => m.groupId)),
    [memberships]
  );

  const uniqueTypes = useMemo(() => {
    const types = [...new Set(groups.map((group: Group) => group.type))];
    return types.sort();
  }, [groups]);

  const filteredAndSortedGroups = useMemo(() => {
    const filtered = groups.filter((group: Group) => {
      const matchesSearch =
        group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        group.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = selectedType === "all" || group.type === selectedType;
      return matchesSearch && matchesType;
    });

    return filtered.sort((a: Group, b: Group) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "type":
          return a.type.localeCompare(b.type);
        case "members":
          return (b.memberCount || 0) - (a.memberCount || 0);
        case "posts":
          return (b.postCount || 0) - (a.postCount || 0);
        default:
          return 0;
      }
    });
  }, [groups, searchQuery, selectedType, sortBy]);

  const isMember = (groupId: string) => userGroupIds.has(groupId);

  if (groupsLoading || membershipsLoading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-24" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-64" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search groups..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={selectedType} onValueChange={setSelectedType}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {uniqueTypes.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={sortBy}
          onValueChange={(value) => setSortBy(value as SortBy)}
        >
          <SelectTrigger className="w-full sm:w-32">
            <SelectValue placeholder="Sort" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name">Name</SelectItem>
            <SelectItem value="type">Type</SelectItem>
            <SelectItem value="members">Members</SelectItem>
            <SelectItem value="posts">Posts</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex gap-1">
          <Button
            variant={viewMode === "grid" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("grid")}
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("list")}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {filteredAndSortedGroups.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-muted-foreground">
            {searchQuery || selectedType !== "all" ? (
              <p>No groups found matching your criteria.</p>
            ) : (
              <p>No groups available at the moment.</p>
            )}
          </div>
        </div>
      ) : (
        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              : "space-y-4"
          }
        >
          {filteredAndSortedGroups.map((group: Group) => (
            <GroupCard
              key={group.id}
              group={group}
              isMember={isMember(group.id)}
              memberCount={group.memberCount || 0}
              postCount={group.postCount || 0}
            />
          ))}
        </div>
      )}
    </div>
  );
}
