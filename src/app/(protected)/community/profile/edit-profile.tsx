"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import ProfileEditForm from "@/components/community/profile/profile-edit-form";
import { getUserProfile } from "@/actions/user";
import { useRouter } from "next/navigation";

interface EditProfileProps {
  userId: string;
}

const EditProfile = ({ userId }: EditProfileProps) => {
  const [open, setOpen] = useState(false);
  const [profileData, setProfileData] = useState<{
    id: string;
    name: string;
    email: string;
    image?: string | null;
    username?: string | null;
    displayUsername?: string | null;
    bio?: string | null;
    createdAt: Date;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleOpenChange = async (newOpen: boolean) => {
    setOpen(newOpen);

    if (newOpen && !profileData) {
      setIsLoading(true);
      try {
        const result = await getUserProfile(userId);
        if (result.success && result.data) {
          setProfileData(result.data);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleSuccess = () => {
    setOpen(false);
    router.refresh();
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button>Edit Profile</Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>
            Update your profile information and preferences
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#800000] mx-auto"></div>
              <p className="mt-2 text-sm text-gray-500">Loading profile...</p>
            </div>
          </div>
        ) : profileData ? (
          <ProfileEditForm
            userId={userId}
            initialData={{
              name: profileData.name,
              email: profileData.email,
              image: profileData.image,
              username: profileData.username,
              displayUsername: profileData.displayUsername,
              bio: profileData.bio,
            }}
            onSuccess={handleSuccess}
          />
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">Failed to load profile data</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EditProfile;
