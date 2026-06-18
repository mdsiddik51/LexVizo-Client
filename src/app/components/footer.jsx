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
    <footer className="relative bg-[#070A12] text-white pt-24 pb-10 px-6 overflow-hidden">

      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(212,175,55,0.15),transparent_40%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_60%,rgba(212,175,55,0.10),transparent_45%)]"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:60px_60px]"></div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-14 relative z-10">

        <div className="space-y-6">
          <h2 className="text-3xl font-serif tracking-wide">
            <span className="text-[#D4AF37]">Lex</span>vizo
          </h2>

          <p className="text-sm text-white/70 leading-relaxed">
            A modern legal hiring platform connecting top-tier lawyers and firms
            with precision, trust, and global reach.
          </p>

          <div className="flex gap-3 pt-2">
            {[FaFacebookF, FaInstagram, FaTwitter, FaLinkedinIn, FaYoutube].map(
              (Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="h-10 w-10 rounded-md border border-[#D4AF37]/30 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black flex items-center justify-center transition-all duration-300"
                >
                  <Icon className="text-sm" />
                </a>
              )
            )}
          </div>
        </div>

        <div>
          <h3 className="text-sm tracking-[0.2em] text-[#D4AF37] mb-6">
            QUICK LINKS
          </h3>

          <ul className="space-y-4 text-white/70 text-sm">
            <li>
              <a href="/about" className="hover:text-[#D4AF37] transition">
                About
              </a>
            </li>
            <li>
              <a href="/contact" className="hover:text-[#D4AF37] transition">
                Contact
              </a>
            </li>
            <li>
              <a href="/privacy" className="hover:text-[#D4AF37] transition">
                Privacy Policy
              </a>
            </li>
          </ul>
        </div>

        <div className="lg:col-span-2 space-y-5">
          <h3 className="text-sm tracking-[0.2em] text-[#D4AF37]">
            NEWSLETTER SIGNUP
          </h3>

          <p className="text-sm text-white/70">
            Subscribe to receive legal hiring updates, premium job alerts, and industry insights.
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-md text-white placeholder-white/40 focus:outline-none focus:border-[#D4AF37]"
            />

            <button className="px-6 py-3 bg-[#D4AF37] text-black font-semibold rounded-md hover:bg-yellow-500 transition">
              Subscribe
            </button>
          </div>

          <p className="text-xs text-white/40">
            No spam. Only relevant opportunities.
          </p>
        </div>
      </div>

      <div className="border-t border-white/10 mt-16 pt-6 text-center text-xs text-white/50 relative z-10">
        <p>© {new Date().getFullYear()} Lexvizo. All rights reserved.</p>
        <p className="mt-2 tracking-widest">
          ELITE LEGAL NETWORK • GLOBAL HIRING PLATFORM
        </p>
      </div>
    </footer>
  );
};

export default Footer;