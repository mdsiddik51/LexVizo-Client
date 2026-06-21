"use client";
import React from "react";
import { Briefcase, EyeOff } from "lucide-react";

export const ProfileStatus = ({
  isBusy,
  hasExistingProfile,
  onChange,
}) => {
  return (
    <div className="space-y-4">
      <div
        className={`p-3 border text-xs font-mono flex items-center gap-2 ${
          isBusy
            ? "bg-red-950/20 border-red-900/40 text-red-400"
            : "bg-emerald-950/20 border-emerald-900/40 text-emerald-400"
        }`}
      >
        {isBusy ? <EyeOff size={14} /> : <Briefcase size={14} />}
        <span>
          Status:{" "}
          {isBusy
            ? "BUSY (Hidden from immediate customer direct hiring lookup queues)"
            : "OPEN FOR HIRE (Actively listed and indexed)"}
        </span>
      </div>

      <div className="p-4 border border-[#131B2E] bg-[#060A14] flex items-center justify-between">
        <div className="space-y-0.5">
          <label className="block text-[10px] font-mono uppercase tracking-widest text-gray-300">
            Set Availability Status
          </label>
          <p className="text-[11px] text-gray-500 max-w-[80%]">
            Toggle this to mark yourself busy. When active, new client consultation bookings are temporarily paused.
          </p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer select-none">
          <input
            type="checkbox"
            name="isBusy"
            disabled={hasExistingProfile}
            checked={isBusy}
            onChange={onChange}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-gray-400 after:border-zinc-700 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-900/60 peer-checked:after:bg-red-400 border border-zinc-700/60"></div>
        </label>
      </div>
    </div>
  );
};