"use client";
import React from "react";
import { ArrowRight } from "lucide-react";

const  HiringHistory = () =>  {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <div className="text-[10px] font-mono tracking-widest text-[#637599] mb-1">
          DASHBOARD &gt; HIRING HISTORY
        </div>
        <h2 className="text-3xl font-serif text-white tracking-wide">
          Hiring Requests
        </h2>
        <p className="text-xs text-gray-400 mt-1 font-light">
          Review and manage pending legal engagement requests from potential clients.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Requests", val: "124" },
          { label: "Pending Action", val: "08", highlight: true },
          { label: "Acceptance Rate", val: "92%" },
          { label: "Avg. Response Time", val: "4.2h" },
        ].map((stat, idx) => (
          <div
            key={idx}
            className={`border border-[#131B2E] bg-[#090D1A]/40 p-5 ${stat.highlight ? "border-[#FCBA80]/60" : ""}`}
          >
            <div className="text-[9px] font-mono uppercase tracking-widest text-gray-400">
              {stat.label}
            </div>
            <div
              className={`text-2xl font-serif mt-2 ${stat.highlight ? "text-[#FCBA80]" : "text-white"}`}
            >
              {stat.val}
            </div>
          </div>
        ))}
      </div>

      {/* Pipeline Table */}
      <div className="border border-[#131B2E] bg-[#090D1A]/40 overflow-hidden">
        <div className="bg-[#FCBA80] text-black px-4 py-2.5 text-xs font-mono uppercase tracking-widest font-bold flex justify-between items-center">
          <span>Active Hiring Pipeline</span>
          <span className="text-[9px] font-mono font-light text-black/70">
            Last Updated: Just Now
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#131B2E] text-[9px] font-mono text-gray-400 tracking-widest uppercase">
                <th className="py-3 px-4 font-normal">Client Name</th>
                <th className="py-3 px-4 font-normal">Case Type</th>
                <th className="py-3 px-4 font-normal">Request Date</th>
                <th className="py-3 px-4 font-normal">Urgency</th>
                <th className="py-3 px-4 font-normal text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#131B2E]/60 text-xs font-light">
              {[
                {
                  name: "Eleanor Vance",
                  email: "eleanor.v@corporate.com",
                  type: "Corporate Litigation",
                  date: "Oct 24, 2023",
                  urgency: "HIGH",
                },
                {
                  name: "Julian Blackwood",
                  email: "j.blackwood@nexus.io",
                  type: "Intellectual Property",
                  date: "Oct 23, 2023",
                  urgency: "STANDARD",
                },
                {
                  name: "Sophia Chen",
                  email: "s.chen@techglobal.net",
                  type: "M&A Advisory",
                  date: "Oct 22, 2023",
                  urgency: "STANDARD",
                },
                {
                  name: "Marcus Wright",
                  email: "m.wright@estate.co",
                  type: "Real Estate Dispute",
                  date: "Oct 21, 2023",
                  urgency: "HIGH",
                },
              ].map((row, i) => (
                <tr
                  key={i}
                  className="hover:bg-[#0A0F1D]/60 transition-colors"
                >
                  <td className="py-4 px-4 flex items-center gap-3">
                    <div className="w-8 h-8 bg-[#121A2D] text-[#FCBA80] border border-zinc-800 flex items-center justify-center font-mono font-semibold text-xs">
                      {row.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <div>
                      <div className="text-white font-medium">{row.name}</div>
                      <div className="text-[10px] text-gray-500 font-mono mt-0.5">
                        {row.email}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-gray-300">{row.type}</td>
                  <td className="py-4 px-4 text-gray-400 font-mono">{row.date}</td>
                  <td className="py-4 px-4">
                    <span
                      className={`text-[8px] font-mono px-1.5 py-0.5 border font-semibold tracking-wider ${row.urgency === "HIGH" ? "text-red-400 bg-red-500/5 border-red-500/20" : "text-blue-400 bg-blue-500/5 border-blue-500/20"}`}
                    >
                      {row.urgency}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <div className="flex justify-end gap-2 font-mono text-[10px]">
                      <button className="border border-zinc-800 px-3 py-1 hover:bg-zinc-900 transition-all text-gray-300">
                        Reject
                      </button>
                      <button className="bg-[#FCBA80] text-black px-3 py-1 hover:bg-[#E2A76F] font-bold transition-all">
                        Accept
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bottom Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 border border-[#131B2E] bg-[#090D1A]/40 p-6 relative min-h-[220px]">
          <h4 className="text-sm font-serif text-white tracking-wide border-b border-[#131B2E] pb-2 mb-4">
            Regional Demand
          </h4>
          <div className="flex justify-around items-end h-24 pt-4 font-mono text-[9px] text-gray-400">
            <div className="flex flex-col items-center gap-2">
              <div className="w-8 h-12 bg-[#121A2D]" />
              NYC
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-8 h-16 bg-[#FCBA80]/80" />
              LDN
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-8 h-8 bg-[#121A2D]" />
              SGP
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-8 h-10 bg-[#121A2D]" />
              TKO
            </div>
          </div>
          <p className="text-[11px] text-gray-400 mt-6 font-light">
            Hiring interest has increased by{" "}
            <span className="text-[#FCBA80]">12%</span> in the London sector this quarter.
          </p>
        </div>

        <div className="border border-[#131B2E] bg-[#090D1A]/40 p-6 flex flex-col justify-between border-l-2 border-l-[#FCBA80]">
          <div>
            <div className="text-xs font-mono text-[#FCBA80] tracking-wider uppercase mb-3 flex items-center gap-2">
              💡 Pro Tip
            </div>
            <p className="text-xs text-gray-400 italic font-light leading-relaxed">
              "Accepted requests with 'High' urgency are typically converted to active retainers 40% faster when handled within 2 hours."
            </p>
          </div>
          <button className="text-[10px] font-mono text-[#FCBA80] tracking-widest uppercase flex items-center gap-2 hover:text-white transition-all pt-4">
            View Response Guidelines <ArrowRight size={12} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default HiringHistory;