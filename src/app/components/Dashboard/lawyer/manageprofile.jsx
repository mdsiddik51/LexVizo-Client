"use client";
import React, { useState, useEffect, useRef } from "react";
import { Save, Edit2, Upload, X, User, CheckCircle } from "lucide-react";
import { LawyerProfile } from "@/lib/actions/lawyer";
import toast from "react-hot-toast";
import { useSession } from "@/lib/auth-client";
import EditLawyerForm from "./editinfopage";
import { GetLawyerData } from "@/lib/actions/api/lawyerdata";
import { ProfileImage } from "@/lib/actions/api/images"; 

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
  });

  // --- FETCH EXISTING LAWYER PROFILE OR PREPARE NEW ACCOUNT ---
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
          let verifiedImg = existingData.profileImg || existingData.imageUri || "";
          
          if (
            verifiedImg.startsWith("https:/") &&
            !verifiedImg.startsWith("https://")
          ) {
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
              hourlyFee: existingData.hourlyFee
                ? String(existingData.hourlyFee)
                : "",
              currency: existingData.currency || "USD",
              profileImg: verifiedImg,
            });
          } else {
            setHasExistingProfile(false);
            setFormData((prev) => ({
              ...prev,
              name: existingData.name || user?.name || "",
              email: existingData.email || user?.email || "",
              profileImg: verifiedImg || user?.image || "",
            }));
          }
        } else {
          if (user?.image) {
            setIsImageLocked(true);
          }
          setHasExistingProfile(false);
          setFormData((prev) => ({
            ...prev,
            name: user?.name || "",
            email: user?.email || "",
            profileImg: user?.image || "",
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
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // --- SEPARATE LOCAL IMAGE PICKER ---
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

  // --- CORE PIPELINE: ASYNC HTTP IMGBB DIRECT TO HOST CONTEXT ---
  const uploadToImgBB = async (fileBlob) => {
    const imgbbApiKey = process.env.NEXT_PUBLIC_IMG_UP_DATA;
    if (!imgbbApiKey) {
      throw new Error(
        "Application client token environment mapping variable 'NEXT_PUBLIC_IMG_UP_DATA' is missing.",
      );
    }

    const multipartPayload = new FormData();
    multipartPayload.append("image", fileBlob);

    const response = await fetch(
      `https://api.imgbb.com/1/upload?key=${imgbbApiKey}`,
      {
        method: "POST",
        body: multipartPayload,
      }
    );

    if (!response.ok) {
      throw new Error(`ImgBB connectivity fault code: ${response.status}`);
    }

    const result = await response.json();
    if (result.success && result.data?.url) {
      return result.data.url;
    } else {
      throw new Error(
        result.error?.message || "ImgBB cluster integration fault.",
      );
    }
  };

  // --- SEPARATE INDEPENDENT IMAGE UPLOAD COMMIT ROUTINE ---
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
      // Step 1: Upload directly to ImgBB hosting service
      const remoteUrl = await uploadToImgBB(selectedFile);

      // Step 2: Fixed the action reference constraint here
      let result;
      if (typeof ProfileImage === "function") {
         result = await ProfileImage({ userId: currentUserId, imageUrl: remoteUrl });
      } else {
         throw new Error("Server action connection for 'ProfileImage' is missing configuration bindings.");
      }

      // Check for structural responses (Server Actions throw errors on absolute failures)
      if (result) {
        setFormData((prev) => ({ ...prev, profileImg: remoteUrl }));
        setIsImageLocked(true);
        setSelectedFile(null);
        toast.success("Profile photo uploaded and locked into database!", {
          id: loadingToast,
        });
      } else {
        throw new Error("Database interface cluster rejected storage transaction.");
      }
    } catch (err) {
      console.error(err);
      toast.error(
        err.message || "Failed to commit image asset upload cluster pipeline.",
        { id: loadingToast },
      );
    } finally {
      setIsUploadingImage(false);
    }
  };

  const isFormComplete =
    formData.name.trim() !== "" &&
    formData.email.trim() !== "" &&
    formData.specialization !== "" &&
    formData.hourlyFee.trim() !== "";

  // --- MAIN NEW ACCOUNT PROFILE SUBMIT (WITH AUTOMATIC INLINE IMAGE UPLOAD) ---
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

      // Inline Check: Upload file if selected but not explicitly saved yet via sidebar
      if (selectedFile) {
        toast.loading("Uploading profile image asset pipeline to ImgBB...", {
          id: mainToastId,
        });
        try {
          finalImageUrl = await uploadToImgBB(selectedFile);
          
          // Fixed the binding reference logic here as well
          if (typeof ProfileImage === "function") {
             await ProfileImage({ userId: currentUserId, imageUrl: finalImageUrl });
          }

          setIsImageLocked(true);
          setSelectedFile(null);
        } catch (uploadErr) {
          console.error("Auto Image Upload Error Context:", uploadErr);
          toast.error(
            "Image upload failed. Saving profile record with a blank image placeholder...",
            { id: mainToastId },
          );
          finalImageUrl = "";
        }
      }

      toast.loading(
        "Writing profile dataset credentials directly to MongoDB...",
        { id: mainToastId },
      );

      // DATA STRUCTURING SYNCHRONIZATION
      const submissionPayload = {
        name: formData.name,
        email: formData.email,
        specialization: formData.specialization,
        bio: formData.bio,
        currency: formData.currency,
        hourlyFee: Number(formData.hourlyFee),
        profileImg: finalImageUrl, 
        userId: currentUserId,
        dateJoined: new Date().toISOString(),
      };

      const result = await LawyerProfile(submissionPayload);

      if (result && (result.acknowledged || result.success || result._id)) {
        toast.success("Lawyer Profile created and synchronized successfully!", {
          id: mainToastId,
        });
        setFormData((prev) => ({ ...prev, profileImg: finalImageUrl }));
        setHasExistingProfile(true);
      } else {
        throw new Error("Payload rejected by database interface cluster.");
      }
    } catch (error) {
      console.error(error);
      toast.error(
        "An error occurred while creating your professional account.",
        { id: mainToastId },
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const triggerFileBrowser = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Reset value assignment
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
            Enter your professional credentials to authorize and index your
            practice across the system.
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
        {/* --- LEFT HAND COMPONENT FORM PANEL --- */}
        <form
          onSubmit={handleSubmit}
          className="lg:col-span-2 border border-[#131B2E] bg-[#090D1A]/40 p-6 space-y-5 relative"
        >
          <div className="flex justify-between items-center border-b border-[#131B2E] pb-3">
            <h3 className="text-sm font-mono uppercase tracking-wider text-[#FCBA80]">
              Professional Information
            </h3>
            <span className="text-[9px] font-mono tracking-widest text-gray-400 border border-zinc-800 px-1.5 py-0.5 bg-zinc-800/40">
              {isSubmitting
                ? "SAVING..."
                : hasExistingProfile
                  ? "EXISTS"
                  : "NEW REGISTRATION"}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-[9px] font-mono uppercase tracking-widest text-gray-400">
                Full Legal Name *
              </label>
              <input
                type="text"
                name="name"
                required
                disabled={hasExistingProfile}
                placeholder="e.g. Jane Doe, Esq."
                value={formData.name}
                onChange={handleInputChange}
                className="w-full bg-[#0A0F1D] border border-[#131B2E] px-3 py-2 text-xs text-gray-200 focus:outline-none focus:border-[#FCBA80]/40 placeholder-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-[9px] font-mono uppercase tracking-widest text-gray-400">
                Professional Email Address *
              </label>
              <input
                type="email"
                name="email"
                required
                disabled={hasExistingProfile}
                placeholder="janedoe@lexvizo.com"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full bg-[#0A0F1D] border border-[#131B2E] px-3 py-2 text-xs text-gray-200 focus:outline-none focus:border-[#FCBA80]/40 placeholder-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5 sm:col-span-1">
              <label className="block text-[9px] font-mono uppercase tracking-widest text-gray-400">
                Specialization *
              </label>
              <select
                name="specialization"
                required
                disabled={hasExistingProfile}
                value={formData.specialization}
                onChange={handleInputChange}
                className="w-full bg-[#0A0F1D] border border-[#131B2E] px-3 py-2 text-xs text-gray-200 focus:outline-none focus:border-[#FCBA80]/40 appearance-none rounded-none text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="" disabled hidden>
                  Select Area
                </option>
                <option value="Corporate Law">Corporate Law</option>
                <option value="Intellectual Property">
                  Intellectual Property
                </option>
                <option value="Litigation">Litigation</option>
              </select>
            </div>

            <div className="space-y-1.5 col-span-1">
              <label className="block text-[9px] font-mono uppercase tracking-widest text-gray-400">
                Currency *
              </label>
              <select
                name="currency"
                required
                disabled={hasExistingProfile}
                value={formData.currency}
                onChange={handleInputChange}
                className="w-full bg-[#0A0F1D] border border-[#131B2E] px-3 py-2 text-xs text-gray-200 focus:outline-none focus:border-[#FCBA80]/40 appearance-none rounded-none text-gray-300 font-mono disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="USD">USD ($)</option>
                <option value="BDT">BDT (৳)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="CAD">CAD ($)</option>
              </select>
            </div>

            <div className="space-y-1.5 col-span-1">
              <label className="block text-[9px] font-mono uppercase tracking-widest text-gray-400">
                Hourly Fee *
              </label>
              <input
                type="number"
                name="hourlyFee"
                required
                disabled={hasExistingProfile}
                placeholder="0.00"
                value={formData.hourlyFee}
                onChange={handleInputChange}
                className="w-full bg-[#0A0F1D] border border-[#131B2E] px-3 py-2 text-xs text-gray-200 font-mono focus:outline-none focus:border-[#FCBA80]/40 placeholder-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-[9px] font-mono uppercase tracking-widest text-gray-400">
              Professional Bio
            </label>
            <textarea
              rows={4}
              name="bio"
              disabled={hasExistingProfile}
              placeholder="Describe your legal experience, credentials, and track record..."
              value={formData.bio}
              onChange={handleInputChange}
              className="w-full bg-[#0A0F1D] border border-[#131B2E] px-3 py-2 text-xs text-gray-300 focus:outline-none focus:border-[#FCBA80]/40 resize-none placeholder-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>

          <div className="pt-2 flex items-center justify-between gap-4">
            <div className="text-[10px] font-mono text-gray-500">
              Registration Year: <span className="text-gray-400">2026</span>
            </div>

            <button
              type="submit"
              disabled={
                isSubmitting ||
                !isFormComplete ||
                isPending ||
                !user ||
                hasExistingProfile
              }
              className="bg-[#FCBA80] text-black hover:bg-[#E2A76F] disabled:bg-gray-700 disabled:text-gray-400 disabled:cursor-not-allowed px-5 py-2 text-xs font-mono tracking-wider font-bold flex items-center gap-2 transition-all"
            >
              <Save size={14} />
              {!user
                ? "Sign-In Required"
                : hasExistingProfile
                  ? "Profile Already Active"
                  : !isFormComplete
                    ? "Fields Incomplete"
                    : isSubmitting
                      ? "Saving..."
                      : "Create Account Profile"}
            </button>
          </div>
        </form>

        {/* --- RIGHT HAND COMPONENT SIDEBAR --- */}
        <div className="space-y-6">
          <div className="border border-[#131B2E] bg-[#090D1A]/40 p-6 flex flex-col items-center text-center space-y-4">
            <h3 className="w-full text-left text-sm font-mono uppercase tracking-wider text-[#FCBA80] border-b border-[#131B2E] pb-3">
              Profile Image
            </h3>

            <div className="p-4 border border-dashed border-[#131B2E] w-full flex flex-col items-center justify-center bg-[#050811] min-h-[220px]">
              <div className="w-28 h-32 bg-zinc-900 border border-zinc-800 relative overflow-hidden flex items-center justify-center text-zinc-600 group">
                {formData.profileImg ? (
                  <>
                    <img
                      src={formData.profileImg}
                      alt="Preview"
                      className="w-full h-full object-cover object-top"
                    />
                    {!isImageLocked && (
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute top-1 right-1 bg-black/70 p-1 text-red-400 border border-zinc-800 hover:bg-black transition-colors"
                        title="Remove Image"
                      >
                        <X size={10} />
                      </button>
                    )}
                  </>
                ) : (
                  <div className="flex flex-col items-center gap-1.5 p-2 text-center">
                    <User size={24} className="text-zinc-700" />
                    <div className="text-[9px] uppercase font-mono text-zinc-500 tracking-wider">
                      No Image Found
                    </div>
                  </div>
                )}
              </div>

              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleImageChange}
                disabled={isImageLocked}
                className="hidden"
              />

              {isImageLocked ? (
                <div className="mt-4 w-full flex flex-col items-center gap-1 bg-emerald-950/10 border border-emerald-900/30 p-2.5">
                  <div className="flex items-center gap-1 text-[10px] uppercase font-mono text-emerald-400 tracking-wider">
                    <CheckCircle size={12} /> Image Registered
                  </div>
                  <div className="text-[8px] font-mono text-gray-500 leading-tight">
                    This account already contains a confirmed professional image
                    asset and cannot be overwritten.
                  </div>
                </div>
              ) : selectedFile ? (
                <div className="w-full space-y-2 mt-4">
                  <div className="text-[9px] font-mono text-amber-500 tracking-widest uppercase bg-amber-950/20 py-1 border border-amber-900/30">
                    Unsaved Preview
                  </div>
                  <button
                    type="button"
                    disabled={isUploadingImage}
                    onClick={handleStandaloneImageUpload}
                    className="w-full justify-center border border-emerald-800 bg-emerald-950/40 hover:bg-emerald-900/60 px-3 py-1.5 font-mono text-[10px] tracking-wider uppercase text-emerald-300 flex items-center gap-1.5 transition-all"
                  >
                    {isUploadingImage
                      ? "Uploading to ImgBB..."
                      : "Save Image Separately"}
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={triggerFileBrowser}
                  className="mt-4 border border-zinc-800 bg-zinc-900/40 hover:bg-zinc-800/80 px-3 py-1.5 font-mono text-[10px] tracking-wider uppercase text-gray-300 flex items-center gap-1.5 transition-all"
                >
                  <Upload size={11} /> Upload Photo
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageProfile;