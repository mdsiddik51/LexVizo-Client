"use client";
import React, { useState } from "react";
import {
  LayoutGrid,
  History,
  User,
  Plus,
  FileText,
  Calendar,
  Search,
  Bell,
  HelpCircle,
  Edit2,
  Trash2,
  Save,
  ArrowRight,
} from "lucide-react";

export default function LawyerDashboard() {
  const [activeMenu, setActiveMenu] = useState("profile"); 
  const [profileImg, setProfileImg] = useState(
    "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=150",
  );
  const [showUrlInput, setShowUrlInput] = useState(false);

  return (
    <div className="min-h-screen bg-[#050811] text-white flex font-sans selection:bg-[#E2A76F]/30">
      
      <aside className="w-64 shrink-0 border-r border-[#131B2E] bg-[#050811] flex flex-col justify-between p-4 min-h-screen">
        <div>
          
          <div className="pt-4 pb-8 px-2">
            <h1 className="text-xl font-serif tracking-wider text-[#FCBA80]">
              LexVizo
            </h1>
            <p className="text-[9px] font-mono tracking-[0.3em] text-[#637599] uppercase mt-0.5">
              Legal Management
            </p>
          </div>

          <nav className="flex flex-col gap-1">
            <button
              onClick={() => setActiveMenu("dashboard")}
              className={`flex items-center gap-3 px-3 py-2.5 text-xs font-mono tracking-wider uppercase transition-all rounded-none ${activeMenu === "dashboard" ? "bg-[#0E1526] text-[#FCBA80] border-l-2 border-[#FCBA80]" : "text-gray-400 hover:text-white hover:bg-[#0A0F1D]"}`}
            >
              <LayoutGrid size={15} /> Dashboard
            </button>
            <button
              onClick={() => setActiveMenu("history")}
              className={`flex items-center gap-3 px-3 py-2.5 text-xs font-mono tracking-wider uppercase transition-all rounded-none ${activeMenu === "history" ? "bg-[#0E1526] text-[#FCBA80] border-l-2 border-[#FCBA80]" : "text-gray-400 hover:text-white hover:bg-[#0A0F1D]"}`}
            >
              <History size={15} /> Hiring History
            </button>
            <button
              onClick={() => setActiveMenu("profile")}
              className={`flex items-center gap-3 px-3 py-2.5 text-xs font-mono tracking-wider uppercase transition-all rounded-none ${activeMenu === "profile" ? "bg-[#0E1526] text-[#FCBA80] border-l-2 border-[#FCBA80]" : "text-gray-400 hover:text-white hover:bg-[#0A0F1D]"}`}
            >
              <User size={15} /> Manage Profile
            </button>
          </nav>
        </div>

        <div className="flex flex-col gap-4 border-t border-[#131B2E] pt-4">
          <button className="w-full bg-[#FCBA80] text-black hover:bg-[#E2A76F] py-2.5 text-xs uppercase font-mono tracking-widest font-bold flex items-center justify-center gap-2 transition-all">
            <Plus size={14} strokeWidth={3} /> New Case
          </button>

          <div className="flex items-center gap-3 px-2">
            <div className="w-9 h-9 bg-zinc-800 border border-[#FCBA80]/40 overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=100"
                alt="Avatar"
                className="w-full h-full object-cover object-top"
              />
            </div>
            <div>
              <div className="text-xs font-mono tracking-wide text-white">
                Alexander Reed
              </div>
              <div className="text-[9px] font-mono text-[#637599] uppercase">
                Senior Partner
              </div>
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
            <div className="flex items-center gap-6 text-xs text-gray-300 font-light">
              <a
                href="#docs"
                className="hover:text-[#FCBA80] flex items-center gap-1.5 transition-all"
              >
                <FileText size={14} /> Documents
              </a>
              <a
                href="#cal"
                className="hover:text-[#FCBA80] flex items-center gap-1.5 transition-all"
              >
                <Calendar size={14} /> Calendar
              </a>
              <a
                href="#research"
                className="hover:text-[#FCBA80] transition-all"
              >
                Research
              </a>
            </div>
            <div className="flex items-center gap-4 text-gray-400 border-l border-[#131B2E] pl-6">
              <button className="hover:text-white relative">
                <Bell size={16} />
                <span className="absolute top-0 right-0 w-1.5 h-1.5 bg-[#FCBA80] rounded-full" />
              </button>
              <button className="hover:text-white">
                <HelpCircle size={16} />
              </button>
              <div className="w-7 h-7 bg-zinc-800 border border-[#131B2E] overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=100"
                  alt="Avatar"
                  className="w-full h-full object-cover object-top"
                />
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-8 overflow-y-auto max-w-7xl w-full mx-auto space-y-6">
          {activeMenu === "history" && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <div className="text-[10px] font-mono tracking-widest text-[#637599] mb-1">
                  DASHBOARD &gt; HIRING HISTORY
                </div>
                <h2 className="text-3xl font-serif text-white tracking-wide">
                  Hiring Requests
                </h2>
                <p className="text-xs text-gray-400 mt-1 font-light">
                  Review and manage pending legal engagement requests from
                  potential clients.
                </p>
              </div>

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
                        <th className="py-3 px-4 font-normal text-right">
                          Actions
                        </th>
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
                              <div className="text-white font-medium">
                                {row.name}
                              </div>
                              <div className="text-[10px] text-gray-500 font-mono mt-0.5">
                                {row.email}
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4 text-gray-300">
                            {row.type}
                          </td>
                          <td className="py-4 px-4 text-gray-400 font-mono">
                            {row.date}
                          </td>
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
                    <span className="text-[#FCBA80]">12%</span> in the London
                    sector this quarter.
                  </p>
                </div>

                <div className="border border-[#131B2E] bg-[#090D1A]/40 p-6 flex flex-col justify-between border-l-2 border-l-[#FCBA80]">
                  <div>
                    <div className="text-xs font-mono text-[#FCBA80] tracking-wider uppercase mb-3 flex items-center gap-2">
                      💡 Pro Tip
                    </div>
                    <p className="text-xs text-gray-400 italic font-light leading-relaxed">
                      "Accepted requests with 'High' urgency are typically
                      converted to active retainers 40% faster when handled
                      within 2 hours."
                    </p>
                  </div>
                  <button className="text-[10px] font-mono text-[#FCBA80] tracking-widest uppercase flex items-center gap-2 hover:text-white transition-all pt-4">
                    View Response Guidelines <ArrowRight size={12} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeMenu === "profile" && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h2 className="text-2xl font-serif text-[#FCBA80] tracking-wide">
                  Manage Legal Profile
                </h2>
                <p className="text-xs text-gray-400 mt-1 font-light">
                  Configure your professional public-facing information and
                  service catalogue.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                <div className="lg:col-span-2 border border-[#131B2E] bg-[#090D1A]/40 p-6 space-y-5 relative">
                  <div className="flex justify-between items-center border-b border-[#131B2E] pb-3">
                    <h3 className="text-sm font-mono uppercase tracking-wider text-[#FCBA80]">
                      Professional Information
                    </h3>
                    <span className="text-[9px] font-mono tracking-widest text-gray-400 border border-zinc-800 px-1.5 py-0.5 bg-zinc-800/40">
                      DRAFT SAVED
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-[9px] font-mono uppercase tracking-widest text-gray-400">
                        Full Legal Name
                      </label>
                      <input
                        type="text"
                        defaultValue="Alexander Reed, Esq."
                        className="w-full bg-[#0A0F1D] border border-[#131B2E] px-3 py-2 text-xs text-gray-200 font-light focus:outline-none focus:border-[#FCBA80]/40"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-[9px] font-mono uppercase tracking-widest text-gray-400">
                        Primary Specialization
                      </label>
                      <select className="w-full bg-[#0A0F1D] border border-[#131B2E] px-3 py-2 text-xs text-gray-200 font-light focus:outline-none focus:border-[#FCBA80]/40 appearance-none rounded-none">
                        <option>Corporate Law</option>
                        <option>Intellectual Property</option>
                        <option>Litigation</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-[9px] font-mono uppercase tracking-widest text-gray-400">
                      Professional Bio
                    </label>
                    <textarea
                      rows={4}
                      defaultValue="Senior Partner with over 15 years of experience in high-stakes corporate litigation and strategic consulting for Fortune 500 companies."
                      className="w-full bg-[#0A0F1D] border border-[#131B2E] px-3 py-2 text-xs text-gray-300 font-light leading-relaxed focus:outline-none focus:border-[#FCBA80]/40 resize-none"
                    />
                  </div>

                  <div className="pt-2 flex items-end justify-between gap-4">
                    <div className="space-y-1.5 w-44">
                      <label className="block text-[9px] font-mono uppercase tracking-widest text-gray-400">
                        Base Hourly Fee (USD)
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-2 text-xs text-gray-500 font-mono">
                          $
                        </span>
                        <input
                          type="text"
                          defaultValue="450"
                          className="w-full bg-[#0A0F1D] border border-[#131B2E] pl-7 pr-3 py-2 text-xs text-gray-200 font-mono focus:outline-none focus:border-[#FCBA80]/40"
                        />
                      </div>
                    </div>
                    <button className="bg-[#FCBA80] text-black hover:bg-[#E2A76F] px-5 py-2 text-xs font-mono tracking-wider font-bold flex items-center gap-2 transition-all">
                      <Save size={14} /> Update Profile Details
                    </button>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="border border-[#131B2E] bg-[#090D1A]/40 p-6 flex flex-col items-center text-center space-y-4">
                    <h3 className="w-full text-left text-sm font-mono uppercase tracking-wider text-[#FCBA80] border-b border-[#131B2E] pb-3">
                      Profile Image
                    </h3>

                    <div className="p-4 border border-dashed border-[#131B2E] w-full flex flex-col items-center justify-center bg-[#050811] transition-all">
                      <div
                        onClick={() => setShowUrlInput(!showUrlInput)}
                        className="w-28 h-32 bg-zinc-800 border border-zinc-700 relative group cursor-pointer overflow-hidden hover:border-[#FCBA80]/60 transition-colors"
                      >
                        <img
                          src={profileImg}
                          alt="Avatar Detail"
                          className="w-full h-full object-cover object-top transition-transform group-hover:scale-105 duration-300"
                        />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-opacity duration-200">
                          <span className="text-[10px] font-mono text-[#FCBA80] uppercase tracking-wider font-medium">
                            Update Link
                          </span>
                        </div>
                      </div>

                      <span
                        onClick={() => setShowUrlInput(!showUrlInput)}
                        className="text-[9px] font-mono uppercase tracking-widest text-gray-300 mt-4 cursor-pointer hover:text-[#FCBA80] transition-colors selection:bg-transparent"
                      >
                        {showUrlInput
                          ? "Collapse Input Box"
                          : "Click to change photo"}
                      </span>

                      {showUrlInput && (
                        <div className="w-full mt-4 pt-3 border-t border-[#131B2E]/60 space-y-2 animate-fade-in">
                          <label className="block text-left text-[8px] font-mono uppercase tracking-widest text-gray-400">
                            Direct Image Link (e.g. imgBB)
                          </label>
                          <input
                            type="text"
                            value={profileImg}
                            onChange={(e) => setProfileImg(e.target.value)}
                            placeholder="https://i.ibb.co/..."
                            className="w-full bg-[#0A0F1D] border border-[#131B2E] px-2 py-1.5 text-[11px] text-gray-200 font-mono focus:outline-none focus:border-[#FCBA80]/50 placeholder-gray-700 transition-colors"
                          />
                          <p className="text-[8px] font-mono text-gray-500 text-left leading-normal">
                            Paste your direct preview link here. The image
                            window updates live.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="border border-[#131B2E] bg-[#090D1A]/40 p-5 relative border-l-2 border-l-[#FCBA80]">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[9px] font-mono uppercase tracking-widest text-[#FCBA80]">
                        Profile Status
                      </span>
                      <span className="text-[8px] font-mono text-green-400 bg-green-500/10 px-1 py-0.5 font-bold uppercase">
                        Active
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 font-light leading-relaxed">
                      Your profile is currently visible to the global legal
                      network. You have{" "}
                      <span className="text-white font-medium">
                        4 pending inquiries
                      </span>
                      .
                    </p>
                  </div>
                </div>
              </div>

              <div className="border border-[#131B2E] bg-[#090D1A]/40 p-6">
                <div className="flex justify-between items-center border-b border-[#131B2E] pb-4 mb-4">
                  <div>
                    <h3 className="text-sm font-serif text-[#FCBA80] tracking-wide">
                      Service Catalogue
                    </h3>
                    <p className="text-[11px] text-gray-400 font-light mt-0.5">
                      Define and manage the specific legal services you offer to
                      clients.
                    </p>
                  </div>
                  <button className="bg-transparent border border-[#131B2E] text-xs font-mono uppercase text-[#FCBA80] tracking-widest px-4 py-2 hover:bg-[#0E1526] transition-all flex items-center gap-1.5">
                    <Plus size={14} /> Add Service
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-[#131B2E] text-[9px] font-mono text-gray-400 tracking-widest uppercase">
                        <th className="py-3 px-4 font-normal">Service Name</th>
                        <th className="py-3 px-4 font-normal">
                          Specialization
                        </th>
                        <th className="py-3 px-4 font-normal">Fee Structure</th>
                        <th className="py-3 px-4 font-normal text-right">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#131B2E]/40 text-xs font-light">
                      {[
                        {
                          title: "M&A Strategic Advisory",
                          spec: "Corporate Law",
                          fee: "$550 / hr",
                        },
                        {
                          title: "IP Portfolio Management",
                          spec: "Intellectual Property",
                          fee: "$425 / hr",
                        },
                        {
                          title: "Pre-Litigation Consultation",
                          spec: "Litigation",
                          fee: "$350 / session",
                        },
                        {
                          title: "Shareholder Agreement Review",
                          spec: "Corporate Law",
                          fee: "$1,200 Flat",
                        },
                      ].map((service, idx) => (
                        <tr
                          key={idx}
                          className="hover:bg-[#0A0F1D]/40 transition-colors"
                        >
                          <td className="py-4 px-4 text-white font-medium">
                            {service.title}
                          </td>
                          <td className="py-4 px-4">
                            <span className="text-[9px] font-mono text-gray-400 bg-[#0E1526] px-2 py-0.5 border border-zinc-800">
                              {service.spec}
                            </span>
                          </td>
                          <td className="py-4 px-4 font-mono text-gray-300">
                            {service.fee}
                          </td>
                          <td className="py-4 px-4 text-right">
                            <div className="flex justify-end gap-3 text-gray-400">
                              <button className="hover:text-[#FCBA80]">
                                <Edit2 size={13} />
                              </button>
                              <button className="hover:text-red-400">
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeMenu !== "profile" && activeMenu !== "history" && (
            <div className="border border-[#131B2E] bg-[#090D1A]/40 p-12 text-center space-y-3 animate-fade-in">
              <h3 className="text-lg font-serif text-[#FCBA80] uppercase tracking-wider">
                System Node: {activeMenu}
              </h3>
              <p className="text-xs text-gray-400 font-light max-w-sm mx-auto leading-relaxed">
                This segment infrastructure is currently initializing. Select
                "Hiring History" or "Manage Profile" to view completed layouts.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}