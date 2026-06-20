"use client";
import React, { useState, useEffect } from "react";
import { Save, Edit2 } from "lucide-react";
import { LawyerProfile } from "@/lib/actions/lawyer";
import toast from "react-hot-toast";
import { useSession } from "@/lib/auth-client";
import EditLawyerForm from "./editinfopage";
import { GetLawyerData } from "@/lib/actions/api/lawyerdata";

const ManageProfile = () => {
  const { data, ispanding } = useSession(); 
  const user = data?.user;
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [hasExistingProfile, setHasExistingProfile] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    specialization: "",
    bio: "",
    hourlyFee: "",
    currency: "USD",
    profileImg: "",
  });

  // --- FETCH EXISTING LAWYER PROFILE ---
  useEffect(() => {
    const fetchDefaultLawyerData = async () => {
      const userId = user?.id || user?._id;
      if (!userId) return;

      setIsLoadingProfile(true);
      try {
        const existingData = await GetLawyerData(userId);
        
        if (existingData && (existingData._id || existingData.email)) {
          setHasExistingProfile(true);
          setFormData({
            name: existingData.name || "",
            email: existingData.email || user.email || "",
            specialization: existingData.specialization || "",
            bio: existingData.bio || "",
            hourlyFee: existingData.hourlyFee ? String(existingData.hourlyFee) : "",
            currency: existingData.currency || "USD",
            profileImg: existingData.profileImg || "", 
          });
        } else {
          setHasExistingProfile(false); 
          setFormData((prev) => ({
            ...prev,
            email: user.email || "",
          }));
        }
      } catch (error) {
        console.error("Error retrieving profile defaults:", error);
        setHasExistingProfile(false); 
      } finally {
        setIsLoadingProfile(false);
      }
    };

    if (user) {
      fetchDefaultLawyerData();
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const isFormComplete =
    formData.name.trim() !== "" &&
    formData.email.trim() !== "" &&
    formData.specialization !== "" &&
    formData.hourlyFee.trim() !== "";

  // --- MAIN PROFILE SUBMIT ---
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
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
    try {
      const submissionPayload = {
        ...formData,
        userId: user._id || user.id,
        dateJoined: new Date().toISOString(),
      };

      const result = await LawyerProfile(submissionPayload);

      if (result?.acknowledged) {
        toast.success("Lawyer Profile created successfully!");
        setHasExistingProfile(true);
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while creating the profile.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isEditing) {
    return (
      <EditLawyerForm
        initialData={formData}
        userId={user._id || user.id}
        onCancel={() => setIsEditing(false)}
      />
    );
  }

  if (isLoadingProfile || ispanding) {
    return (
      <div className="flex items-center justify-center min-h-[200px] text-xs font-mono text-gray-400">
        Loading legal credentials profile context...
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-serif text-[#FCBA80] tracking-wide">
            Manage Legal Profile
          </h2>
          <p className="text-xs text-gray-400 mt-1 font-light">
            Enter your professional credentials and public-facing information.
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
        <div className="lg:col-span-2 border border-[#131B2E] bg-[#090D1A]/40 p-6 space-y-5 relative">
          <div className="flex justify-between items-center border-b border-[#131B2E] pb-3">
            <h3 className="text-sm font-mono uppercase tracking-wider text-[#FCBA80]">
              Professional Information
            </h3>
            <span className="text-[9px] font-mono tracking-widest text-gray-400 border border-zinc-800 px-1.5 py-0.5 bg-zinc-800/40">
              {isSubmitting ? "SAVING..." : hasExistingProfile ? "EXISTS" : "NEW PROFILE"}
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
                className="w-full bg-[#0A0F1D] border border-[#131B2E] px-3 py-2 text-xs text-gray-200 focus:outline-none focus:border-[#FCBA80]/40 placeholder-gray-600 opacity-80 disabled:opacity-50 disabled:cursor-not-allowed"
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
                <option value="" disabled hidden>Select Area</option>
                <option value="Corporate Law">Corporate Law</option>
                <option value="Intellectual Property">Intellectual Property</option>
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
              placeholder="Describe your legal experience..."
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
              disabled={isSubmitting || !isFormComplete || ispanding || !user || hasExistingProfile}
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
                      : "Save Profile"}
            </button>
          </div>
        </div>

        {/* --- SIMPLIFIED DISPLAY IMAGE BOX --- */}
        <div className="space-y-6">
          <div className="border border-[#131B2E] bg-[#090D1A]/40 p-6 flex flex-col items-center text-center space-y-4">
            <h3 className="w-full text-left text-sm font-mono uppercase tracking-wider text-[#FCBA80] border-b border-[#131B2E] pb-3">
              Profile Image
            </h3>

            <div className="p-4 border border-dashed border-[#131B2E] w-full flex flex-col items-center justify-center bg-[#050811]">
              <div className="w-28 h-32 bg-zinc-900 border border-zinc-800 relative overflow-hidden flex items-center justify-center text-zinc-600">
                {formData.profileImg ? (
                  <img
                    src={formData.profileImg}
                    alt="Preview"
                    className="w-full h-full object-cover object-top"
                  />
                ) : (
                  <div className="text-[9px] uppercase font-mono p-2 text-center text-zinc-500">
                    No Image Found
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default ManageProfile;