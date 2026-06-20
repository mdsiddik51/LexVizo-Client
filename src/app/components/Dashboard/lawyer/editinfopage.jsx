"use client";
import React, { useState, useRef } from "react";
import { ArrowLeft, Upload } from "lucide-react";
import toast from "react-hot-toast";
import { updateLawyerData } from "@/lib/actions/api/lawyerdata";

const EditLawyerForm = ({ initialData, userId, onCancel }) => {
  const [editData, setEditData] = useState({ ...initialData });
  const [isUpdating, setIsUpdating] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageReupload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file.");
      return;
    }

    const imgbbApiKey = process.env.NEXT_PUBLIC_IMG_UP_DATA;
    setIsUploading(true);
    const toastId = toast.loading("Uploading image...");

    try {
      const uploadData = new FormData();
      uploadData.append("image", file);

      const response = await fetch(`https://api.imgbb.com/1/upload?key=${imgbbApiKey}`, {
        method: "POST",
        body: uploadData,
      });

      const result = await response.json();

      if (result.success) {
        setEditData((prev) => ({
          ...prev,
          profileImg: result.data.url,
        }));
        toast.success("Image uploaded to preview!", { id: toastId });
      } else {
        throw new Error("Upload failed");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to upload image.", { id: toastId });
    } finally {
      setIsUploading(false);
    }
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    const activeUserId = userId || initialData?.userId || editData?.userId;

    if (!activeUserId) {
      toast.error("User context missing.");
      return;
    }

    setIsUpdating(true);
    const toastId = toast.loading("Saving updates...");
    
    try {
      const response = await updateLawyerData(activeUserId, editData);

      if (response?.acknowledged || response?.result?.acknowledged || response?.message) {
        toast.success("Profile updated successfully!", { id: toastId });
        onCancel();
      } else {
        throw new Error("Update rejected");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to save updates", { id: toastId });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <form onSubmit={handleUpdateSubmit} className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <button type="button" onClick={onCancel} className="text-gray-400 hover:text-[#FCBA80] transition-colors">
          <ArrowLeft size={18} />
        </button>
        <div>
          <h2 className="text-2xl font-serif text-[#FCBA80] tracking-wide">Edit Information</h2>
          <p className="text-xs text-gray-400 mt-1 font-light">
            Update your public profile records and professional credentials.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2 border border-[#131B2E] bg-[#090D1A]/40 p-6 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-[9px] font-mono uppercase tracking-widest text-gray-400">Full Legal Name *</label>
              <input
                type="text"
                name="name"
                required
                value={editData.name || ""}
                onChange={handleChange}
                className="w-full bg-[#0A0F1D] border border-[#131B2E] px-3 py-2 text-xs text-gray-200 focus:outline-none focus:border-[#FCBA80]/40"
              />
            </div>
            
            <div className="space-y-1.5">
              <label className="block text-[9px] font-mono uppercase tracking-widest text-gray-400">Professional Email Address *</label>
              <input
                type="email"
                name="email"
                required
                value={editData.email || ""}
                onChange={handleChange}
                className="w-full bg-[#0A0F1D] border border-[#131B2E] px-3 py-2 text-xs text-gray-200 focus:outline-none focus:border-[#FCBA80]/40"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5 col-span-1">
              <label className="block text-[9px] font-mono uppercase tracking-widest text-gray-400">Specialization *</label>
              <select
                name="specialization"
                required
                value={editData.specialization || "Corporate Law"}
                onChange={handleChange}
                className="w-full bg-[#0A0F1D] border border-[#131B2E] px-3 py-2 text-xs text-gray-200 focus:outline-none focus:border-[#FCBA80]/40 appearance-none rounded-none text-gray-300"
              >
                <option value="Corporate Law">Corporate Law</option>
                <option value="Intellectual Property">Intellectual Property</option>
                <option value="Litigation">Litigation</option>
              </select>
            </div>

            <div className="space-y-1.5 col-span-1">
              <label className="block text-[9px] font-mono uppercase tracking-widest text-gray-400">Currency *</label>
              <select
                name="currency"
                required
                value={editData.currency || "USD"}
                onChange={handleChange}
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
              <label className="block text-[9px] font-mono uppercase tracking-widest text-gray-400">Hourly Fee *</label>
              <input
                type="number"
                name="hourlyFee"
                required
                value={editData.hourlyFee || ""}
                onChange={handleChange}
                className="w-full bg-[#0A0F1D] border border-[#131B2E] px-3 py-2 text-xs text-gray-200 font-mono focus:outline-none focus:border-[#FCBA80]/40"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-[9px] font-mono uppercase tracking-widest text-gray-400">Professional Bio</label>
            <textarea
              rows={4}
              name="bio"
              value={editData.bio || ""}
              onChange={handleChange}
              className="w-full bg-[#0A0F1D] border border-[#131B2E] px-3 py-2 text-xs text-gray-300 focus:outline-none focus:border-[#FCBA80]/40 resize-none"
            />
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={isUpdating || isUploading}
              className="bg-[#FCBA80] text-black hover:bg-[#E2A76F] disabled:bg-zinc-700 disabled:text-zinc-400 disabled:cursor-not-allowed px-5 py-2 text-xs font-mono font-bold transition-all"
            >
              {isUpdating ? "Updating..." : "Update Information"}
            </button>
          </div>
        </div>

        <div className="space-y-6">
          <div className="border border-[#131B2E] bg-[#090D1A]/40 p-6 flex flex-col items-center space-y-4">
            <h3 className="w-full text-left text-sm font-mono uppercase tracking-wider text-[#FCBA80] border-b border-[#131B2E] pb-3">
              Profile Image *
            </h3>
            <div className="p-4 border border-dashed border-[#131B2E] w-full flex flex-col items-center bg-[#050811]">
              <div className="w-28 h-32 bg-zinc-900 border border-zinc-800 relative overflow-hidden flex items-center justify-center text-zinc-600 mb-4">
                {editData.profileImg ? (
                  <img src={editData.profileImg} alt="Preview" className="w-full h-full object-cover object-top" />
                ) : (
                  <div className="text-[9px] uppercase font-mono text-amber-500/80">
                    {isUploading ? "Processing..." : "Image Missing"}
                  </div>
                )}
              </div>

              <div className="w-full space-y-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageReupload}
                  accept="image/*"
                  className="hidden"
                  disabled={isUploading}
                />

                <button
                  type="button"
                  disabled={isUploading}
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full border border-zinc-800 bg-zinc-900/40 hover:bg-zinc-800/80 text-[10px] font-mono uppercase tracking-wider text-gray-300 py-2 flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Upload size={12} />
                  {isUploading ? "Uploading..." : "Change Photo Asset"}
                </button>

                <input
                  type="url"
                  name="profileImg"
                  required
                  placeholder="https://example.com/image.jpg"
                  value={editData.profileImg || ""}
                  onChange={handleChange}
                  className="w-full bg-[#0A0F1D] border border-[#131B2E] px-2 py-1.5 text-[11px] text-gray-200 font-mono focus:outline-none focus:border-[#FCBA80]/50"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default EditLawyerForm;