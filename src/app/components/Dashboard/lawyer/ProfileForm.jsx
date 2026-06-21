"use client";
import React from "react";
import { Save } from "lucide-react";
import { ProfileStatus } from "./ProfileStatus";


export const ProfileForm = ({
  formData,
  hasExistingProfile,
  isSubmitting,
  isFormComplete,
  user,
  isPending,
  handleInputChange,
  handleSubmit,
}) => {
  return (
    <form
      onSubmit={handleSubmit}
      className="lg:col-span-2 border border-[#131B2E] bg-[#090D1A]/40 p-6 space-y-5 relative"
    >
      <div className="flex justify-between items-center border-b border-[#131B2E] pb-3">
        <h3 className="text-sm font-mono uppercase tracking-wider text-[#FCBA80]">
          Professional Information
        </h3>
        <span className="text-[9px] font-mono tracking-widest text-gray-400 border border-zinc-800 px-1.5 py-0.5 bg-zinc-800/40">
          {isSubmitting ? "SAVING..." : hasExistingProfile ? "EXISTS" : "NEW REGISTRATION"}
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
          placeholder="Describe your legal experience, credentials, and track record..."
          value={formData.bio}
          onChange={handleInputChange}
          className="w-full bg-[#0A0F1D] border border-[#131B2E] px-3 py-2 text-xs text-gray-300 focus:outline-none focus:border-[#FCBA80]/40 resize-none placeholder-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
        />
      </div>
           <ProfileStatus
        isBusy={formData.isBusy}
        hasExistingProfile={hasExistingProfile}
        onChange={handleInputChange}
      />

      <div className="pt-2 flex items-center justify-between gap-4">
        <div className="text-[10px] font-mono text-gray-500">
          Registration Year: <span className="text-gray-400">2026</span>
        </div>

        <button
          type="submit"
          disabled={isSubmitting || !isFormComplete || isPending || !user || hasExistingProfile}
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
  );
};