"use client";
import React from 'react';
import { motion } from "framer-motion";

export const FeatureCard = ({ title, desc, icon, variants }) => {
  return (
    <motion.div
      variants={variants}
      whileHover={{ y: -4, borderColor: "rgba(251, 191, 36, 0.3)" }}
      className="p-6 border border-slate-900 bg-slate-950/20 text-left flex flex-col justify-between transition-all duration-300"
    >
      <div>
        <div className="w-10 h-10 bg-slate-950 border border-slate-900 flex items-center justify-center text-xl">
          {icon}
        </div>
        <h3 className="mt-5 text-sm font-serif text-slate-200 uppercase tracking-wide">
          {title}
        </h3>
        <p className="text-xs text-slate-400 font-light mt-2 leading-relaxed">
          {desc}
        </p>
      </div>
      <div className="mt-6 w-6 h-px bg-slate-800" />
    </motion.div>
  );
};