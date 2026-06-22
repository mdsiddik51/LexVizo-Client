"use client";
import React from "react";
import { User } from "lucide-react";

const HiringHistoryTab = ({ hiringHistory, isLoading, paymentSuccessId, handlePayment }) => {
  
  // Calculate pipeline metric aggregates dynamically based on the returned database payload
  const totalRequests = hiringHistory.length;
  const pendingRequests = hiringHistory.filter(item => item.status === 'pending').length;
  const paidRequests = hiringHistory.filter(item => item.status === 'paid').length;
  
  const acceptedItems = hiringHistory.filter(item => item.status === 'accepted' || item.status === 'paid').length;
  const totalEvaluated = hiringHistory.filter(item => item.status !== 'pending').length;
  const acceptanceRate = totalEvaluated > 0 ? Math.round((acceptedItems / totalEvaluated) * 100) : 0;

  // Format incoming ISO time values nicely 
  const formatDate = (dateValue) => {
    if (!dateValue) return "N/A";
    const dateObj = dateValue.$date ? new Date(dateValue.$date) : new Date(dateValue);
    return dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  if (isLoading) {
    return (
      <div className="space-y-4 animate-fadeIn">
        <p className="text-xs font-mono text-slate-500 uppercase tracking-widest">Querying central ledger network...</p>
        <div className="h-32 bg-[#050a12] border border-[#111927] flex items-center justify-center text-sm font-mono text-slate-400">
          Loading Data Pipeline Blocks...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      <div>
        <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">
          Dashboard &gt; <span className="text-[#e0a96d]">Hiring History</span>
        </div>
        <h2 className="text-2xl lg:text-3xl font-serif text-slate-100 mt-2 font-normal tracking-wide">Hiring Requests Log</h2>
      </div>

      {/* Metric Framework Headers */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#050a12] border border-[#111927] p-5 rounded-none">
          <p className="text-[9px] font-mono text-slate-500 tracking-widest uppercase">Total Pipeline</p>
          <p className="text-2xl font-serif text-slate-100 mt-2 font-semibold">
            {totalRequests < 10 ? `0${totalRequests}` : totalRequests}
          </p>
        </div>
        <div className="bg-[#050a12] border border-[#e0a96d]/30 p-5 rounded-none">
          <p className="text-[9px] font-mono text-[#e0a96d] tracking-widest uppercase">Pending Lawyer Action</p>
          <p className="text-2xl font-serif text-[#e0a96d] mt-2 font-semibold">
            {pendingRequests < 10 ? `0${pendingRequests}` : pendingRequests}
          </p>
        </div>
        <div className="bg-[#050a12] border border-[#111927] p-5 rounded-none">
          <p className="text-[9px] font-mono text-slate-500 tracking-widest uppercase">Acceptance Rate</p>
          <p className="text-2xl font-serif text-slate-100 mt-2 font-semibold">{acceptanceRate}%</p>
        </div>
        <div className="bg-[#050a12] border border-[#111927] p-5 rounded-none">
          <p className="text-[9px] font-mono text-slate-500 tracking-widest uppercase">Active Pipelines</p>
          <p className="text-2xl font-serif text-slate-100 mt-2 font-semibold">
            {paidRequests < 10 ? `0${paidRequests}` : paidRequests}
          </p>
        </div>
      </div>

      <div className="bg-[#050a12] border border-[#111927] rounded-none overflow-hidden">
        <div className="bg-[#f2b97e] text-black px-4 py-2 flex flex-col sm:flex-row justify-between items-start sm:items-center text-[10px] uppercase font-mono font-bold tracking-widest rounded-none gap-1">
          <span>Active Hiring Pipeline Records</span>
          <span className="text-black/60 font-normal">System Realtime Synchronized</span>
        </div>
        
        {totalRequests === 0 ? (
          <div className="p-8 text-center text-xs font-mono text-slate-500 uppercase tracking-wider">
            No pipeline records detected in database.
          </div>
        ) : (
          <>
            {/* Mobile Grid Layout */}
            <div className="block md:hidden divide-y divide-[#111927]">
              {hiringHistory.map((item) => {
                const itemId = item._id?.$oid || item._id;
                return (
                  <div key={itemId} className="p-4 space-y-4 bg-[#050a12] hover:bg-[#080f1b]/30 transition-colors">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-[11px] text-slate-500 font-mono">{formatDate(item.createdAt)}</p>
                      </div>
                      <div>
                        {item.status === 'pending' && <span className="text-amber-500 border border-amber-500/30 font-mono text-[9px] px-2 py-0.5 uppercase bg-amber-950/20">Pending Action</span>}
                        {item.status === 'rejected' && <span className="text-rose-500 border border-rose-500/30 font-mono text-[9px] px-2 py-0.5 uppercase bg-rose-950/20">Rejected</span>}
                        {item.status === 'accepted' && <span className="text-emerald-400 border border-emerald-500/20 font-mono text-[9px] px-2 py-0.5 uppercase bg-emerald-950/20">Accepted</span>}
                        {item.status === 'paid' && <span className="text-teal-400 border border-teal-500/20 font-mono text-[9px] px-2 py-0.5 uppercase bg-teal-950/20">Paid</span>}
                      </div>
                    </div>

                    {/* Lawyer & Case Type Consolidated Mobile Node */}
                    <div className="flex items-center gap-3 bg-[#0a101d] p-3 border border-[#111927]">
                      <div className="w-9 h-9 rounded-none border border-[#1b263b] overflow-hidden bg-[#03060b] flex items-center justify-center flex-shrink-0">
                        {item.lawyerImage ? (
                          <img src={item.lawyerImage} alt={item.lawyerName} className="w-full h-full object-cover" />
                        ) : (
                          <User size={16} className="text-slate-600" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <span className="text-[9px] font-mono text-[#e0a96d] block uppercase tracking-wider">Counsel Mandate</span>
                        <span className="text-sm text-slate-200 font-serif font-medium truncate block leading-tight">{item.lawyerName || "Unknown Lawyer"}</span>
                        <span className="text-xs text-slate-400 font-sans block truncate mt-0.5 italic">{item.caseType || "General Legal Request"}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px] font-mono pt-1">
                      <div>
                        <span className="text-slate-500 block text-[9px] uppercase tracking-wider">Urgency Vector</span>
                        <span className="text-slate-300 text-xs">{item.urgency || "STANDARD"}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[9px] uppercase tracking-wider">Fee Metric</span>
                        <span className="text-[#e0a96d] text-xs">
                          ${item.pricingDetails?.amount} / {item.pricingDetails?.type}
                        </span>
                      </div>
                    </div>

                    {item.status === 'accepted' && (
                      <div className="pt-2 flex justify-end">
                        {paymentSuccessId === itemId ? (
                          <span className="text-teal-400 text-xs font-mono py-1 animate-pulse">✓ Retainer Paid</span>
                        ) : (
                          <button 
                            onClick={() => handlePayment(itemId)}
                            className="w-full text-center bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs py-2 transition-colors rounded-none font-mono uppercase tracking-wider"
                          >
                            Pay Retainer Fee
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Desktop Table Layout */}
            <div className="hidden md:block w-full overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#03060b] text-[10px] text-slate-500 uppercase tracking-wider font-mono border-b border-[#111927]">
                  <tr>
                    <th className="py-3 px-6 font-normal">Lawyer Profile & Assignment Mandate</th>
                    <th className="py-3 px-6 font-normal">Fee Metric</th>
                    <th className="py-3 px-6 font-normal">Hiring Date</th>
                    <th className="py-3 px-6 font-normal text-right">Status / Actions Target</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#111927]/60">
                  {hiringHistory.map((item) => {
                    const itemId = item._id?.$oid || item._id;
                    return (
                      <tr key={itemId} className="hover:bg-[#080f1b]/50 transition-colors">
                        
                        {/* Desktop Image + Name + Sub-Case Row Layout */}
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-4">
                            <div className="w-9 h-9 rounded-none border border-[#1b263b] overflow-hidden bg-[#03060b] flex items-center justify-center shrink-0">
                              {item.lawyerImage ? (
                                <img src={item.lawyerImage} alt={item.lawyerName} className="w-full h-full object-cover" />
                              ) : (
                                <User size={14} className="text-slate-600" />
                              )}
                            </div>
                            <div className="min-w-0">
                              <span className="text-slate-200 font-serif font-semibold block truncate text-sm leading-tight">
                                {item.lawyerName || "Unknown Lawyer"}
                              </span>
                              <span className="text-[11px] text-slate-400 block truncate font-sans mt-0.5 tracking-wide">
                                Case: <span className="text-slate-300 font-medium italic">{item.caseType || "General Retainer"}</span>
                              </span>
                            </div>
                          </div>
                        </td>

                        <td className="py-4 px-6 font-mono text-[#e0a96d]">
                          ${item.pricingDetails?.amount} ({item.pricingDetails?.type})
                        </td>
                        <td className="py-4 px-6 text-slate-400">{formatDate(item.createdAt)}</td>
                        <td className="py-4 px-6 text-right">
                          {item.status === 'pending' && <span className="text-amber-500 border border-amber-500/30 font-mono text-[10px] px-2 py-0.5 uppercase tracking-wide bg-amber-950/20 rounded-none">Pending Action</span>}
                          {item.status === 'rejected' && <span className="text-rose-500 border border-rose-500/30 font-mono text-[10px] px-2 py-0.5 uppercase tracking-wide bg-rose-950/20 rounded-none">Rejected</span>}
                          {item.status === 'paid' && <span className="text-teal-400 border border-teal-500/30 font-mono text-[10px] px-2 py-0.5 uppercase tracking-wide bg-teal-950/20 rounded-none">Paid & Secured</span>}
                          
                          {item.status === 'accepted' && (
                            <div className="flex justify-end items-center gap-3">
                              <span className="text-emerald-400 font-mono text-[10px] uppercase tracking-wide">Accepted</span>
                              {paymentSuccessId === itemId ? (
                                <span className="text-teal-400 text-[11px] font-mono animate-pulse">✓ Retainer Paid</span>
                              ) : (
                                <button 
                                  onClick={() => handlePayment(itemId)} 
                                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-[11px] px-3 py-1 transition-colors rounded-none font-mono uppercase tracking-wider"
                                >
                                  Pay Fee
                                </button>
                              )}
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default HiringHistoryTab;