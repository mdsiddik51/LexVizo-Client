"use client";
import React, { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { useSession } from "@/lib/auth-client";
import { GetUserImage, ProfileImage, UpdateProfileImage } from "@/lib/actions/api/images";
import { updateUserNameAction } from "@/lib/actions/api/user";
import ManageProfileTab from "@/app/components/Dashboard/client/ManageProfileTab";

export default function UserUpdateProfile() {
  const sessionContext = useSession();
  const sessionUser = sessionContext?.data?.user || sessionContext?.user;

  const [profile, setProfile] = useState({ fullName: "", avatar: "" });
  const [isUpdating, setIsUpdating] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (sessionUser?.name) {
      setProfile((prev) => ({
        ...prev,
        fullName: sessionUser.name,
        avatar: prev.avatar || sessionUser.image || "",
      }));
    }
  }, [sessionUser?.name, sessionUser?.image]);

  useEffect(() => {
    const fetchLiveImage = async () => {
      if (sessionUser?.id) {
        try {
          const data = await GetUserImage(sessionUser.id);
          if (data && data.imageUrl) {
            setProfile((prev) => ({ ...prev, avatar: data.imageUrl }));
          }
        } catch (error) {
          console.error("Failed to fetch user image:", error);
        }
      }
    };
    fetchLiveImage();
  }, [sessionUser?.id]);

  const handleImageReupload = async (e) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file.");
      return;
    }
    if (!sessionUser?.id) {
      toast.error("User session not found. Please log in again.");
      return;
    }

    const imgbbApiKey = process.env.NEXT_PUBLIC_IMG_UP_DATA;
    setIsUploading(true);
    const toastId = toast.loading("Uploading image to asset server...");

    try {
      const uploadData = new FormData();
      uploadData.append("image", file);

      const response = await fetch(
        `https://api.imgbb.com/1/upload?key=${imgbbApiKey}`,
        {
          method: "POST",
          body: uploadData,
        },
      );
      const result = await response.json();

      if (result.success) {
        const hostedUrl = result.data.url;
        setProfile((prev) => ({ ...prev, avatar: hostedUrl }));
        toast.loading("Syncing avatar with your account profile...", {
          id: toastId,
        });

        if (sessionUser.image || profile.avatar) {
          await UpdateProfileImage({
            userId: sessionUser.id,
            imageUrl: hostedUrl,
          });
        } else {
          await ProfileImage({ userId: sessionUser.id, imageUrl: hostedUrl });
        }

        toast.success("Profile image successfully updated live!", {
          id: toastId,
        });
        if (typeof window !== "undefined") window.location.reload();
      } else {
        throw new Error("Upload failed");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to update profile image asset.", { id: toastId });
    } finally {
      setIsUploading(false);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    if (!profile.fullName.trim()) {
      toast.error("Name cannot be blank.");
      return;
    }
    if (!sessionUser?.id) {
      toast.error("Authentication required. Please log in.");
      return;
    }

    setIsUpdating(true);
    const loadingToast = toast.loading(
      "Updating your profile values in database...",
    );
    try {
      const updatedData = await updateUserNameAction(
        sessionUser.id,
        profile.fullName,
        profile.avatar,
      );
      if (updatedData) {
        setProfile({
          fullName: updatedData.fullName || profile.fullName,
          avatar: updatedData.avatar || profile.avatar,
        });
        toast.success("Profile updated successfully!", { id: loadingToast });
        if (typeof window !== "undefined") window.location.reload();
      } else {
        toast.error("Failed to update user profile on the server.", {
          id: loadingToast,
        });
      }
    } catch (error) {
      console.error("Error executing name update:", error);
      toast.error("An unexpected error occurred.", { id: loadingToast });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="w-full">
      <div className="mb-6">
        <h2 className="text-xl font-serif text-slate-100 font-normal uppercase tracking-wide">
          Manage Account profile
        </h2>
        <p className="text-xs text-slate-400 font-mono mt-1">
          Modify your personal details and display picture parameters.
        </p>
      </div>

      <ManageProfileTab
        profile={profile}
        setProfile={setProfile}
        sessionUser={sessionUser}
        isUpdating={isUpdating}
        isUploading={isUploading}
        fileInputRef={fileInputRef}
        handleProfileUpdate={handleProfileUpdate}
        handleImageReupload={handleImageReupload}
      />
    </div>
  );
}
