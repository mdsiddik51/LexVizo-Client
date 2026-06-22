"use client";
import React, { useTransition, useState, useEffect, useMemo } from "react";
import { ArrowRight, DollarSign, Users, Clock, CheckCircle } from "lucide-react";
import { getPendingRequestsAction, updateRequestStatusAction } from "@/lib/actions/api/hiring";
import { GetLawyerData } from "@/lib/actions/api/lawyerdata";
import { GetUserImage } from "@/lib/actions/api/images";

// Sub-component to dynamically handle individual client images safely
const ClientAvatar = ({ clientUserId, clientName }) => {
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImg = async () => {
      if (!clientUserId) {
        setLoading(false);
        return;
      }
      try {
        const data = await GetUserImage(clientUserId);
        if (data && typeof data === "string") {
          setImageUrl(data);
        } else if (data?.imageUrl) {
          setImageUrl(data.imageUrl);
        } else if (data?.url) {
          setImageUrl(data.url);
        }
      } catch (err) {
        console.error("Failed to load image for user:", clientUserId, err);
      } finally {
        setLoading(false);
      }
    };
    fetchImg();
  }, [clientUserId]);

  const initials = clientName ? clientName.split(" ").map((n) => n[0]).join("").toUpperCase() : "??";

  if (loading) {
    return (
      <div className="w-8 h-8 bg-[#121A2D] border border-zinc-800 flex items-center justify-center animate-pulse shrink-0" />
    );
  }

  return (
    <div className="w-8 h-8 bg-[#121A2D] text-[#FCBA80] border border-zinc-800 flex items-center justify-center font-mono font-semibold text-xs shrink-0 overflow-hidden rounded-sm">
      {imageUrl ? (
        <img 
          src={imageUrl} 
          alt={clientName || "Client"} 
          className="w-full h-full object-cover text-transparent"
          onError={() => setImageUrl(null)}
        />
      ) : (
        initials
      )}
    </div>
  );
};

