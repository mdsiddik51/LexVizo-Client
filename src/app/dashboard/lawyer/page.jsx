"use client";
import React, { useState, useEffect } from "react";
import {
  LayoutGrid,
  History,
  User,
  Plus,
  Search,
  Bell,
  HelpCircle,
  Briefcase,
} from "lucide-react";

import HiringHistory from "@/app/components/Dashboard/lawyer/hirehistory";
import ManageProfile from "@/app/components/Dashboard/lawyer/manageprofile";
import ManageServices from "@/app/components/Dashboard/lawyer/manageservices";
import { GetUserImage } from "@/lib/actions/api/images";
import { useSession } from "@/lib/auth-client";

const LawyerDashboard = () => {
  const { data: session } = useSession() || { data: null };
  const [activeMenu, setActiveMenu] = useState("dashboard");
  const [profileImgUrl, setProfileImgUrl] = useState("");
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const fetchUserAvatar = async () => {
      const targetId = session?.user?._id || session?.user?.id;
      if (!targetId) return;

      try {
        const response = await GetUserImage(targetId);
        if (response) {
          if (typeof response === "string" && response.trim() !== "") {
            setProfileImgUrl(response);
          } else {
            const nestedData = response.data || response;
            const imgUrl = nestedData.imageUrl || nestedData.profileImg || nestedData.url;
            if (imgUrl) setProfileImgUrl(imgUrl);
          }
        }
      } catch (error) {
        console.error("Failed fetching user image asset:", error);
      }
    };

    fetchUserAvatar();
    setImageError(false);
  }, [session]);

  const userName = session?.user?.name || "Alexander Reed";
  const userRole = session?.user?.role || "Senior Partner";

  const getInitials = (name) => {
    if (!name) return "??";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const initials = getInitials(userName);
  const remoteImageSrc = profileImgUrl || session?.user?.image;
  const showInitialsAvatar = !remoteImageSrc || imageError;

  return (
    <div className="min-h-screen bg-[#050811] text-white flex font-sans selection:bg-[#E2A76F]/30">
      <aside className="w-64 shrink-0 border-r border-[#131B2E] bg-[#050811] flex flex-col justify-between p-4 min-h-screen">
        <div>
          <div className="pt-4 pb-8 px-2">
            <h1 className="text-xl font-serif tracking-wider text-[#FCBA80]">LexVizo</h1>
            <p className="text-[9px] font-mono tracking-[0.3em] text-[#637599] uppercase mt-0.5">Legal Management</p>
          </div>

          <nav className="flex flex-col gap-1">
            <button
              type="button"
              onClick={() => setActiveMenu("dashboard")}
              className={`flex items-center gap-3 px-3 py-2.5 text-xs font-mono tracking-wider uppercase transition-all rounded-none ${activeMenu === "dashboard" ? "bg-[#0E1526] text-[#FCBA80] border-l-2 border-[#FCBA80]" : "text-gray-400 hover:text-white hover:bg-[#0A0F1D]"}`}
            >
              <LayoutGrid size={15} /> Dashboard
            </button>
            <button
              type="button"
              onClick={() => setActiveMenu("history")}
              className={`flex items-center gap-3 px-3 py-2.5 text-xs font-mono tracking-wider uppercase transition-all rounded-none ${activeMenu === "history" ? "bg-[#0E1526] text-[#FCBA80] border-l-2 border-[#FCBA80]" : "text-gray-400 hover:text-white hover:bg-[#0A0F1D]"}`}
            >
              <History size={15} /> Hiring History
            </button>
            <button
              type="button"
              onClick={() => setActiveMenu("profile")}
              className={`flex items-center gap-3 px-3 py-2.5 text-xs font-mono tracking-wider uppercase transition-all rounded-none ${activeMenu === "profile" ? "bg-[#0E1526] text-[#FCBA80] border-l-2 border-[#FCBA80]" : "text-gray-400 hover:text-white hover:bg-[#0A0F1D]"}`}
            >
              <User size={15} /> Manage Profile
            </button>
            <button
              type="button"
              onClick={() => setActiveMenu("services")}
              className={`flex items-center gap-3 px-3 py-2.5 text-xs font-mono tracking-wider uppercase transition-all rounded-none ${activeMenu === "services" ? "bg-[#0E1526] text-[#FCBA80] border-l-2 border-[#FCBA80]" : "text-gray-400 hover:text-white hover:bg-[#0A0F1D]"}`}
            >
              <Briefcase size={15} /> Manage Services
            </button>
          </nav>
        </div>

        <div className="flex flex-col gap-4 border-t border-[#131B2E] pt-4">
          <button className="w-full bg-[#FCBA80] text-black hover:bg-[#E2A76F] py-2.5 text-xs uppercase font-mono tracking-widest font-bold flex items-center justify-center gap-2 transition-all">
            <Plus size={14} strokeWidth={3} /> New Case
          </button>

          <div className="flex items-center gap-3 px-2">
            <div className="w-9 h-9 border border-[#FCBA80]/40 overflow-hidden shrink-0">
              {showInitialsAvatar ? (
                <div className="w-full h-full bg-[#131B2E] text-[#FCBA80] flex items-center justify-center text-xs font-mono font-bold select-none">
                  {initials}
                </div>
              ) : (
                <img
                  src={remoteImageSrc}
                  alt="Profile Avatar"
                  className="w-full h-full object-cover object-top"
                  onError={() => setImageError(true)}
                />
              )}
            </div>
            <div className="min-w-0">
              <div className="text-xs font-mono tracking-wide text-white truncate max-w-[140px]">{userName}</div>
              <div className="text-[9px] font-mono text-[#637599] uppercase truncate max-w-[140px]">{userRole}</div>
            </div>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-[#131B2E] px-8 flex items-center justify-between bg-[#050811]">
          <div className="relative w-80">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search research or documents..."
              className="w-full bg-[#0A0F1D] border border-[#131B2E] pl-9 pr-4 py-1.5 text-xs font-light text-gray-300 focus:outline-none focus:border-[#FCBA80]/40"
            />
          </div>

          <div className="flex items-center gap-8">
            <div className="flex items-center gap-4 text-gray-400 border-l border-[#131B2E] pl-6">
              <button className="hover:text-white relative">
                <Bell size={16} />
                <span className="absolute top-0 right-0 w-1.5 h-1.5 bg-[#FCBA80] rounded-full" />
              </button>
              <button className="hover:text-white">
                <HelpCircle size={16} />
              </button>

              <div className="w-7 h-7 border border-[#131B2E] overflow-hidden shrink-0">
                {showInitialsAvatar ? (
                  <div className="w-full h-full bg-[#131B2E] text-[#FCBA80] flex items-center justify-center text-[10px] font-mono font-bold select-none">
                    {initials}
                  </div>
                ) : (
                  <img
                    src={remoteImageSrc}
                    alt="Profile Avatar Mini"
                    className="w-full h-full object-cover object-top"
                    onError={() => setImageError(true)}
                  />
                )}
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-8 overflow-y-auto max-w-7xl w-full mx-auto space-y-6">
          {activeMenu === "history" && <HiringHistory />}
          {activeMenu === "profile" && <ManageProfile />}
          {activeMenu === "services" && <ManageServices />}

          {activeMenu !== "profile" && activeMenu !== "history" && activeMenu !== "services" && (
            <div className="border border-[#131B2E] bg-[#090D1A]/40 p-12 text-center space-y-3 animate-fade-in">
              <h3 className="text-lg font-serif text-[#FCBA80] uppercase tracking-wider">System Node: {activeMenu}</h3>
              <p className="text-xs text-gray-400 font-light max-w-sm mx-auto leading-relaxed">
                This segment infrastructure is currently initializing. Select "Hiring History", "Manage Profile", or
                "Manage Services" to view layout configurations.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default LawyerDashboard;