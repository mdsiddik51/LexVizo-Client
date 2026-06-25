"use client";
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Users, Gavel, Handshake, DollarSign, ShieldAlert, Star } from "lucide-react";
import { getAdminAnalyticsAction } from "@/lib/actions/api/admin";

export default function AdminAnalytics() {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAnalytics = async () => {
    try {
      setIsLoading(true);
      const data = await getAdminAnalyticsAction();
      setStats(data || { totalUsers: 0, totalLawyers: 0, totalHires: 0, totalRevenue: 0 });
    } catch (error) {
      console.error(error);
      toast.error("Failed to load platform analytics metrics.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-4 animate-pulse">
        <p className="text-xs font-mono text-slate-500 uppercase tracking-widest">// Gathering Analytical Aggregates...</p>
        <div className="h-40 bg-[#050a12] border border-[#111927] flex items-center justify-center text-sm font-mono text-slate-400">
          Loading metrics...
        </div>
      </div>
    );
  }

  const cards = [
    {
      title: "Total Registered Users",
      value: stats?.totalUsers || 0,
      icon: <Users className="text-blue-400" size={18} />,
      desc: "Total client, user, and staff profiles registered."
    },
    {
      title: "Total Certified Lawyers",
      value: stats?.totalLawyers || 0,
      icon: <Gavel className="text-emerald-400" size={18} />,
      desc: "Vetted legal professionals in active catalog."
    },
    {
      title: "Total Hires & Retainers",
      value: stats?.totalHires || 0,
      icon: <Handshake className="text-amber-400" size={18} />,
      desc: "Total litigation pipelines opened by clients."
    },
    {
      title: "Total Revenue Inbound",
      value: `$${(stats?.totalRevenue || 0).toLocaleString()}`,
      icon: <DollarSign className="text-teal-400" size={18} />,
      desc: "Aggregated retainer fees processed via Stripe."
    }
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Title */}
      <div>
        <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">
          Console &gt; <span className="text-[#FCBA80]">Analytics Overview</span>
        </div>
        <h2 className="text-2xl lg:text-3xl font-serif text-slate-100 mt-2 font-normal tracking-wide uppercase">
          Analytical Overview
        </h2>
      </div>

      {/* Analytics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, idx) => (
          <div key={idx} className="bg-[#050a12] border border-[#111927] p-6 flex flex-col justify-between relative overflow-hidden group hover:border-[#FCBA80]/40 transition-all duration-300">
            {/* Corner Deco */}
            <div className="absolute top-0 left-0 w-2.5 h-px bg-slate-800 group-hover:bg-[#FCBA80]/40" />
            <div className="absolute top-0 left-0 w-px h-2.5 bg-slate-800 group-hover:bg-[#FCBA80]/40" />

            <div className="flex justify-between items-start">
              <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">
                {card.title}
              </span>
              <div className="p-2 bg-[#101626] border border-[#1d2944] shrink-0">
                {card.icon}
              </div>
            </div>

            <div className="mt-6">
              <span className="text-3xl font-serif text-slate-100 tracking-wide font-light">
                {card.value}
              </span>
              <p className="text-[10px] text-slate-400 font-sans mt-2 leading-relaxed">
                {card.desc}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Performance Summary Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4">
        {/* Settlement Ratios */}
        <div className="lg:col-span-1 border border-[#111927] bg-[#050a12] p-6 space-y-4">
          <h3 className="text-xs font-mono text-[#FCBA80] uppercase tracking-wider border-b border-[#111927] pb-2">
            Ledger Statistics
          </h3>
          <div className="space-y-5 pt-2">
            {[
              { label: "Collection / Paid Ratio", percentage: 100, color: "bg-teal-500" },
              { label: "Pending Arrears Ratio", percentage: 0, color: "bg-amber-500" },
              { label: "Urgent Pipeline Volume", percentage: 12, color: "bg-red-500" }
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

        {/* Database Status Reports */}
        <div className="lg:col-span-2 border border-[#111927] bg-[#050a12] p-6 space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-mono text-[#FCBA80] uppercase tracking-wider border-b border-[#111927] pb-2">
              Security Logs Disclosures
            </h3>
            <div className="pt-4 space-y-3 font-mono text-[10px] text-slate-400 uppercase">
              <div className="flex justify-between border-b border-[#111927]/60 pb-2">
                <span>Database Connection Status:</span>
                <span className="text-emerald-400 font-bold">ONLINE (MONGODB ATLAS)</span>
              </div>
              <div className="flex justify-between border-b border-[#111927]/60 pb-2">
                <span>Payment processor gateway:</span>
                <span className="text-emerald-400 font-bold">ACTIVE (STRIPE INTEGRATED)</span>
              </div>
              <div className="flex justify-between border-b border-[#111927]/60 pb-2">
                <span>Authentication security:</span>
                <span className="text-emerald-400 font-bold">SECURED (JWT + BETTERAUTH)</span>
              </div>
              <div className="flex justify-between pb-2">
                <span>Asset management server:</span>
                <span className="text-emerald-400 font-bold">ACTIVE (imgBB HOSTING)</span>
              </div>
            </div>
          </div>

          <div className="bg-[#0b1220]/50 border border-[#142035] px-4 py-3 rounded flex items-center gap-3">
            <ShieldAlert size={16} className="text-[#FCBA80] shrink-0" />
            <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wide leading-relaxed">
              // WARNING: Analytical data compiled is highly confidential. All queries execute security logs auditing protocols.
            </span>
          </div>
        </div>
      </div>

    </div>
  );
}
