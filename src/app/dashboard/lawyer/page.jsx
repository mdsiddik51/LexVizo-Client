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
  ArrowRight,
  Star,
  Menu,
  X,
  DollarSign,
  CheckCircle2,
  XCircle
} from "lucide-react";

import HiringHistory from "@/app/components/Dashboard/lawyer/hirehistory";
import ManageProfile from "@/app/components/Dashboard/lawyer/manageprofile";
import ManageServices from "@/app/components/Dashboard/lawyer/manageservices";
import { GetUserImage } from "@/lib/actions/api/images";
import { useSession } from "@/lib/auth-client";
import { GetLawyerData } from "@/lib/actions/api/lawyerdata";
import { getLawyerRequestsAction } from "@/lib/actions/api/hiring";
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

  // Core Data Fetch Hook - Hits updated backend to persist data upon reload
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
          const [allRequests, freshComments] = await Promise.all([
            getLawyerRequestsAction(lawyerProfile._id),
            fetchCommentsAction(lawyerProfile._id)
          ]);
          
          setRequests(allRequests || []);
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

 
  const dashboardStats = useMemo(() => {
    const total = requests.length;
   
    const paidClientsList = requests.filter(r => r.status === "paid");
    const unpaidClientsList = requests.filter(r => r.status !== "paid");
    const highUrgency = unpaidClientsList.filter(r => r.urgency === "HIGH").length;
    
    const totalEarning = paidClientsList.reduce((sum, r) => sum + (r.pricingDetails?.amount || 0), 0);
    const totalUnpaidRevenue = unpaidClientsList.reduce((sum, r) => sum + (r.pricingDetails?.amount || 0), 0);

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

    return { 
      total, 
      pending: unpaidClientsList.length, 
      highUrgency, 
      totalEarning, 
      totalUnpaidRevenue,
      paidClientsList,
      unpaidClientsList,
      averageRating, 
      totalComments, 
      commentsToday 
    };
  }, [requests, commentsData]);

  const userName = session?.user?.name || "Practitioner";
  const userRole = session?.user?.role || "Counsel Partner";
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

      <div className="flex-1 flex flex-col min-w-0">
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

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-7xl w-full mx-auto space-y-6">
          {activeMenu === "dashboard" && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <div className="text-[10px] font-mono tracking-widest text-[#637599] mb-1">
                    OVERVIEW &gt; SYSTEM DISCLOSURE
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

             
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { title: "Total Earnings", value: `$${dashboardStats.totalEarning.toLocaleString()}`, icon: <DollarSign className="text-emerald-400" size={16} /> },
                  { title: "Paid Client Count", value: String(dashboardStats.paidClientsList.length).padStart(2, "0"), icon: <CheckCircle2 className="text-emerald-400" size={16} /> },
                  { title: "Unpaid / Outstanding Billing", value: `$${dashboardStats.totalUnpaidRevenue.toLocaleString()}`, icon: <TrendingUp className="text-amber-400" size={16} /> },
                  { title: "Unpaid Client Count", value: String(dashboardStats.unpaidClientsList.length).padStart(2, "0"), icon: <Clock className="text-amber-400" size={16} />, highlight: dashboardStats.unpaidClientsList.length > 0 },
                ].map((metric, i) => (
                  <div key={i} className={`border border-[#131B2E] bg-[#090D1A]/40 p-5 flex justify-between items-start ${metric.highlight ? "border-amber-500/30" : ""}`}>
                    <div className="min-w-0">
                      <span className="text-[9px] font-mono uppercase tracking-widest text-gray-400 block truncate">{metric.title}</span>
                      <span className="text-xl sm:text-2xl font-serif text-white mt-2 block truncate">{metric.value}</span>
                    </div>
                    <div className="p-2 bg-[#101626] border border-[#1d2944] shrink-0">{metric.icon}</div>
                  </div>
                ))}
              </div>

             
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
               
                <div className="border border-[#131B2E] bg-[#090D1A]/40 p-4 sm:p-6 space-y-4 lg:col-span-1">
                  <h3 className="text-xs font-mono text-[#FCBA80] uppercase tracking-wider border-b border-[#131B2E] pb-2">
                    Settlement Status
                  </h3>
                  <div className="space-y-4 pt-2">
                    {[
                      { label: "Collection / Paid Rate", percentage: (dashboardStats.totalEarning + dashboardStats.totalUnpaidRevenue) > 0 ? Math.round((dashboardStats.totalEarning / (dashboardStats.totalEarning + dashboardStats.totalUnpaidRevenue)) * 100) : 0, color: "bg-emerald-500" },
                      { label: "Pending Arrears Ratio", percentage: (dashboardStats.totalEarning + dashboardStats.totalUnpaidRevenue) > 0 ? Math.round((dashboardStats.totalUnpaidRevenue / (dashboardStats.totalEarning + dashboardStats.totalUnpaidRevenue)) * 100) : 0, color: "bg-amber-500" },
                      { label: "Urgent Queue Volume", percentage: dashboardStats.total > 0 ? Math.round((dashboardStats.highUrgency / dashboardStats.total) * 100) : 0, color: "bg-rose-500" }
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

               
                <div className="border border-[#131B2E] bg-[#090D1A]/40 p-4 sm:p-6 lg:col-span-2 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xs font-mono text-[#FCBA80] uppercase tracking-wider border-b border-[#131B2E] pb-2 mb-4">
                      Client Settlement Inbound Registry
                    </h3>
                    
                    {requests.length === 0 ? (
                      <div className="text-center py-8 text-xs font-mono text-gray-500">
                        No processing operations or historical data logs found.
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-left font-mono text-[11px] border-collapse">
                          <thead>
                            <tr className="border-b border-[#131B2E] text-gray-500 uppercase tracking-wider text-[9px]">
                              <th className="pb-2 font-normal">Client Account</th>
                              <th className="pb-2 font-normal">Service Type</th>
                              <th className="pb-2 font-normal text-right">Fee Charge</th>
                              <th className="pb-2 font-normal text-right">Payment Status</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-[#131B2E]/40">
                            {requests.slice(0, 5).map((item) => {
                              const isPaid = item.status === "paid";
                              return (
                                <tr key={item._id?.$oid || item._id} className="hover:bg-[#0E1526]/30 transition-colors">
                                  <td className="py-2.5 text-white pr-2 max-w-[120px] truncate">{item.clientName}</td>
                                  <td className="py-2.5 text-gray-400 uppercase text-[10px] pr-2 max-w-[140px] truncate">{item.caseType || "General Retainer"}</td>
                                  <td className="py-2.5 text-right font-bold text-white">${item.pricingDetails?.amount || 0}</td>
                                  <td className="py-2.5 text-right">
                                    <span className={`inline-block text-[9px] px-2 py-0.5 font-bold border uppercase tracking-wider ${
                                      isPaid 
                                        ? "bg-emerald-950/40 border-emerald-900/60 text-emerald-400" 
                                        : "bg-amber-950/40 border-amber-900/60 text-amber-400"
                                    }`}>
                                      {isPaid ? "Paid" : "Pending"}
                                    </span>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>

                  <button 
                    onClick={() => setActiveMenu("history")}
                    className="text-[10px] font-mono text-[#FCBA80] uppercase flex items-center gap-2 hover:text-white transition-all pt-4 border-t border-[#131B2E]/60 mt-4 w-fit"
                  >
                    Examine Entire Client Registry History <ArrowRight size={12} />
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