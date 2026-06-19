"use client";

import Link from "next/link";
import { Scale, ArrowLeft } from "lucide-react";

const NotFound = () => {
  return (
   
    <section className="relative min-h-screen overflow-hidden bg-[#07090e] flex items-center justify-center px-6 font-sans">
      
     
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-125 h-125 bg-blue-950/10 blur-3xl rounded-full pointer-events-none" />

     
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-size-[70px_70px] pointer-events-none" />

      <div className="relative z-10 max-w-2xl w-full text-center">
        
       
        <div className="flex justify-center mb-6">
          <div className="p-4 border border-[#d4af37]/30 bg-[#d4af37]/5 text-[#d4af37]">
            <Scale className="text-4xl" strokeWidth={1.5} />
          </div>
        </div>

       
        <h1 className="text-7xl md:text-9xl font-light tracking-tight text-white/90">
          404
        </h1>

       
        <h2 className="mt-4 text-3xl md:text-5xl font-serif font-light tracking-tight text-white">
          Jurisdiction Lost<span className="text-[#d4af37]">.</span>
        </h2>

       
        <p className="mt-5 text-zinc-400 text-base md:text-lg font-light leading-relaxed max-w-xl mx-auto">
          The resource you are trying to reach does not exist, has been permanently expunged, or was never part of the official record.
        </p>

        
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-6">
          
         
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 bg-white text-[#07090e] font-semibold text-xs tracking-[0.15em] uppercase hover:bg-zinc-200 transition-colors duration-200"
          >
            Return Home
          </Link>

          <button
            type="button"
            onClick={() => typeof window !== "undefined" && window.history.back()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 border border-white/10 bg-white/2 text-zinc-400 font-semibold text-xs tracking-[0.15em] uppercase hover:bg-white/5 hover:text-white transition-all duration-200"
          >
            <ArrowLeft size={14} strokeWidth={2} />
            Go Back
          </button>
        </div>

       
        <p className="mt-12 text-[11px] tracking-[0.2em] text-[#d4af37] font-medium uppercase">
          // Error Code: 404_NOT_FOUND
        </p>
      </div>
    </section>
  );
};

export default NotFound;