const HiringHistory = ({ initialRequests = [], userid }) => {
  const [requests, setRequests] = useState(initialRequests);
  const [activeTab, setActiveTab] = useState("pending"); // "pending" | "paid"
  const [isPending, startTransition] = useTransition();

  // Fetch requests dynamically when userid changes
  useEffect(() => {
    const fetchLawyerRequests = async () => {
      try {
        const data = await GetLawyerData(userid);
        if (data?._id) {
          const freshRequests = await getPendingRequestsAction(data._id);
          setRequests(freshRequests || []);
        }
      } catch (error) {
        console.error("Error fetching hiring data:", error);
      }
    };

    if (userid) {
      fetchLawyerRequests();
    }
  }, [userid]);

  // Compute dynamic stats from live state data
  const analytics = useMemo(() => {
    const total = requests.length;
    
    // Split requests by structural categories
    const pendingRequests = requests.filter((r) => r.status === "pending" || !r.status);
    
    // Assuming "accepted" means they paid you, or your backend sets a flag like `.isPaid` or status === "paid"
    // Change "accepted" to "paid" below if your database saves payment collections explicitly.
    const paidRequests = requests.filter((r) => r.status === "accepted" || r.status === "paid");
    
    const totalEarnings = paidRequests.reduce((sum, r) => sum + (r.pricingDetails?.amount || 0), 0);
    const pendingCount = pendingRequests.length;

    const caseTypeCounts = {};
    requests.forEach((r) => {
      if (r.caseType) {
        caseTypeCounts[r.caseType] = (caseTypeCounts[r.caseType] || 0) + 1;
      }
    });

    const chartData = Object.entries(caseTypeCounts).map(([type, count]) => ({ type, count }));
    const maxCount = Math.max(...chartData.map((d) => d.count), 1);

    return {
      total,
      pendingCount,
      paidCount: paidRequests.length,
      totalEarnings,
      chartData,
      maxCount,
      pendingRequests,
      paidRequests,
    };
  }, [requests]);

  // Determine which list to display based on the selected Tab
  const visibleRequests = activeTab === "pending" ? analytics.pendingRequests : analytics.paidRequests;

  const handleStatusUpdate = (requestId, decision) => {
    startTransition(async () => {
      try {
        const result = await updateRequestStatusAction(requestId, decision);
        
        if (result && !result.error) {
          setRequests((prev) =>
            prev.map((req) => (req._id === requestId ? { ...req, status: decision } : req))
          );
        } else {
          alert(result?.error || "Could not process pipeline change.");
        }
      } catch (error) {
        console.error("Action error context:", error);
        alert("Failed to route pipeline status update.");
      }
    });
  };

  return (
    <div className={`space-y-6 animate-fade-in ${isPending ? "opacity-60 pointer-events-none" : ""}`}>
      <div>
        <div className="text-[10px] font-mono tracking-widest text-[#637599] mb-1">
          DASHBOARD &gt; HIRING HISTORY
        </div>
        <h2 className="text-2xl sm:text-3xl font-serif text-white tracking-wide">
          Hiring Requests & Financials
        </h2>
        <p className="text-xs text-gray-400 mt-1 font-light">
          Review pending client records, manage incoming legal operations, and track payments.
        </p>
      </div>

      {/* Dynamic Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Operations", val: String(analytics.total).padStart(2, "0") },
          { label: "Pending Action", val: String(analytics.pendingCount).padStart(2, "0"), highlight: analytics.pendingCount > 0 },
          { label: "Paid Clients", val: String(analytics.paidCount).padStart(2, "0") },
          { label: "Total Revenue", val: `$${analytics.totalEarnings.toLocaleString()}`, highlight: analytics.totalEarnings > 0 },
        ].map((stat, idx) => (
          <div
            key={idx}
            className={`border border-[#131B2E] bg-[#090D1A]/40 p-5 transition-all ${stat.highlight ? "border-[#FCBA80]/60" : ""}`}
          >
            <div className="text-[9px] font-mono uppercase tracking-widest text-gray-400">
              {stat.label}
            </div>
            <div className={`text-2xl font-serif mt-2 ${stat.highlight ? "text-[#FCBA80]" : "text-white"}`}>
              {stat.val}
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Tabs Container */}
      <div className="flex border-b border-[#131B2E] gap-2 font-mono text-xs">
        <button
          onClick={() => setActiveTab("pending")}
          className={`px-4 py-2 border-t-2 transition-all flex items-center gap-2 ${
            activeTab === "pending"
              ? "border-t-[#FCBA80] text-[#FCBA80] bg-[#090D1A]/60 font-semibold"
              : "border-t-transparent text-gray-400 hover:text-white"
          }`}
        >
          <Clock size={12} /> Pending Requests ({analytics.pendingCount})
        </button>
        <button
          onClick={() => setActiveTab("paid")}
          className={`px-4 py-2 border-t-2 transition-all flex items-center gap-2 ${
            activeTab === "paid"
              ? "border-t-[#FCBA80] text-[#FCBA80] bg-[#090D1A]/60 font-semibold"
              : "border-t-transparent text-gray-400 hover:text-white"
          }`}
        >
          <DollarSign size={12} /> Earnings & Paid Clients ({analytics.paidCount})
        </button>
      </div>

      {/* Pipeline Container */}
      <div className="border border-[#131B2E] bg-[#090D1A]/40 overflow-hidden">
        <div className="bg-[#FCBA80] text-black px-4 py-2.5 text-xs font-mono uppercase tracking-widest font-bold flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1">
          <span>{activeTab === "pending" ? "Active Hiring Pipeline" : "Settled Transactions Ledger"}</span>
          <span className="text-[9px] font-mono font-light text-black/70">
            {activeTab === "paid" ? `Gross Earnings: $${analytics.totalEarnings.toLocaleString()}` : "Last Updated: Just Now"}
          </span>
        </div>

        {/* 1. Mobile-First Card Layout (Hidden on Desktop) */}
        <div className="block md:hidden divide-y divide-[#131B2E]/60">
          {visibleRequests.length === 0 ? (
            <div className="text-center py-8 text-gray-500 font-mono text-[11px]">
              No clients found in this segment.
            </div>
          ) : (
            visibleRequests.map((row) => (
              <div key={row._id} className="p-4 space-y-3 bg-[#0A0F1D]/30">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <ClientAvatar clientUserId={row.clientId || row.userId} clientName={row.clientName} />
                    <div className="min-w-0">
                      <div className="text-white font-medium text-xs truncate">{row.clientName || "Unknown Client"}</div>
                      <div className="text-[10px] text-gray-500 font-mono truncate">{row.clientEmail}</div>
                    </div>
                  </div>
                  <span
                    className={`text-[8px] font-mono px-1.5 py-0.5 border font-semibold tracking-wider shrink-0 ${
                      row.urgency === "HIGH"
                        ? "text-red-400 bg-red-500/5 border-red-500/20"
                        : "text-blue-400 bg-blue-500/5 border-blue-500/20"
                    }`}
                  >
                    {row.urgency || "STANDARD"}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1 text-[11px] font-mono text-gray-400">
                  <div>
                    <span className="text-[9px] text-gray-600 block uppercase">Case Type</span>
                    <span className="text-gray-300 font-sans">{row.caseType}</span>
                    <span className="text-[10px] text-[#FCBA80] block capitalize mt-0.5 font-semibold">
                      {row.pricingDetails?.type || "Rate"}: ${row.pricingDetails?.amount?.toLocaleString() || "0"}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] text-gray-600 block uppercase">Requested</span>
                    <span className="text-gray-400">
                      {row.createdAt ? new Date(row.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric"
                      }) : "N/A"}
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-zinc-900/40 flex justify-end">
                  {row.status !== "pending" && row.status ? (
                    <span className={`text-[10px] font-mono uppercase font-bold tracking-wider flex items-center gap-1 ${row.status === "accepted" || row.status === "paid" ? "text-emerald-400" : "text-rose-500"}`}>
                      {(row.status === "accepted" || row.status === "paid") && <CheckCircle size={10} />}
                      {row.status === "accepted" ? "PAID & ACTIVE" : row.status}
                    </span>
                  ) : (
                    <div className="flex gap-2 font-mono text-[10px] w-full sm:w-auto">
                      <button
                        disabled={isPending}
                        onClick={() => handleStatusUpdate(row._id, "rejected")}
                        className="flex-1 sm:flex-none border border-zinc-800 px-4 py-1.5 hover:bg-zinc-900 transition-all text-gray-300 disabled:opacity-50 text-center"
                      >
                        Reject
                      </button>
                      <button
                        disabled={isPending}
                        onClick={() => handleStatusUpdate(row._id, "accepted")}
                        className="flex-1 sm:flex-none bg-[#FCBA80] text-black px-4 py-1.5 hover:bg-[#E2A76F] font-bold transition-all disabled:opacity-50 text-center"
                      >
                        Accept
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* 2. Standard Table Layout (Hidden on Mobile viewports) */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#131B2E] text-[9px] font-mono text-gray-400 tracking-widest uppercase">
                <th className="py-3 px-4 font-normal">Client Name</th>
                <th className="py-3 px-4 font-normal">Case Type</th>
                <th className="py-3 px-4 font-normal">Request Date</th>
                <th className="py-3 px-4 font-normal">Urgency</th>
                <th className="py-3 px-4 font-normal text-right">{activeTab === "pending" ? "Actions" : "Status / Revenue"}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#131B2E]/60 text-xs font-light">
              {visibleRequests.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-gray-500 font-mono text-[11px]">
                    No clients found in this segment.
                  </td>
                </tr>
              ) : (
                visibleRequests.map((row) => (
                  <tr key={row._id} className="hover:bg-[#0A0F1D]/60 transition-colors">
                    <td className="py-4 px-4 flex items-center gap-3">
                      <ClientAvatar clientUserId={row.clientId || row.userId} clientName={row.clientName} />
                      <div className="min-w-0">
                        <div className="text-white font-medium truncate max-w-[160px]">{row.clientName || "Unknown Client"}</div>
                        <div className="text-[10px] text-gray-500 font-mono mt-0.5 truncate max-w-[160px]">
                          {row.clientEmail}
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4 text-gray-300">
                      <div>{row.caseType}</div>
                      <div className="text-[10px] text-[#FCBA80] font-mono mt-0.5 capitalize font-medium">
                        {row.pricingDetails?.type || "Rate"}: ${row.pricingDetails?.amount?.toLocaleString() || "0"}
                      </div>
                    </td>

                    <td className="py-4 px-4 text-gray-400 font-mono">
                      {row.createdAt ? new Date(row.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric"
                      }) : "N/A"}
                    </td>

                    <td className="py-4 px-4">
                      <span
                        className={`text-[8px] font-mono px-1.5 py-0.5 border font-semibold tracking-wider ${
                          row.urgency === "HIGH"
                            ? "text-red-400 bg-red-500/5 border-red-500/20"
                            : "text-blue-400 bg-blue-500/5 border-blue-500/20"
                        }`}
                      >
                        {row.urgency || "STANDARD"}
                      </span>
                    </td>

                    <td className="py-4 px-4 text-right">
                      {row.status !== "pending" && row.status ? (
                        <span className={`text-[10px] font-mono uppercase font-bold tracking-wider inline-flex items-center gap-1.5 ${row.status === "accepted" || row.status === "paid" ? "text-emerald-400" : "text-rose-500"}`}>
                          {(row.status === "accepted" || row.status === "paid") && <CheckCircle size={11} />}
                          {row.status === "accepted" ? "PAID & ACTIVE" : row.status}
                        </span>
                      ) : (
                        <div className="flex justify-end gap-2 font-mono text-[10px]">
                          <button
                            disabled={isPending}
                            onClick={() => handleStatusUpdate(row._id, "rejected")}
                            className="border border-zinc-800 px-3 py-1 hover:bg-zinc-900 transition-all text-gray-300 disabled:opacity-50"
                          >
                            Reject
                          </button>
                          <button
                            disabled={isPending}
                            onClick={() => handleStatusUpdate(row._id, "accepted")}
                            className="bg-[#FCBA80] text-black px-3 py-1 hover:bg-[#E2A76F] font-bold transition-all disabled:opacity-50"
                          >
                            Accept
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Dynamic Analytics Subpanels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 border border-[#131B2E] bg-[#090D1A]/40 p-4 sm:p-6 relative min-h-[220px]">
          <h4 className="text-sm font-serif text-white tracking-wide border-b border-[#131B2E] pb-2 mb-4">
            Case Breakdown by Sector
          </h4>
          
          {analytics.chartData.length === 0 ? (
            <div className="text-xs font-mono text-gray-500 h-24 flex items-center justify-center">
              No sector analytics data to track.
            </div>
          ) : (
            <div className="flex justify-around items-end h-24 pt-4 font-mono text-[9px] text-gray-400 gap-2">
              {analytics.chartData.slice(0, 4).map((data, idx) => {
                const percentageHeight = Math.max((data.count / analytics.maxCount) * 100, 15);
                return (
                  <div key={idx} className="flex flex-col items-center gap-2 flex-1 max-w-[80px]">
                    <div 
                      style={{ height: `${percentageHeight}%` }} 
                      className={`w-full transition-all duration-500 ${idx === 1 ? 'bg-[#FCBA80]/80' : 'bg-[#121A2D]'}`} 
                    />
                    <span className="truncate w-full text-center block" title={data.type}>
                      {data.type.split(" ")[0]} ({data.count})
                    </span>
                  </div>
                );
              })}
            </div>
          )}
          
          <p className="text-[11px] text-gray-400 mt-6 font-light">
            Your legal ecosystem spans <span className="text-[#FCBA80] font-mono font-medium">{analytics.chartData.length} active practice sectors</span> based on client request records.
          </p>
        </div>

        <div className="border border-[#131B2E] bg-[#090D1A]/40 p-4 sm:p-6 flex flex-col justify-between gap-4 border-l-2 border-l-[#FCBA80]">
          <div>
            <div className="text-xs font-mono text-[#FCBA80] tracking-wider uppercase mb-3 flex items-center gap-2">
              💡 Revenue Optimization
            </div>
            <p className="text-xs text-gray-400 italic font-light leading-relaxed">
              "You have captured a gross total of <span className="text-white not-italic font-mono">${analytics.totalEarnings.toLocaleString()}</span> across your active client pipeline profiles."
            </p>
          </div>
          <button className="text-[10px] font-mono text-[#FCBA80] tracking-widest uppercase flex items-center gap-2 hover:text-white transition-all pt-2">
            View Financial Ledger Guidelines <ArrowRight size={12} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default HiringHistory;