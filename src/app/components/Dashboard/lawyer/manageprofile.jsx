"use client";
import React, { useState, useEffect } from "react";
import { Save, Plus, Edit2 } from "lucide-react";
import { LawyerProfile } from "@/lib/actions/lawyer";
import toast from "react-hot-toast";
import { useSession } from "@/lib/auth-client";
import EditLawyerForm from "./editinfopage";

const ManageProfile = () => {
  const { data, ispanding } = useSession();
  const user = data?.user;

  const [isEditing, setIsEditing] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    specialization: "",
    bio: "",
    hourlyFee: "",
    currency: "USD",
    profileImg: "",
  });

  useEffect(() => {
    if (user?.email) {
      setFormData((prev) => ({
        ...prev,
        email: user.email,
      }));
    }
  }, [user]);

  const [isSubmitting, setIsSubmitting] = useState(false);

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
    formData.hourlyFee.trim() !== "" &&
    formData.profileImg.trim() !== "";

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      toast.error("You must be logged in to create a legal profile.");
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
        setFormData({
          name: "",
          email: user.email || "",
          specialization: "",
          bio: "",
          hourlyFee: "",
          currency: "USD",
          profileImg: "",
        });
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while creating the profile.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render the extracted modular form view conditionally
  if (isEditing) {
    return <EditLawyerForm initialData={formData} onCancel={() => setIsEditing(false)} />;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-serif text-[#FCBA80] tracking-wide">
            Create Legal Profile
          </h2>
          <p className="text-xs text-gray-400 mt-1 font-light">
            Enter your professional credentials and public-facing information.
          </p>
        </div>
        
        <button
          type="button"
          onClick={() => setIsEditing(true)}
          className="border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800 text-xs font-mono text-gray-300 px-3 py-1.5 flex items-center gap-1.5 transition-all"
        >
          <Edit2 size={12} /> Edit Information
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2 border border-[#131B2E] bg-[#090D1A]/40 p-6 space-y-5 relative">
          <div className="flex justify-between items-center border-b border-[#131B2E] pb-3">
            <h3 className="text-sm font-mono uppercase tracking-wider text-[#FCBA80]">
              Professional Information
            </h3>
            <span className="text-[9px] font-mono tracking-widest text-gray-400 border border-zinc-800 px-1.5 py-0.5 bg-zinc-800/40">
              {isSubmitting ? "SAVING..." : "NEW PROFILE"}
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
                placeholder="e.g. Jane Doe, Esq."
                value={formData.name}
                onChange={handleInputChange}
                className="w-full bg-[#0A0F1D] border border-[#131B2E] px-3 py-2 text-xs text-gray-200 focus:outline-none focus:border-[#FCBA80]/40 placeholder-gray-600"
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
                placeholder="janedoe@lexvizo.com"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full bg-[#0A0F1D] border border-[#131B2E] px-3 py-2 text-xs text-gray-200 focus:outline-none focus:border-[#FCBA80]/40 placeholder-gray-600 opacity-80"
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
                value={formData.specialization}
                onChange={handleInputChange}
                className="w-full bg-[#0A0F1D] border border-[#131B2E] px-3 py-2 text-xs text-gray-200 focus:outline-none focus:border-[#FCBA80]/40 appearance-none rounded-none text-gray-300"
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
                value={formData.currency}
                onChange={handleInputChange}
                className="w-full bg-[#0A0F1D] border border-[#131B2E] px-3 py-2 text-xs text-gray-200 focus:outline-none focus:border-[#FCBA80]/40 appearance-none rounded-none text-gray-300 font-mono"
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
                placeholder="0.00"
                value={formData.hourlyFee}
                onChange={handleInputChange}
                className="w-full bg-[#0A0F1D] border border-[#131B2E] px-3 py-2 text-xs text-gray-200 font-mono focus:outline-none focus:border-[#FCBA80]/40 placeholder-gray-600"
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
              placeholder="Describe your legal experience, notable cases, or expertise..."
              value={formData.bio}
              onChange={handleInputChange}
              className="w-full bg-[#0A0F1D] border border-[#131B2E] px-3 py-2 text-xs text-gray-300 focus:outline-none focus:border-[#FCBA80]/40 resize-none placeholder-gray-600"
            />
          </div>

          <div className="pt-2 flex items-center justify-between gap-4">
            <div className="text-[10px] font-mono text-gray-500">
              Registration Year: <span className="text-gray-400">2026</span>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !isFormComplete || ispanding || !user}
              className="bg-[#FCBA80] text-black hover:bg-[#E2A76F] disabled:bg-gray-700 disabled:text-gray-400 disabled:cursor-not-allowed px-5 py-2 text-xs font-mono tracking-wider font-bold flex items-center gap-2 transition-all"
            >
              <Save size={14} />
              {!user 
                ? "Sign-In Required" 
                : !isFormComplete
                  ? "Fields Incomplete"
                  : isSubmitting
                    ? "Creating..."
                    : "Save Profile"}
            </button>
          </div>
        </div>

        <div className="space-y-6">
          <div className="border border-[#131B2E] bg-[#090D1A]/40 p-6 flex flex-col items-center text-center space-y-4">
            <h3 className="w-full text-left text-sm font-mono uppercase tracking-wider text-[#FCBA80] border-b border-[#131B2E] pb-3">
              Profile Image *
            </h3>

            <div className="p-4 border border-dashed border-[#131B2E] w-full flex flex-col items-center justify-center bg-[#050811] transition-all">
              <div className="w-28 h-32 bg-zinc-900 border border-zinc-800 relative overflow-hidden flex items-center justify-center text-zinc-600">
                {formData.profileImg ? (
                  <img
                    src={formData.profileImg}
                    alt="Preview"
                    className="w-full h-full object-cover object-top"
                    onError={(e) => {
                      e.currentTarget.src =
                        "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=200";
                    }}
                  />
                ) : (
                  <div className="text-[9px] uppercase font-mono p-2 text-center text-amber-500/80 animate-pulse">
                    Image Link Missing
                  </div>
                )}
              </div>

              <div className="w-full mt-4 pt-3 border-t border-[#131B2E]/60 space-y-2">
                <label className="block text-left text-[8px] font-mono uppercase tracking-widest text-gray-400">
                  Direct Image Link *
                </label>
                <input
                  type="url"
                  name="profileImg"
                  required
                  value={formData.profileImg}
                  onChange={handleInputChange}
                  placeholder="https://example.com/your-photo.jpg"
                  className="w-full bg-[#0A0F1D] border border-[#131B2E] px-2 py-1.5 text-[11px] text-gray-200 font-mono focus:outline-none focus:border-[#FCBA80]/50 placeholder-gray-700 transition-colors"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border border-[#131B2E] bg-[#090D1A]/40 p-6">
        <div className="flex justify-between items-center border-b border-[#131B2E] pb-4 mb-4">
          <div>
            <h3 className="text-sm font-serif text-[#FCBA80] tracking-wide">
              Service Catalogue
            </h3>
            <p className="text-[11px] text-gray-400 font-light mt-0.5">
              Define and manage the specific legal services you offer to clients.
            </p>
          </div>
          <button
            type="button"
            className="bg-transparent border border-[#131B2E] text-xs font-mono uppercase text-[#FCBA80] tracking-widest px-4 py-2 hover:bg-[#0E1526] transition-all flex items-center gap-1.5"
          >
            <Plus size={14} /> Add Service
          </button>
        </div>
        <div className="overflow-x-auto text-gray-400 text-xs italic p-2">
          Your service variants catalogue will appear here once your account details save cleanly.
        </div>
      </div>
    </form>
  );
};

export default ManageProfile;