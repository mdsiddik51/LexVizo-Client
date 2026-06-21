"use client";

import React from "react";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaLinkedinIn,
  FaYoutube,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="relative bg-[#050811] text-gray-300 pt-20 pb-8 px-6 border-t border-[#131B2E] overflow-hidden">
      
      
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(19,27,46,0.3)_1px,transparent_1px),linear-gradient(to_bottom,rgba(19,27,46,0.3)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 relative z-10">

       
        <div className="space-y-5">
          <h2 className="text-xl font-serif tracking-wider uppercase text-gray-100">
            <span className="text-[#FCBA80]">Lex</span>vizo
          </h2>

          <p className="text-xs text-gray-400 font-light leading-relaxed max-w-xs">
            A modern decentralized legal hiring network connecting premium advocacy talent and global firms with total precision.
          </p>

        
          <div className="flex gap-2 pt-1">
            {[FaFacebookF, FaInstagram, FaTwitter, FaLinkedinIn, FaYoutube].map(
              (Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="h-8 w-8 border border-[#131B2E] bg-[#0A0F1D] text-gray-400 hover:border-[#FCBA80]/60 hover:text-[#FCBA80] flex items-center justify-center transition-all duration-200"
                >
                  <Icon className="text-xs" />
                </a>
              )
            )}
          </div>
        </div>

       
        <div>
          <h3 className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#FCBA80] mb-5">
            // INDEX CHANNELS
          </h3>

          <ul className="space-y-3 font-mono text-[11px] text-gray-500">
            <li>
              <a href="/about" className="hover:text-gray-300 transition-colors flex items-center gap-1">
                <span>&gt;</span> About Infrastructure
              </a>
            </li>
            <li>
              <a href="/contact" className="hover:text-gray-300 transition-colors flex items-center gap-1">
                <span>&gt;</span> Direct Contact
              </a>
            </li>
            <li>
              <a href="/privacy" className="hover:text-gray-300 transition-colors flex items-center gap-1">
                <span>&gt;</span> Privacy Protocol
              </a>
            </li>
          </ul>
        </div>

       
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#FCBA80]">
            // SYSTEM UPDATES
          </h3>

          <p className="text-xs text-gray-400 font-light max-w-md">
            Subscribe to index telemetry logs, premium job alert distributions, and platform scaling reports.
          </p>

          <div className="flex flex-col sm:flex-row gap-2 max-w-md pt-1">
            <input
              type="email"
              placeholder="operator@domain.com"
              className="w-full bg-[#0A0F1D] border border-[#131B2E] px-3 py-2 text-xs font-mono text-gray-200 focus:outline-none focus:border-[#FCBA80]/40 placeholder-gray-700"
            />

            <button className="bg-[#FCBA80] text-black hover:bg-[#E2A76F] px-5 py-2 text-xs font-mono tracking-wider font-bold uppercase transition-all duration-150">
              Subscribe
            </button>
          </div>

          <p className="text-[10px] font-mono text-gray-600">
            Status: Active Pipeline // No Spam. Only Core Dispatches.
          </p>
        </div>
      </div>

     
      <div className="border-t border-[#131B2E] mt-16 pt-6 flex flex-col sm:flex-row justify-between items-center text-[10px] font-mono text-gray-500 relative z-10 gap-3">
        <p>© {new Date().getFullYear()} LEXVIZO. ALL RIGHTS RESERVED.</p>
        <div className="tracking-widest text-[9px] text-gray-600 border border-zinc-900/60 px-2 py-0.5 bg-zinc-950/40">
          ELITE LEGAL NETWORK // GLOBAL INDEX TERMINAL
        </div>
      </div>
    </footer>
  );
};

export default Footer;