"use client";
import React, { useState, useEffect, useRef } from "react";
import { Edit2 } from "lucide-react";
import { LawyerProfile } from "@/lib/actions/lawyer";
import toast from "react-hot-toast";
import { useSession } from "@/lib/auth-client";
import EditLawyerForm from "./editinfopage";
import { GetLawyerData } from "@/lib/actions/api/lawyerdata";
import { ProfileImage } from "@/lib/actions/api/images";
import { ProfileForm } from "./ProfileForm";
import { ProfileImageUploader } from "./ProfileImageUploader";

const ManageProfile = () => {
  const { data, isPending } = useSession();
  const user = data?.user;
  const fileInputRef = useRef(null);

  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [hasExistingProfile, setHasExistingProfile] = useState(false);

  const [isImageLocked, setIsImageLocked] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    specialization: "",
    bio: "",
    hourlyFee: "",
    currency: "USD",
    profileImg: "",
    isBusy: false,
  });

  useEffect(() => {
    let isMounted = true;

    const fetchDefaultLawyerData = async () => {
      const userId = user?.id || user?._id;
      if (!userId) return;

      setIsLoadingProfile(true);
      try {
        const response = await GetLawyerData(userId);
        if (!isMounted) return;

        const existingData = Array.isArray(response) ? response[0] : response;

        if (existingData && typeof existingData === "object") {
          let verifiedImg = existingData.profileImg || existingData.imageUrl || existingData.imageUri || "";
          
          if (verifiedImg.startsWith("https:/") && !verifiedImg.startsWith("https://")) {
            verifiedImg = verifiedImg.replace("https:/", "https://");
          }

          if (verifiedImg && verifiedImg.trim() !== "") {
            setIsImageLocked(true);
          }

          if (existingData.specialization || existingData.hourlyFee) {
            setHasExistingProfile(true);
            setFormData({
              name: existingData.name || "",
              email: existingData.email || user?.email || "",
              specialization: existingData.specialization || "",
              bio: existingData.bio || "",
              hourlyFee: existingData.hourlyFee ? String(existingData.hourlyFee) : "",
              currency: existingData.currency || "USD",
              profileImg: verifiedImg,
              isBusy: existingData.isBusy ?? false,
            });
          } else {
            setHasExistingProfile(false);
            setFormData((prev) => ({
              ...prev,
              name: existingData.name || user?.name || "",
              email: existingData.email || user?.email || "",
              profileImg: verifiedImg || user?.image || "",
              isBusy: false,
            }));
          }
        } else {
          if (user?.image) setIsImageLocked(true);
          setHasExistingProfile(false);
          setFormData((prev) => ({
            ...prev,
            name: user?.name || "",
            email: user?.email || "",
            profileImg: user?.image || "",
            isBusy: false,
          }));
        }
      } catch (error) {
        console.error("Error retrieving profile defaults:", error);
        if (isMounted) {
          setHasExistingProfile(false);
          setFormData((prev) => ({
            ...prev,
            name: user?.name || "",
            email: user?.email || "",
            profileImg: user?.image || "",
            isBusy: false,
          }));
        }
      } finally {
        if (isMounted) setIsLoadingProfile(false);
      }
    };

    if (user) {
      fetchDefaultLawyerData();
    }

    return () => {
      isMounted = false;
    };
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageChange = (e) => {
    if (isImageLocked) return;

    const file = e.target.files && e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload a valid image file.");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image size must be less than 2MB.");
      return;
    }

    setSelectedFile(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev) => ({
        ...prev,
        profileImg: reader.result,
      }));
      toast.success("Image preview loaded locally.");
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    if (isImageLocked) return;
    setFormData((prev) => ({ ...prev, profileImg: "" }));
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const uploadToImgBB = async (fileBlob) => {
    const imgbbApiKey = process.env.NEXT_PUBLIC_IMG_UP_DATA;
    if (!imgbbApiKey) {
      throw new Error("Application client token environment mapping variable 'NEXT_PUBLIC_IMG_UP_DATA' is missing.");
    }

    const multipartPayload = new FormData();
    multipartPayload.append("image", fileBlob);

    const response = await fetch(`https://api.imgbb.com/1/upload?key=${imgbbApiKey}`, {
      method: "POST",
      body: multipartPayload,
    });

    if (!response.ok) {
      throw new Error(`ImgBB connectivity fault code: ${response.status}`);
    }

    const result = await response.json();
    if (result.success && result.data?.url) {
      return result.data.url;
    } else {
      throw new Error(result.error?.message || "ImgBB cluster integration fault.");
    }
  };

  const handleStandaloneImageUpload = async () => {
    const currentUserId = user?.id || user?._id;
    if (!currentUserId) {
      toast.error("User identity validation lost.");
      return;
    }

    if (!selectedFile) {
      toast.error("No raw local media file selection found to push.");
      return;
    }

    setIsUploadingImage(true);
    const loadingToast = toast.loading("Uploading picture to ImgBB cluster...");
    try {
      const remoteUrl = await uploadToImgBB(selectedFile);

      let result;
      if (typeof ProfileImage === "function") {
        result = await ProfileImage({ userId: currentUserId, imageUrl: remoteUrl });
      } else {
        throw new Error("Server action connection for 'ProfileImage' is missing configuration bindings.");
      }

      if (result) {
        setFormData((prev) => ({ ...prev, profileImg: remoteUrl }));
        setIsImageLocked(true);
        setSelectedFile(null);
        toast.success("Profile photo uploaded and locked into database!", { id: loadingToast });
      } else {
        throw new Error("Database interface cluster rejected storage transaction.");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to commit image asset upload cluster pipeline.", { id: loadingToast });
    } finally {
      setIsUploadingImage(false);
    }
  };

  const isFormComplete =
    formData.name.trim() !== "" &&
    formData.email.trim() !== "" &&
    formData.specialization !== "" &&
    formData.hourlyFee.trim() !== "";

  const handleSubmit = async (e) => {
    e.preventDefault();
    const currentUserId = user?.id || user?._id;

    if (!user || !currentUserId) {
      toast.error("You must be logged in to create a legal profile.");
      return;
    }

    if (hasExistingProfile) {
      toast.error("Profile already exists! Use 'Edit Information' instead.");
      return;
    }

    if (!isFormComplete) {
      toast.error("Please fill out all required fields.");
      return;
    }

    setIsSubmitting(true);
    const mainToastId = toast.loading("Processing profile registration...");

    try {
      let finalImageUrl = formData.profileImg;

      if (selectedFile) {
        toast.loading("Uploading profile image asset pipeline to ImgBB...", { id: mainToastId });
        try {
          finalImageUrl = await uploadToImgBB(selectedFile);
          setIsImageLocked(true);
          setSelectedFile(null);
        } catch (uploadErr) {
          console.error("Auto Image Upload Error Context:", uploadErr);
          toast.error("Image upload failed. Saving profile record with a blank image placeholder...", { id: mainToastId });
          finalImageUrl = "";
        }
      }

      toast.loading("Writing profile dataset credentials directly to MongoDB...", { id: mainToastId });

      const submissionPayload = {
        name: formData.name,
        email: formData.email,
        specialization: formData.specialization,
        bio: formData.bio,
        currency: formData.currency,
        hourlyFee: Number(formData.hourlyFee),
        profileImg: finalImageUrl,
        userId: currentUserId,
        isBusy: formData.isBusy,
        dateJoined: new Date().toISOString(),
      };

      const result = await LawyerProfile(submissionPayload);

      if (result && (result.acknowledged || result.success || result._id)) {
        toast.success("Lawyer Profile created and synchronized successfully!", { id: mainToastId });
        setFormData((prev) => ({ ...prev, profileImg: finalImageUrl }));
        setHasExistingProfile(true);
      } else {
        throw new Error("Payload rejected by database interface cluster.");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while creating your professional account.", { id: mainToastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  const triggerFileBrowser = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
      fileInputRef.current.click();
    }
  };

  if (isEditing) {
    return (
      <EditLawyerForm
        initialData={formData}
        userId={user?._id || user?.id}
        onCancel={() => setIsEditing(false)}
      />
    );
  }

  if (isLoadingProfile || isPending) {
    return (
      <div className="flex items-center justify-center min-h-[200px] text-xs font-mono text-gray-400">
        Loading credentials pipeline database context...
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-serif text-[#FCBA80] tracking-wide">
            Manage Legal Profile
          </h2>
          <p className="text-xs text-gray-400 mt-1 font-light">
            Enter your professional credentials to authorize and index your practice across the system.
          </p>
        </div>

        {hasExistingProfile && (
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800 text-xs font-mono text-gray-300 px-3 py-1.5 flex items-center gap-1.5 transition-all"
          >
            <Edit2 size={12} /> Edit Information
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <ProfileForm
          formData={formData}
          hasExistingProfile={hasExistingProfile}
          isSubmitting={isSubmitting}
          isFormComplete={isFormComplete}
          user={user}
          isPending={isPending}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
        />

        <ProfileImageUploader
          profileImg={formData.profileImg}
          isImageLocked={isImageLocked}
          selectedFile={selectedFile}
          isUploadingImage={isUploadingImage}
          fileInputRef={fileInputRef}
          handleImageChange={handleImageChange}
          removeImage={removeImage}
          handleStandaloneImageUpload={handleStandaloneImageUpload}
          triggerFileBrowser={triggerFileBrowser}
        />
      </div>
    </div>
  );
};

export default ManageProfile;