"use client";
import React, { useState } from "react";
import {
  LayoutGrid,
  History,
  User,
  Plus,
  Search,
  Bell,
  HelpCircle,
} from "lucide-react";

// Component Imports
import HiringHistory from "@/app/components/Dashboard/lawyer/hirehistory";
import ManageProfile from "@/app/components/Dashboard/lawyer/manageprofile";

const  LawyerDashboard = () => {
  const [activeMenu, setActiveMenu] = useState("dashboard");

  return (
    <div className="min-h-screen bg-[#050811] text-white flex font-sans selection:bg-[#E2A76F]/30">
      {/* Sidebar Layout */}
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

      {/* Main Content Layout */}
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
          {activeMenu === "history" && <HiringHistory />}

          {activeMenu === "profile" && <ManageProfile />}

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

export default LawyerDashboard;