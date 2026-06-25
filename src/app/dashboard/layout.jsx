"use client";
import React, { useState, useEffect, useMemo } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useSession, signOut } from "@/lib/auth-client";
import { GetUserImage } from "@/lib/actions/api/images";
import { 
  LayoutGrid, 
  History, 
  User, 
  MessageSquare, 
  Users, 
  Receipt, 
  TrendingUp, 
  Menu, 
  X, 
  Bell, 
  HelpCircle,
  Briefcase,
  LogOut,
  Edit
} from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const sessionContext = useSession();
  const isPending = sessionContext?.isPending;
  const sessionUser = sessionContext?.data?.user || sessionContext?.user;

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [profileImgUrl, setProfileImgUrl] = useState("");
  const [imageError, setImageError] = useState(false);

  // Authentication & redirection checks
  useEffect(() => {
    if (!isPending && !sessionUser) {
      router.replace("/auth/login");
    }
  }, [sessionUser, isPending, router]);

  // Fetch avatar on session load
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
        console.error("Failed fetching layout avatar:", err);
      }
    };
    fetchAvatar();
    setImageError(false);
  }, [sessionUser]);

  // Normalize role
  const userRole = useMemo(() => {
    if (!sessionUser?.role) return "";
    const roleLower = sessionUser.role.toLowerCase();
    if (roleLower === "client") return "user"; // map client to user
    return roleLower;
  }, [sessionUser]);

  const userName = sessionUser?.name || "Member";
  const userEmail = sessionUser?.email || "";

  const getInitials = (name) => {
    if (!name) return "??";
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const initials = getInitials(userName);
  const avatarSrc = profileImgUrl || sessionUser?.image;
  const showInitialsAvatar = !avatarSrc || imageError;

  // Compute sidebar links based on role
  const menuItems = useMemo(() => {
    const common = [
      { href: "/dashboard", label: "Profile Overview", icon: <User size={15} /> }
    ];

    if (userRole === "user") {
      return [
        ...common,
        { href: "/dashboard/user/hiring-history", label: "Hiring History", icon: <History size={15} /> },
        { href: "/dashboard/user/update-profile", label: "Update Profile", icon: <Edit size={15} /> },
        { href: "/dashboard/user/comments", label: "My Comments", icon: <MessageSquare size={15} /> }
      ];
    } else if (userRole === "lawyer") {
      return [
        ...common,
        { href: "/dashboard/lawyer/hiring-history", label: "Hiring Requests", icon: <History size={15} /> },
        { href: "/dashboard/lawyer/manage-legal-profile", label: "Legal Profile & Services", icon: <Briefcase size={15} /> }
      ];
    } else if (userRole === "admin") {
      return [
        ...common,
        { href: "/dashboard/admin/manage-users", label: "Manage Users", icon: <Users size={15} /> },
        { href: "/dashboard/admin/all-transactions", label: "All Transactions", icon: <Receipt size={15} /> },
        { href: "/dashboard/admin/analytics", label: "Analytics Overview", icon: <TrendingUp size={15} /> }
      ];
    }

    return common;
  }, [userRole]);

  const handleLogout = async () => {
    const loadingToast = toast.loading("Logging out securely...");
    try {
      await signOut();
      toast.success("Logged out successfully", { id: loadingToast });
      router.replace("/");
    } catch (err) {
      toast.error("Logout failed", { id: loadingToast });
    }
  };

  // Loading spinner while session is pending
  if (isPending) {
    return (
      <div className="min-h-screen bg-[#050811] text-white flex flex-col items-center justify-center font-mono space-y-4">
        <div className="w-8 h-8 border-2 border-[#FCBA80] border-t-transparent animate-spin rounded-full" />
        <span className="text-[10px] tracking-widest text-gray-500 uppercase animate-pulse">
          // Securing Session Handshake...
        </span>
      </div>
    );
  }

  // Double check if redirect is in progress
  if (!sessionUser) {
    return (
      <div className="min-h-screen bg-[#050811] text-white flex flex-col items-center justify-center font-mono">
        <span className="text-[10px] tracking-widest text-gray-500 uppercase">
          // Authentication Required: Redirecting...
        </span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#04080f] text-slate-100 font-sans flex flex-col lg:flex-row relative overflow-x-hidden select-none selection:bg-[#FCBA80] selection:text-black">
      
      {/* MOBILE HEADER */}
      <div className="lg:hidden h-16 bg-[#050a12] border-b border-[#111927] flex items-center justify-between px-4 sticky top-0 z-50 w-full">
        <Link href="/" className="text-xl font-serif text-[#FCBA80] tracking-wide font-medium">
          LexVizo
        </Link>
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="text-slate-100 p-2 focus:outline-none"
        >
          {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* MOBILE OVERLAY */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-30 lg:hidden"
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-40 w-64 bg-[#050a12] border-r border-[#111927] flex flex-col justify-between shrink-0 transition-transform duration-300 ease-in-out
          lg:translate-x-0 lg:static lg:h-screen lg:sticky lg:top-0
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        <div>
          <div className="p-6 hidden lg:block border-b border-[#111927]/60">
            <Link href="/" className="text-2xl font-serif text-[#FCBA80] tracking-wide font-medium block">
              LexVizo
            </Link>
            <span className="text-[9px] text-slate-500 tracking-widest block mt-1 font-mono uppercase">
              {userRole || "User"} workspace
            </span>
          </div>

          <nav className="mt-16 lg:mt-6 px-3 space-y-1">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 text-xs font-mono tracking-wider uppercase transition-all rounded-none text-left w-full border-l-2 ${
                    isActive
                      ? "bg-[#0E1526] text-[#FCBA80] border-[#FCBA80] font-bold"
                      : "text-gray-400 border-transparent hover:text-white hover:bg-[#0A0F1D]"
                  }`}
                >
                  {item.icon} {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* LOGGED IN USER CARD */}
        <div className="p-4 border-t border-[#111927] flex flex-col gap-3 bg-[#03060b]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 border border-[#FCBA80]/40 overflow-hidden shrink-0 flex items-center justify-center bg-[#111927]">
              {showInitialsAvatar ? (
                <span className="text-xs font-mono font-bold text-[#FCBA80]">{initials}</span>
              ) : (
                <img
                  src={avatarSrc}
                  alt="avatar"
                  className="w-full h-full object-cover object-top"
                  onError={() => setImageError(true)}
                />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-mono font-medium text-slate-200 truncate">
                {userName}
              </p>
              <p className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">
                {sessionUser?.role || "Member"}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full border border-red-900/30 hover:border-red-900 bg-red-950/20 hover:bg-red-950/40 text-red-400 text-[10px] font-mono uppercase tracking-wider py-2 flex items-center justify-center gap-2 transition-colors"
          >
            <LogOut size={12} /> Log Out
          </button>
        </div>
      </aside>

      {/* MAIN WORKSPACE */}
      <main className="flex-1 flex flex-col min-w-0 bg-[#04080f]">
        
        {/* DESKTOP HEADER */}
        <header className="hidden lg:flex h-16 border-b border-[#111927] px-8 items-center justify-between bg-[#050811] sticky top-0 z-30">
          <div>
            <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest block">
              System Console &gt; Secure Ledger Active
            </span>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-4 text-gray-400 border-l border-[#111927] pl-6">
              <button className="hover:text-white relative">
                <Bell size={15} />
              </button>
              <button className="hover:text-white">
                <HelpCircle size={15} />
              </button>
              
              <span className="text-xs font-mono text-slate-400">
                Hi, <strong className="text-slate-200">{userName.split(" ")[0]}</strong>
              </span>
            </div>
          </div>
        </header>

        {/* WORKSPACE CONTENT */}
        <div className="p-4 lg:p-8 max-w-[1600px] w-full mx-auto space-y-8 overflow-x-hidden">
          {children}
        </div>
      </main>

    </div>
  );
}
