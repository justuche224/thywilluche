"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users, MessageSquare, Info } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { joinGroup, leaveGroup } from "@/actions/community/posts";
import { toast } from "sonner";
import Link from "next/link";
import GroupDetailModal from "./group-detail-modal";

interface GroupCardProps {
  group: {
    id: string;
    name: string;
    slug: string;
    description: string;
    type: string;
    imageUrl?: string | null;
  };
  isMember?: boolean;
  memberCount?: number;
  postCount?: number;
}

export default function GroupCard({
  group,
  isMember = false,
  memberCount = 0,
  postCount = 0,
}: GroupCardProps) {
  const [isJoining, setIsJoining] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const queryClient = useQueryClient();

  const joinGroupMutation = useMutation({
    mutationFn: joinGroup,
    onSuccess: (result) => {
      if (result.success) {
        toast.success(result.message);
        queryClient.invalidateQueries({ queryKey: ["user-group-memberships"] });
        queryClient.invalidateQueries({ queryKey: ["active-groups"] });
      } else {
        toast.error(result.message);
      }
      setIsJoining(false);
    },
    onError: () => {
      toast.error("Failed to join group");
      setIsJoining(false);
    },
  });

  const leaveGroupMutation = useMutation({
    mutationFn: leaveGroup,
    onSuccess: (result) => {
      if (result.success) {
        toast.success(result.message);
        queryClient.invalidateQueries({ queryKey: ["user-group-memberships"] });
        queryClient.invalidateQueries({ queryKey: ["active-groups"] });
      } else {
        toast.error(result.message);
      }
      setIsJoining(false);
    },
    onError: () => {
      toast.error("Failed to leave group");
      setIsJoining(false);
    },
  });

  const handleJoinLeave = async () => {
    setIsJoining(true);
    if (isMember) {
      leaveGroupMutation.mutate(group.id);
    } else {
      joinGroupMutation.mutate(group.id);
    }
  };

  return (
    <>
      <Card className="h-full flex flex-col hover:shadow-lg transition-shadow">
        <CardHeader className="pb-4">
          <div className="flex items-start gap-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src={group.imageUrl || undefined} alt={group.name} />
              <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                {group.name.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <CardTitle className="text-lg line-clamp-1">
                {group.name}
              </CardTitle>
              <CardDescription className="line-clamp-2 mt-1">
                {group.description}
              </CardDescription>
            </div>
          </div>
          <Badge variant="secondary" className="w-fit">
            {group.type}
          </Badge>
        </CardHeader>

        <CardContent className="flex-1 pb-4">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>{memberCount} members</span>
            </div>
            <div className="flex items-center gap-1">
              <MessageSquare className="h-4 w-4" />
              <span>{postCount} posts</span>
            </div>
          </div>
        </CardContent>

        <CardFooter className="pt-0 gap-2">
          <Button
            variant={isMember ? "outline" : "default"}
            onClick={handleJoinLeave}
            disabled={isJoining}
            className="flex-1"
          >
            {isJoining
              ? "Processing..."
              : isMember
              ? "Leave Group"
              : "Join Group"}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowDetailModal(true)}
          >
            <Info className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link href={`/community/home?group=${group.id}`}>View Posts</Link>
          </Button>
        </CardFooter>
      </Card>

      <GroupDetailModal
        group={group}
        isMember={isMember}
        memberCount={memberCount}
        postCount={postCount}
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
      />
    </>
  );
}
