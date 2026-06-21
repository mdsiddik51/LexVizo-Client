"use client";
import React, { useState, useEffect, useMemo } from "react";
import {
  LayoutGrid,
  History,
  User,
  Plus,
  Search,
  Bell,
  HelpCircle,
  Briefcase,
  TrendingUp,
  Clock,
  AlertCircle,
  ArrowRight,
  Star,
  Menu,
  X
} from "lucide-react";

import HiringHistory from "@/app/components/Dashboard/lawyer/hirehistory";
import ManageProfile from "@/app/components/Dashboard/lawyer/manageprofile";
import ManageServices from "@/app/components/Dashboard/lawyer/manageservices";
import { GetUserImage } from "@/lib/actions/api/images";
import { useSession } from "@/lib/auth-client";
import { GetLawyerData } from "@/lib/actions/api/lawyerdata";
import { getPendingRequestsAction } from "@/lib/actions/api/hiring";
import { fetchCommentsAction } from "@/lib/actions/api/comments";

const LawyerDashboard = () => {
  const { data: session } = useSession() || { data: null };
  const [activeMenu, setActiveMenu] = useState("dashboard");
  const [profileImgUrl, setProfileImgUrl] = useState("");
  const [imageError, setImageError] = useState(false);
  const [requests, setRequests] = useState([]);
  const [commentsData, setCommentsData] = useState([]);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Core Data Fetch Hook
  useEffect(() => {
    const fetchDashboardMetadata = async () => {
      const targetId = session?.user?._id || session?.user?.id;
      if (!targetId) return;
      
      setIsLoadingData(true);
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

        const lawyerProfile = await GetLawyerData(targetId);
        if (lawyerProfile?._id) {
          const [freshRequests, freshComments] = await Promise.all([
            getPendingRequestsAction(lawyerProfile._id),
            fetchCommentsAction(lawyerProfile._id)
          ]);
          
          setRequests(freshRequests || []);
          setCommentsData(freshComments || []);
        }
      } catch (error) {
        console.error("Failed fetching layout resources:", error);
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchDashboardMetadata();
    setImageError(false);
  }, [session]);

  // Compute Aggregated Analytics Matrices
  const dashboardStats = useMemo(() => {
    const total = requests.length;
    const pending = requests.filter(r => r.status === "pending" || !r.status).length;
    const highUrgency = requests.filter(r => r.urgency === "HIGH" && (r.status === "pending" || !r.status)).length;
    
    // Total pending pipeline valuation capital pool
    const totalRevenue = requests
      .filter(r => r.status === "pending" || !r.status)
      .reduce((sum, r) => sum + (r.pricingDetails?.amount || 0), 0);

    const totalComments = commentsData.length;
    const averageRating = totalComments > 0 
      ? (commentsData.reduce((acc, c) => acc + (c.rating || 0), 0) / totalComments).toFixed(1)
      : "5.0";

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const commentsToday = commentsData.filter(comment => {
      const commentDate = new Date(comment.createdAt || comment.date);
      return commentDate >= startOfToday;
    }).length;

    return { total, pending, highUrgency, totalRevenue, averageRating, totalComments, commentsToday };
  }, [requests, commentsData]);

  const userName = session?.user?.name || "Alexander Reed";
  const userRole = session?.user?.role || "Senior Partner";
  const userid = session?.user?.id;

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

  const NavigationLinks = () => (
    <nav className="flex flex-col gap-1">
      {[
        { id: "dashboard", label: "Dashboard", icon: <LayoutGrid size={15} /> },
        { id: "history", label: "Hiring History", icon: <History size={15} /> },
        { id: "profile", label: "Manage Profile", icon: <User size={15} /> },
        { id: "services", label: "Manage Services", icon: <Briefcase size={15} /> }
      ].map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={() => {
            setActiveMenu(item.id);
            setMobileMenuOpen(false);
          }}
          className={`flex items-center gap-3 px-3 py-2.5 text-xs font-mono tracking-wider uppercase transition-all rounded-none text-left ${activeMenu === item.id ? "bg-[#0E1526] text-[#FCBA80] border-l-2 border-[#FCBA80]" : "text-gray-400 hover:text-white hover:bg-[#0A0F1D]"}`}
        >
          {item.icon} {item.label}
        </button>
      ))}
    </nav>
  );

  return (
    <div className="min-h-screen bg-[#050811] text-white flex flex-col md:flex-row font-sans selection:bg-[#E2A76F]/30">
      
      {/* Mobile Top Header Bar */}
      <div className="md:hidden h-16 border-b border-[#131B2E] bg-[#050811] px-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-serif tracking-wider text-[#FCBA80]">LexVizo</h1>
        </div>
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
          className="p-2 text-gray-400 hover:text-white"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Overlapping Mobile Drawer Sidebar */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden" onClick={() => setMobileMenuOpen(false)} />
      )}
      
      <aside className={`fixed top-16 bottom-0 left-0 w-64 border-r border-[#131B2E] bg-[#050811] flex flex-col justify-between p-4 z-40 transition-transform duration-300 md:sticky md:top-0 md:h-screen shrink-0 ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}>
        <div>
          <div className="hidden md:block pt-4 pb-8 px-2">
            <h1 className="text-xl font-serif tracking-wider text-[#FCBA80]">LexVizo</h1>
            <p className="text-[9px] font-mono tracking-[0.3em] text-[#637599] uppercase mt-0.5">Legal Management</p>
          </div>
          <NavigationLinks />
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

      {/* Main Container Viewport */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Desktop Header panel */}
        <header className="hidden md:flex h-16 border-b border-[#131B2E] px-8 items-center justify-between bg-[#050811] sticky top-0 z-30">
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
                {dashboardStats.pending > 0 && (
                  <span className="absolute top-0 right-0 w-1.5 h-1.5 bg-[#FCBA80] rounded-full" />
                )}
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

        {/* Core Layout Main Component Block */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-7xl w-full mx-auto space-y-6">
          {activeMenu === "dashboard" && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <div className="text-[10px] font-mono tracking-widest text-[#637599] mb-1">
                    OVERVIEW &gt; CONTROL PANEL
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-serif text-white tracking-wide">
                    Welcome Back, {userName.split(" ")[0]}
                  </h2>
                </div>

                <div className="flex items-center gap-4 bg-[#0E1526] border border-[#131B2E] px-4 py-2 w-fit">
                  <div className="flex items-center gap-1.5 border-r border-[#131B2E] pr-3">
                    <Star className="text-[#FCBA80] fill-[#FCBA80]" size={14} />
                    <span className="text-sm font-mono font-bold text-white">{dashboardStats.averageRating}</span>
                  </div>
                  <div>
                    <span className="text-[9px] font-mono text-gray-400 block uppercase tracking-wider">Today's Activity</span>
                    <span className="text-xs font-mono font-bold text-emerald-400">
                      +{dashboardStats.commentsToday} feedback items
                    </span>
                  </div>
                </div>
              </div>

              {/* Dynamic Analytics Aggregations */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { title: "Pending Pipeline Value", value: `$${dashboardStats.totalRevenue.toLocaleString()}`, icon: <TrendingUp className="text-[#FCBA80]" size={16} /> },
                  { title: "Pending Requests", value: String(dashboardStats.pending).padStart(2, "0"), icon: <Clock className="text-amber-400" size={16} />, highlight: dashboardStats.pending > 0 },
                  { title: "User Satisfaction Star", value: `${dashboardStats.averageRating} / 5.0`, icon: <Star className="text-emerald-400 fill-emerald-500/20" size={16} /> },
                  { title: "High Urgency Action", value: String(dashboardStats.highUrgency).padStart(2, "0"), icon: <AlertCircle className="text-rose-400" size={16} />, highlight: dashboardStats.highUrgency > 0 },
                ].map((metric, i) => (
                  <div key={i} className={`border border-[#131B2E] bg-[#090D1A]/40 p-5 flex justify-between items-start ${metric.highlight ? "border-rose-500/30" : ""}`}>
                    <div className="min-w-0">
                      <span className="text-[9px] font-mono uppercase tracking-widest text-gray-400 block truncate">{metric.title}</span>
                      <span className="text-xl sm:text-2xl font-serif text-white mt-2 block truncate">{metric.value}</span>
                    </div>
                    <div className="p-2 bg-[#101626] border border-[#1d2944] shrink-0">{metric.icon}</div>
                  </div>
                ))}
              </div>

              {/* Performance Grid Sections */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Visual Chart Bars Component */}
                <div className="border border-[#131B2E] bg-[#090D1A]/40 p-4 sm:p-6 space-y-4">
                  <h3 className="text-xs font-mono text-[#FCBA80] uppercase tracking-wider border-b border-[#131B2E] pb-2">
                    Operational Allocation Matrix
                  </h3>
                  <div className="space-y-4 pt-2">
                    {[
                      { label: "Pending Load Cap", percentage: dashboardStats.total > 0 ? Math.round((dashboardStats.pending / dashboardStats.total) * 100) : 0, color: "bg-amber-500" },
                      { label: "Urgency Saturation", percentage: dashboardStats.pending > 0 ? Math.round((dashboardStats.highUrgency / dashboardStats.pending) * 100) : 0, color: "bg-rose-500" },
                      { label: "Client Star Ratio", percentage: Math.round((parseFloat(dashboardStats.averageRating) / 5) * 100), color: "bg-emerald-500" }
                    ].map((bar, index) => (
                      <div key={index} className="space-y-1.5">
                        <div className="flex justify-between text-[10px] font-mono">
                          <span className="text-gray-400 uppercase tracking-wide">{bar.label}</span>
                          <span className="text-white font-bold">{bar.percentage}%</span>
                        </div>
                        <div className="h-2 w-full bg-[#101626] border border-[#1d2944]/40 overflow-hidden">
                          <div 
                            className={`h-full ${bar.color} transition-all duration-500`} 
                            style={{ width: `${bar.percentage}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border border-[#131B2E] bg-[#090D1A]/40 p-4 sm:p-6">
                  <h3 className="text-xs font-mono text-[#FCBA80] uppercase tracking-wider border-b border-[#131B2E] pb-2 mb-4">
                    Immediate Action Log
                  </h3>
                  {requests.filter(r => r.status === "pending" || !r.status).length === 0 ? (
                    <div className="text-center py-8 text-xs font-mono text-gray-500">
                      No critical actions needed. Pipeline is clean.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {requests.filter(r => r.status === "pending" || !r.status).slice(0, 2).map((item) => (
                        <div key={item._id} className="flex justify-between items-center bg-[#070b14] border border-[#131B2E] p-3 text-xs gap-2">
                          <div className="min-w-0">
                            <p className="text-white font-medium truncate">{item.clientName}</p>
                            <p className="text-[10px] font-mono text-gray-500 truncate">{item.caseType}</p>
                          </div>
                          <button 
                            onClick={() => setActiveMenu("history")}
                            className="text-[10px] font-mono border border-zinc-800 hover:bg-[#FCBA80] hover:text-black transition-all px-2.5 py-1 shrink-0"
                          >
                            Review
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="border border-[#131B2E] bg-[#090D1A]/40 p-4 sm:p-6 flex flex-col justify-between gap-4">
                  <div>
                    <h3 className="text-xs font-mono text-gray-400 uppercase tracking-wider mb-2">Live Ingestion</h3>
                    <div className="text-lg font-serif text-[#FCBA80]">LexVizo Data Inbound</div>
                    <p className="text-[11px] text-gray-500 font-mono mt-2 leading-relaxed">
                      Aggregating active legal corpus data pool. Processed index counts are standing at {dashboardStats.totalComments} verified ratings.
                    </p>
                  </div>
                  <button 
                    onClick={() => setActiveMenu("history")}
                    className="text-[10px] font-mono text-[#FCBA80] uppercase flex items-center gap-2 hover:text-white transition-all pt-2"
                  >
                    Enter Inbound Pipeline <ArrowRight size={12} />
                  </button>
                </div>

              </div>
            </div>
          )}

          {activeMenu === "history" && <HiringHistory initialRequests={requests} userid={userid} />}
          {activeMenu === "profile" && <ManageProfile />}
          {activeMenu === "services" && <ManageServices />}
        </main>
      </div>
    </div>
  );
};

export default LawyerDashboard;