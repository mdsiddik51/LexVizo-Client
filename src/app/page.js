"use client"
import React, { useState, useEffect, useRef } from 'react';
import { motion, useTransform, useScroll } from "framer-motion";
import {
  FaGavel,
  FaBriefcase,
  FaUsers,
  FaLightbulb,
  FaHome,
  FaFileInvoiceDollar,
} from "react-icons/fa";

const scrollContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.05 }
  }
};

const scrollItemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.215, 0.610, 0.355, 1.000] }
  }
};

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const progressRef = useRef(null);

  const { scrollY } = useScroll();
  const backgroundY = useTransform(scrollY, [0, 500], [0, 100]);
  const foregroundY = useTransform(scrollY, [0, 500], [0, -50]);

  const slides = [
    {
      id: "01",
      tagline: "CORPORATE ARCHITECTURE",
      title: "Shaping Tomorrow's",
      subtitle: "Enterprise Law.",
      description: "We provide elite counsel for high-stakes mergers, global regulatory compliance, and cross-border corporate governance.",
      methodology: "Rigorous application of data-driven analytics combined with elite transactional craftsmanship.",
      icon: (
        <svg className="w-6 h-6 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
          <rect x="3" y="3" width="18" height="18" rx="1" />
          <path d="M9 3v18M15 3v18M3 9h18M3 15h18" strokeDasharray="1 2" />
          <circle cx="9" cy="9" r="2" className="fill-amber-400/10" />
          <circle cx="15" cy="15" r="2" className="fill-amber-400/10" />
        </svg>
      ),
    },
    {
      id: "02",
      tagline: "INTELLECTUAL PROPERTY",
      title: "Defending Innovation",
      subtitle: "In A Digital Age.",
      description: "Securing patents, high-value trademarks, and proprietary technology assets for world-changing tech and biotech firms.",
      methodology: "Advanced risk mitigation models matched with aggressive global asset tracking architectures.",
      icon: (
        <svg className="w-6 h-6 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
          <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
          <path d="M12 6v12M6 12h12" strokeWidth="1" strokeDasharray="2 2" />
          <path d="M7.5 7.5l9 9M16.5 7.5l-9 9" />
        </svg>
      ),
    },
    {
      id: "03",
      tagline: "HIGH-STAKES LITIGATION",
      title: "Formidable Advocacy.",
      subtitle: "Precise Results.",
      description: "When disputes escalate, our premier trial lawyers deliver ruthless preparation, aggressive strategy, and courtroom victories.",
      methodology: "Trial-tested frameworks optimized for complex commercial arbitration and appellate defense.",
      icon: (
        <svg className="w-6 h-6 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
          <path d="M12 3v18M3 12h18" />
          <path d="M6 9l3-3 3 3M12 15l3 3 3-3" />
          <circle cx="12" cy="12" r="6" strokeDasharray="3 3" />
        </svg>
      ),
    }
  ];

  const categories = [
    { title: "Criminal Law", desc: "Defense against state and federal charges.", icon: FaGavel },
    { title: "Corporate Law", desc: "Mergers, acquisitions, and corporate governance.", icon: FaBriefcase },
    { title: "Family Law", desc: "Divorce, custody, and family estate planning.", icon: FaUsers },
    { title: "Intellectual Property", desc: "Patents, trademarks, and copyright protection.", icon: FaLightbulb },
    { title: "Real Estate Law", desc: "Commercial and residential property transactions.", icon: FaHome },
    { title: "Tax Law", desc: "Corporate taxation, IRS disputes, and structuring.", icon: FaFileInvoiceDollar },
  ];

  const features = [
    { title: "Expert Legal Guidance", desc: "Get reliable advice from experienced legal professionals across multiple practice areas.", icon: "⚖️" },
    { title: "Client-Focused Approach", desc: "We prioritize your needs and ensure every case receives personalized attention.", icon: "🤝" },
    { title: "Fast Case Resolution", desc: "Efficient strategies designed to resolve your legal matters quickly and effectively.", icon: "⏱️" },
    { title: "Trusted & Transparent", desc: "Clear communication and honest legal support you can depend on.", icon: "🔍" },
  ];

  const current = slides[currentSlide] || slides[0];

  const handleSlideChange = (nextIndex) => {
    if (isAnimating || nextIndex === currentSlide) return;
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentSlide(nextIndex);
      setIsAnimating(false);
    }, 400);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      handleSlideChange((currentSlide + 1) % slides.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [currentSlide, isAnimating]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <div className="relative w-full min-h-[90vh] md:min-h-screen bg-[#06090e] text-white overflow-hidden font-sans select-none flex flex-col justify-between">
        <motion.div style={{ y: backgroundY }} className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          <div
            className="absolute w-[140vw] sm:w-[800px] h-[800px] rounded-full bg-amber-500/5 blur-[140px] transition-all duration-1000 ease-in-out"
            style={{
              top: currentSlide === 0 ? '-10%' : currentSlide === 1 ? '20%' : '-30%',
              left: currentSlide === 0 ? '-10%' : currentSlide === 1 ? '40%' : '20%',
            }}
          />
          <div
            className="absolute w-[120vw] sm:w-[900px] h-[900px] rounded-full bg-blue-500/4 blur-[160px] transition-all duration-1000 ease-in-out"
            style={{
              bottom: currentSlide === 0 ? '-20%' : '10%',
              right: currentSlide === 0 ? '-10%' : '30%',
            }}
          />
        </motion.div>

        <div className="absolute inset-0 opacity-[0.02] pointer-events-none z-0">
          <div className="max-w-7xl mx-auto h-full w-full border-x border-white flex justify-between">
            <div className="w-px h-full bg-white" />
            <div className="w-px h-full bg-white" />
            <div className="w-px h-full bg-white" />
          </div>
        </div>

        <div className="relative z-20 max-w-7xl w-full mx-auto px-6 md:px-12 pt-8 flex justify-between items-center text-[10px] tracking-[0.4em] text-slate-500 uppercase font-mono">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            <span>Vanguard Legal Network</span>
          </div>
          <div className="hidden sm:block">On-Demand Counsel / Enterprise Access</div>
        </div>

        <motion.div style={{ y: foregroundY }} className="relative z-10 max-w-7xl w-full mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 items-center gap-12 lg:gap-16 my-auto py-12 md:py-20">
          <div className={`lg:col-span-7 space-y-6 md:space-y-8 transition-all duration-700 ease-out ${
            isAnimating ? 'opacity-0 translate-y-6 filter blur-md' : 'opacity-100 translate-y-0 filter blur-none'
          }`}>
            <div className="flex items-center gap-3">
              <div className="h-px w-8 bg-amber-400/40" />
              <span className="text-[11px] font-mono tracking-[0.35em] text-amber-400 font-semibold uppercase">
                {current.tagline}
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[5.25rem] tracking-tight font-serif leading-[1.05] text-slate-100 font-light">
              Find & Hire Expert
              <span className="block font-sans text-transparent bg-clip-text bg-gradient-to-r from-slate-200 via-slate-400 to-slate-500 font-normal mt-2 tracking-tight">
                Legal Counsel.
              </span>
            </h1>

            <p className="text-slate-400 font-light text-base md:text-lg max-w-xl leading-relaxed">
              {current.description}
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-4 sm:gap-6">
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="group relative px-8 py-4.5 bg-amber-400 text-black text-xs font-mono font-bold tracking-[0.2em] uppercase overflow-hidden transition-all duration-300 hover:bg-white shadow-2xl shadow-amber-400/10 flex justify-center items-center gap-3"
              >
                Browse Lawyers
                <svg className="w-3.5 h-3.5 transform transition-transform group-hover:translate-x-1.5 duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </motion.button>

              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="group px-8 py-4.5 border border-slate-800 bg-slate-950/40 hover:bg-slate-900 text-slate-300 hover:text-white text-xs font-mono font-medium tracking-[0.2em] uppercase transition-all duration-300 flex justify-center items-center gap-2"
              >
                Corporate Retainers
              </motion.button>
            </div>
          </div>

          <div className="hidden lg:col-span-5 lg:flex flex-col items-end justify-center">
            <div className={`w-85 h-96 border border-slate-900 bg-gradient-to-b from-slate-950/60 to-slate-950/20 backdrop-blur-xl p-8 flex flex-col justify-between relative group transition-all duration-700 ease-out hover:border-amber-400/20 shadow-3xl ${
              isAnimating ? 'opacity-0 scale-95 translate-x-4' : 'opacity-100 scale-100 translate-x-0'
            }`}>
              <div className="absolute top-0 left-0 w-4 h-px bg-slate-800 group-hover:bg-amber-400/60 transition-colors" />
              <div className="absolute top-0 left-0 w-px h-4 bg-slate-800 group-hover:bg-amber-400/60 transition-colors" />
              <div className="absolute bottom-0 right-0 w-4 h-px bg-slate-800 group-hover:bg-amber-400/60 transition-colors" />
              <div className="absolute bottom-0 right-0 w-px h-4 bg-slate-800 group-hover:bg-amber-400/60 transition-colors" />

              <div className="flex justify-between items-start">
                <div className="p-4 bg-slate-900/60 border border-slate-800 shadow-inner group-hover:border-amber-500/20 transition-colors text-amber-400">
                  {current.icon}
                </div>
                <span className="text-6xl font-mono font-thin text-slate-900 group-hover:text-slate-800 transition-colors select-none">
                  {current.id}
                </span>
              </div>

              <div className="space-y-3">
                <div className="text-[10px] tracking-[0.3em] text-amber-400 font-mono font-semibold">// FIRM DISCOVERY VETTING</div>
                <p className="text-xs text-slate-400 font-light leading-relaxed tracking-wide">
                  {current.methodology}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="relative z-20 border-t border-slate-900/60 bg-[#06090e]/80 backdrop-blur-2xl">
          <div className="max-w-7xl mx-auto px-6 py-6 md:py-8 grid grid-cols-3 gap-6 md:gap-12">
            {slides.map((slide, index) => {
              const isActive = index === currentSlide;
              return (
                <div
                  key={slide.id}
                  onClick={() => handleSlideChange(index)}
                  className="cursor-pointer group relative pt-4 flex flex-col gap-2 transition-all duration-300"
                >
                  <div className="absolute top-0 left-0 w-full h-px bg-slate-900 group-hover:bg-slate-800/80 transition-colors">
                    <div
                      ref={isActive ? progressRef : null}
                      className={`h-0.5 bg-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.6)] rounded-full transition-all ease-linear ${
                        isActive ? 'w-full duration-[7000ms]' : 'w-0 duration-0'
                      }`}
                    />
                  </div>

                  <div className="flex items-center justify-between sm:justify-start sm:gap-4">
                    <span className={`font-mono text-xs tracking-wider transition-colors duration-300 ${isActive ? 'text-amber-400 font-bold' : 'text-slate-600 group-hover:text-slate-400'}`}>
                      {slide.id}
                    </span>
                    <span className={`text-[10px] sm:text-xs tracking-[0.2em] uppercase font-mono font-semibold transition-colors duration-300 ${isActive ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'}`}>
                      {slide.tagline.split(' ')[0]}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <section className="py-24 px-6 bg-[#0B0F17]">
        <div className="max-w-7xl mx-auto">
          <motion.h2 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-3xl font-light mb-10 text-slate-100 tracking-tight"
          >
            Legal Expertise Areas
          </motion.h2>

          <motion.div 
            variants={scrollContainerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {categories.map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={i}
                  variants={scrollItemVariants}
                  whileHover={{ scale: 1.03, borderColor: "rgba(251, 191, 36, 0.4)", backgroundColor: "rgba(255,255,255,0.07)" }}
                  whileTap={{ scale: 0.98 }}
                  className="p-6 border border-slate-800 bg-white/5 cursor-pointer transition-colors duration-300 group"
                >
                  <Icon className="text-amber-400 text-xl transition-transform duration-300 group-hover:scale-110" />
                  <h3 className="mt-4 text-lg font-medium text-slate-200">{item.title}</h3>
                  <p className="text-slate-400 text-sm mt-2 font-light">{item.desc}</p>
                  <div className="h-0.5 w-0 group-hover:w-full bg-amber-400 transition-all duration-300 mt-4" />
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      <section className="w-full relative py-24 px-6 bg-[#070A10] text-white overflow-hidden">
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.span 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="px-5 py-1 text-[11px] tracking-[0.3em] uppercase border border-amber-400/30 text-amber-300 rounded-full font-mono"
          >
            Trusted Legal Excellence
          </motion.span>

          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-6 text-5xl font-light tracking-tight"
          >
            Why Clients Choose <span className="text-amber-400 font-normal">Lexvizo</span>
          </motion.h2>

          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-5 text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed font-light"
          >
            Precision-driven legal solutions crafted for individuals and businesses who demand results, clarity, and institutional-level trust.
          </motion.p>

          <motion.div 
            variants={scrollContainerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {features.map((item, index) => (
              <motion.div
                key={index}
                variants={scrollItemVariants}
                whileHover={{ y: -10, borderColor: "rgba(251, 191, 36, 0.5)" }}
                className="group relative p-6 bg-white/5 backdrop-blur-xl border border-white/10 transition-colors duration-300 cursor-pointer"
              >
                <div className="absolute inset-0 bg-amber-400/0 group-hover:bg-amber-400/5 transition-colors duration-300" />
                <div className="relative z-10">
                  <div className="text-3xl transition-transform duration-300 group-hover:scale-115 inline-block">{item.icon}</div>
                  <h3 className="mt-4 text-lg font-medium text-white group-hover:text-amber-400 transition-colors">{item.title}</h3>
                  <p className="mt-2 text-sm text-slate-400 leading-relaxed font-light">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </motion.div>
  );
};

export default Home;