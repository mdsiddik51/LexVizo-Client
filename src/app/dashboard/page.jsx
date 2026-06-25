"use client";
import React, { useState, useEffect, useMemo } from "react";
import { useSession } from "@/lib/auth-client";
import { GetUserImage } from "@/lib/actions/api/images";
import { useRouter } from "next/navigation";
import { User, Mail, Shield, Calendar, Edit3, ArrowRight, Gavel, Briefcase } from "lucide-react";

export default function DashboardHome() {
  const router = useRouter();
  const sessionContext = useSession();
  const sessionUser = sessionContext?.data?.user || sessionContext?.user;

  const [profileImgUrl, setProfileImgUrl] = useState("");
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const fetchAvatar = async () => {
      const targetId = sessionUser?.id || sessionUser?._id;
      if (!targetId) return;
      try {
        const response = await GetUserImage(targetId);
        if (response?.imageUrl) {
          setProfileImgUrl(response.imageUrl);
        }
      } catch (err) {
        console.error("Failed fetching home avatar:", err);
      }
    };
    fetchAvatar();
  }, [sessionUser]);

  const userRole = useMemo(() => {
    if (!sessionUser?.role) return "";
    const roleLower = sessionUser.role.toLowerCase();
    if (roleLower === "client") return "user";
    return roleLower;
  }, [sessionUser]);

  const getInitials = (name) => {
    if (!name) return "??";
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const avatarSrc = profileImgUrl || sessionUser?.image;
  const showInitials = !avatarSrc || imageError;

  return (
    <div className="space-y-8 animate-fadeIn max-w-4xl">
      
      {/* Title block */}
      <div>
        <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">
          Console &gt; <span className="text-[#FCBA80]">Account Profile</span>
        </div>
        <h2 className="text-2xl lg:text-3xl font-serif text-slate-100 mt-2 font-normal tracking-wide uppercase">
          Profile Dossier
        </h2>
      </div>

      {/* Main card */}
      <div className="bg-[#050a12] border border-[#111927] p-8 grid grid-cols-1 md:grid-cols-12 gap-8 items-center relative overflow-hidden">
        
        {/* Decorative corner borders */}
        <div className="absolute top-0 left-0 w-3 h-px bg-slate-800" />
        <div className="absolute top-0 left-0 w-px h-3 bg-slate-800" />
        <div className="absolute bottom-0 right-0 w-3 h-px bg-slate-800" />
        <div className="absolute bottom-0 right-0 w-px h-3 bg-slate-800" />

        {/* Profile Avatar */}
        <div className="md:col-span-4 flex flex-col items-center justify-center border-r border-[#111927]/60 pr-0 md:pr-8">
          <div className="w-32 h-36 bg-zinc-900 border border-zinc-800 overflow-hidden flex items-center justify-center relative group">
            {showInitials ? (
              <span className="text-3xl font-mono font-bold text-[#FCBA80]">{getInitials(sessionUser?.name)}</span>
            ) : (
              <img
                src={avatarSrc}
                alt="user-avatar"
                className="w-full h-full object-cover object-top"
                onError={() => setImageError(true)}
              />
            )}
          </div>
          <span className="text-[10px] font-mono text-slate-500 uppercase mt-4 tracking-widest">
            Profile Photo
          </span>
        </div>

        {/* Profile Details */}
        <div className="md:col-span-8 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-1">
              <span className="text-[9px] font-mono uppercase text-slate-500 tracking-wider flex items-center gap-1.5">
                <User size={10} className="text-[#FCBA80]" /> Full Name
              </span>
              <p className="text-sm font-semibold text-slate-200">{sessionUser?.name || "N/A"}</p>
            </div>

            <div className="space-y-1">
              <span className="text-[9px] font-mono uppercase text-slate-500 tracking-wider flex items-center gap-1.5">
                <Mail size={10} className="text-[#FCBA80]" /> Email Address
              </span>
              <p className="text-sm font-mono text-slate-300 truncate">{sessionUser?.email || "N/A"}</p>
            </div>

            <div className="space-y-1">
              <span className="text-[9px] font-mono uppercase text-slate-500 tracking-wider flex items-center gap-1.5">
                <Shield size={10} className="text-[#FCBA80]" /> Privileges & Role
              </span>
              <p className="text-sm font-mono uppercase text-[#FCBA80] font-bold tracking-wider">
                {sessionUser?.role || "USER"}
              </p>
            </div>

            <div className="space-y-1">
              <span className="text-[9px] font-mono uppercase text-slate-500 tracking-wider flex items-center gap-1.5">
                <Calendar size={10} className="text-[#FCBA80]" /> Account Created
              </span>
              <p className="text-sm font-sans text-slate-300">
                {sessionUser?.createdAt ? new Date(sessionUser.createdAt).toLocaleDateString('en-US', {
                  month: 'long', day: 'numeric', year: 'numeric'
                }) : "June 23, 2026"}
              </p>
            </div>
          </div>

          {/* Role specific Actions row */}
          <div className="pt-6 border-t border-[#111927]/60 flex flex-wrap gap-4">
            {userRole === "user" && (
              <button
                onClick={() => router.push("/dashboard/user/update-profile")}
                className="group flex items-center gap-2 bg-[#FCBA80] text-black px-5 py-2.5 font-mono text-xs uppercase font-bold tracking-widest hover:bg-white transition-colors"
              >
                Update Profile <Edit3 size={12} />
              </button>
            )}

            {userRole === "lawyer" && (
              <button
                onClick={() => router.push("/dashboard/lawyer/manage-legal-profile")}
                className="group flex items-center gap-2 bg-[#FCBA80] text-black px-5 py-2.5 font-mono text-xs uppercase font-bold tracking-widest hover:bg-white transition-colors"
              >
                Manage Services <Briefcase size={12} />
              </button>
            )}

            {userRole === "admin" && (
              <button
                onClick={() => router.push("/dashboard/admin/manage-users")}
                className="group flex items-center gap-2 bg-[#FCBA80] text-black px-5 py-2.5 font-mono text-xs uppercase font-bold tracking-widest hover:bg-white transition-colors"
              >
                Manage Registry <ArrowRight size={12} />
              </button>
            )}

            <button
              onClick={() => router.push("/browseloyers")}
              className="flex items-center gap-2 border border-slate-800 bg-transparent text-slate-300 px-5 py-2.5 font-mono text-xs uppercase font-bold tracking-widest hover:bg-slate-900/40 hover:text-white transition-colors"
            >
              Browse Lawyers <Gavel size={12} />
            </button>
          </div>

        </div>

      </div>

      {/* Info notice box */}
      <div className="bg-[#050a12]/30 border border-[#111927]/60 p-4 font-mono text-[10px] text-slate-500 leading-relaxed uppercase tracking-wider">
        // SECURITY NOTICE: This user profile environment is strictly protected. Keep your private credential vectors secure. Actions made are recorded in the central ledger history log.
      </div>

    </div>
  );
}
