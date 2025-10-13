"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import Posts from "./posts";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getActiveGroups } from "@/actions/community/posts";
import { Skeleton } from "@/components/ui/skeleton";

const announcements = [
  {
    title: "Announcement 1",
    description: "My new Book is out now!",
    link: "/",
  },
  {
    title: "Announcement 2",
    description: "Read our guidelines for posting in the community. ",
    link: "/",
  },
  {
    title: "Announcement 3",
    description: "Join our next event!",
    link: "/",
  },
];

const CommunityHome = () => {
  const searchParams = useSearchParams();
  const selectedGroupId = searchParams.get("group");

  const { data: groupsData, isLoading: groupsLoading } = useQuery({
    queryKey: ["active-groups"],
    queryFn: async () => {
      const result = await getActiveGroups();
      return result;
    },
  });

  const groups = groupsData?.data || [];

  return (
    <>
      <div className=" gap-5 w-full min-h-screen flex flex-col xl:flex-row">
        <div className="w-full xl:w-3/4 2xl:w-3/4 h-full flex flex-col md:flex-row-reverse gap-5 xl:flex-row">
          <div className="w-full md:w-2/5 lg:w-1/4 flex flex-col gap-5 md:h-full p-2">
            <p className="text-2xl font-bold">Browse Groups</p>
            {groupsLoading ? (
              <div className="w-full grid grid-cols-[repeat(auto-fill,minmax(100px,1fr))] gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-10 w-full" />
                ))}
              </div>
            ) : (
              <div className="w-full grid grid-cols-[repeat(auto-fill,minmax(100px,1fr))] gap-4">
                {/* General/All Posts Button */}
                <Link href="/community/home" className="w-full">
                  <Button
                    variant={!selectedGroupId ? "default" : "outline"}
                    className="w-full"
                  >
                    <p>All Posts</p>
                  </Button>
                </Link>

                {/* Group Buttons */}
                {groups.map((group) => (
                  <Link
                    key={group.id}
                    href={`/community/home?group=${group.id}`}
                    className="w-full"
                  >
                    <Button
                      variant={
                        selectedGroupId === group.id ? "default" : "outline"
                      }
                      className="w-full"
                    >
                      <p>{group.name}</p>
                    </Button>
                  </Link>
                ))}
              </div>
            )}
          </div>
          <div className="w-full md:w-3/5 lg:w-3/4 h-full xl:border-l-2 md:border-r-2 border-[#800000]">
            <Posts groupId={selectedGroupId || undefined} />
          </div>
        </div>
        <div className="w-full xl:w-1/4 2xl:w-1/4 h-full p-2">
          <p className="text-2xl font-bold">Announcements</p>
          <div className="w-full flex flex-col gap-4">
            {announcements.map((announcement) => (
              <div
                key={announcement.title}
                className="w-full flex flex-col gap-1"
              >
                <p className="text-sm font-bold">{announcement.title}</p>
                <p className="text-sm">{announcement.description}</p>
                <Button variant="link" asChild className="w-fit">
                  <Link href={announcement.link}>
                    <p className="text-sm">Read More</p>
                  </Link>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default CommunityHome;
