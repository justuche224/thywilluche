"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users, MessageSquare, ExternalLink } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { joinGroup, leaveGroup } from "@/actions/community/posts";
import { toast } from "sonner";
import Link from "next/link";

interface GroupDetailModalProps {
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
  isOpen: boolean;
  onClose: () => void;
}

export default function GroupDetailModal({
  group,
  isMember = false,
  memberCount = 0,
  postCount = 0,
  isOpen,
  onClose,
}: GroupDetailModalProps) {
  const [isJoining, setIsJoining] = useState(false);
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

  const handleViewPosts = () => {
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex items-start gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={group.imageUrl || undefined} alt={group.name} />
              <AvatarFallback className="bg-primary/10 text-primary font-semibold text-lg">
                {group.name.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <DialogTitle className="text-2xl">{group.name}</DialogTitle>
              <DialogDescription className="text-base mt-2">
                {group.description}
              </DialogDescription>
              <Badge variant="secondary" className="mt-2">
                {group.type}
              </Badge>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4 py-4 border-y">
            <div className="flex items-center gap-2 text-sm">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">{memberCount}</span>
              <span className="text-muted-foreground">members</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">{postCount}</span>
              <span className="text-muted-foreground">posts</span>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold">About this group</h3>
            <p className="text-muted-foreground leading-relaxed">
              {group.description}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
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
            <Button variant="ghost" asChild>
              <Link
                href={`/community/home?group=${group.id}`}
                onClick={handleViewPosts}
                className="flex items-center gap-2"
              >
                <ExternalLink className="h-4 w-4" />
                View Posts
              </Link>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
