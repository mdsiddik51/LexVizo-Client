"use client";
import React from 'react';
import { motion } from "framer-motion";

export const CategoryCard = ({ title, desc, icon: Icon, variants }) => {
  return (
    <motion.div
      variants={variants}
      whileHover={{ 
        borderColor: "rgba(251, 191, 36, 0.3)", 
        backgroundColor: "rgba(7, 10, 16, 0.5)" 
      }}
      className="p-6 border border-slate-900 bg-slate-950/20 transition-all duration-300 group flex flex-col justify-between relative cursor-pointer"
    >
      <div>
        <div className="w-10 h-10 bg-slate-950 border border-slate-900 flex items-center justify-center text-slate-400 group-hover:border-amber-400/20 group-hover:text-amber-400 transition-colors">
          <Icon size={16} className="stroke-1" />
        </div>
        <h3 className="mt-5 text-sm font-serif text-slate-200 uppercase tracking-wide group-hover:text-amber-400 transition-colors">
          {title}
        </h3>
        <p className="text-xs text-slate-400 font-light mt-2 leading-relaxed">
          {desc}
        </p>
      </div>
      <div className="pt-4 mt-4 border-t border-slate-900/60 flex justify-end">
        <span className="text-[9px] font-mono uppercase text-slate-500 group-hover:text-amber-400 transition-colors">
          // View Field
        </span>
      </div>
    </motion.div>
  );
};