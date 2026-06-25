"use client";
import React, { useState } from "react";
import ManageProfile from "@/app/components/Dashboard/lawyer/manageprofile";
import ManageServices from "@/app/components/Dashboard/lawyer/manageservices";
import { User, Briefcase } from "lucide-react";

export default function LawyerManageProfile() {
  const [subTab, setSubTab] = useState("profile");

  return (
    <div className="w-full space-y-6">
      
      {/* Title */}
      <div>
        <h2 className="text-xl font-serif text-slate-100 font-normal uppercase tracking-wide">
          Manage Practice & Services
        </h2>
        <p className="text-xs text-slate-400 font-mono mt-1">
          Configure your professional litigator details and supplemental retainer service offerings.
        </p>
      </div>

      {/* Tabs selector */}
      <div className="flex border-b border-[#111927] font-mono text-xs uppercase tracking-wider gap-4">
        <button
          onClick={() => setSubTab("profile")}
          className={`pb-3 px-1 transition-all border-b-2 ${
            subTab === "profile" 
              ? "text-[#FCBA80] border-[#FCBA80] font-bold" 
              : "text-slate-500 border-transparent hover:text-slate-300"
          } flex items-center gap-2`}
        >
          <User size={13} /> Litigator Profile
        </button>

        <button
          onClick={() => setSubTab("services")}
          className={`pb-3 px-1 transition-all border-b-2 ${
            subTab === "services" 
              ? "text-[#FCBA80] border-[#FCBA80] font-bold" 
              : "text-slate-500 border-transparent hover:text-slate-300"
          } flex items-center gap-2`}
        >
          <Briefcase size={13} /> Service Offerings
        </button>
      </div>

      {/* Tab Contents */}
      <div className="animate-fadeIn mt-4">
        {subTab === "profile" && <ManageProfile />}
        {subTab === "services" && <ManageServices />}
      </div>

    </div>
  );
}
