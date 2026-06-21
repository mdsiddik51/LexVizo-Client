"use client";
import React, { useState, useEffect, useRef } from 'react';
import { motion, useTransform, useScroll } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  FaGavel,
  FaBriefcase,
  FaUsers,
  FaLightbulb,
  FaHome,
  FaFileInvoiceDollar,
} from "react-icons/fa";
import { User, ArrowUpRight } from "lucide-react";

import { fetchLawyersList } from "@/lib/actions/lawyer";
import { GetUserImage } from "@/lib/actions/api/images";
import { FeaturedLawyerRating } from './components/comments/Home/featuredlawyer';
import { CategoryCard } from './components/comments/Home/CategoryCard';
import { FeatureCard } from './components/comments/Home/FeatureCard';

const categories = [
  { title: "Criminal Law", desc: "Defense against state and federal charges.", icon: FaGavel },
  { title: "Corporate Law", desc: "Mergers, acquisitions, and business setups.", icon: FaBriefcase },
  { title: "Family Law", desc: "Divorce, custody, and family estate planning.", icon: FaUsers },
  { title: "Intellectual Property", desc: "Patents, trademarks, and copyright protection.", icon: FaLightbulb },
  { title: "Real Estate Law", desc: "Commercial and property deals.", icon: FaHome },
  { title: "Tax Law", desc: "Business taxes and tax agency problems.", icon: FaFileInvoiceDollar },
];

const features = [
  { title: "Expert Legal Guidance", desc: "Get reliable advice from experienced professionals across multiple areas.", icon: "⚖️" },
  { title: "Client-First Approach", desc: "We focus on your specific needs and give personalized attention.", icon: "🤝" },
  { title: "Fast Solutions", desc: "Smart strategies designed to resolve your legal matters quickly.", icon: "⏱️" },
  { title: "Clear & Transparent", desc: "Simple communication and honest support you can depend on.", icon: "🔍" },
];

const scrollContainerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
};

const scrollItemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

const  Home = () =>  {
  const router = useRouter();
  const [featuredLawyers, setFeaturedLawyers] = useState([]);
  const [isLawyersLoading, setIsLawyersLoading] = useState(true);

  // Slider State Hooks
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
      title: "Find & Hire Expert",
      subtitle: "Legal Counsel.",
      description: "We connect you with high-tier legal help for business mergers, global compliance laws, and corporate defense frameworks.",
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

  const current = slides[currentSlide] || slides[0];

  const handleSlideChange = (nextIndex) => {
    if (isAnimating || nextIndex === currentSlide) return;
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentSlide(nextIndex);
      setIsAnimating(false);
    }, 400);
  };

  // Autoplay Effect
  useEffect(() => {
    const timer = setInterval(() => {
      handleSlideChange((currentSlide + 1) % slides.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [currentSlide, isAnimating]);

  // Lawyers API Synchronizer
  useEffect(() => {
    const fetchRandomLawyers = async () => {
      try {
        setIsLawyersLoading(true);
        const dynamicList = await fetchLawyersList();
        
        if (!dynamicList || dynamicList.length === 0) return;

        const shuffledList = [...dynamicList];
        for (let i = shuffledList.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [shuffledList[i], shuffledList[j]] = [shuffledList[j], shuffledList[i]];
        }

        const compiledLawyers = await Promise.all(
          shuffledList.slice(0, 6).map(async (lawyer) => {
            let imgUrl = "";
            if (lawyer.userId) {
              try {
                const imgData = await GetUserImage(lawyer.userId);
                imgUrl = imgData?.imageUrl || "";
              } catch (err) {
                console.error(err);
              }
            }
            return { ...lawyer, profileImg: imgUrl };
          })
        );
        setFeaturedLawyers(compiledLawyers);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLawyersLoading(false);
      }
    };
    fetchRandomLawyers();
  }, []);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="bg-[#06090e] text-slate-100 min-h-screen selection:bg-amber-400 selection:text-black">
      
      {/* 1. SLIDER HERO BLOCK */}
      <div className="relative w-full min-h-[95vh] md:min-h-screen bg-[#06090e] text-white overflow-hidden select-none flex flex-col justify-between border-b border-slate-900/60">
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

        {/* Dynamic Transition Area */}
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
              {current.title}
              <span className="block font-sans text-transparent bg-clip-text bg-gradient-to-r from-slate-200 via-slate-400 to-slate-500 font-normal mt-2 tracking-tight">
                {current.subtitle}
              </span>
            </h1>

            <p className="text-slate-400 font-light text-base md:text-lg max-w-xl leading-relaxed">
              {current.description}
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-4 sm:gap-6">
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => router.push("/browseloyers")}
                className="group relative px-8 py-4 bg-amber-400 text-black text-xs font-mono font-bold tracking-[0.2em] uppercase overflow-hidden transition-all duration-300 hover:bg-white shadow-2xl shadow-amber-400/10 flex justify-center items-center gap-3"
              >
                Browse Lawyers
                <svg className="w-3.5 h-3.5 transform transition-transform group-hover:translate-x-1.5 duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </motion.button>

              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="group px-8 py-4 border border-slate-800 bg-slate-950/40 hover:bg-slate-900 text-slate-300 hover:text-white text-xs font-mono font-medium tracking-[0.2em] uppercase transition-all duration-300 flex justify-center items-center gap-2"
              >
                Corporate Retainers
              </motion.button>
            </div>
          </div>

          {/* Contextual Sidecard Panel */}
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

        {/* Tab Selection Interface */}
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

      {/* 2. LEGAL EXPERTISE PRACTICE AREA SECTION */}
      <section className="py-24 px-6 border-b border-slate-900/60 bg-[#0B0F17]">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12 space-y-2 border-b border-slate-900 pb-6">
            <span className="text-[10px] font-mono tracking-widest text-amber-400 uppercase block">// Practice Layout Framework</span>
            <h2 className="text-2xl font-light font-serif tracking-wide text-slate-200 uppercase">Legal Expertise Areas</h2>
          </div>

          <motion.div 
            variants={scrollContainerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {categories.map((item, i) => (
              <CategoryCard key={i} {...item} variants={scrollItemVariants} />
            ))}
          </motion.div>
        </div>
      </section>

      {/* 3. FEATURED LAWYERS ROSTER */}
      <section className="py-24 px-6 border-b border-slate-900/60 bg-[#080c14]">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12 space-y-2 border-b border-slate-900 pb-6">
            <span className="text-[10px] font-mono tracking-widest text-amber-400 uppercase block">// Verified Advocates</span>
            <h2 className="text-2xl font-light font-serif tracking-wide text-slate-200 uppercase">Our Featured Lawyers</h2>
          </div>

          {isLawyersLoading ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-2">
              <div className="w-4 h-4 border border-amber-400 border-t-transparent animate-spin" />
              <span className="text-[9px] font-mono tracking-widest text-slate-500 uppercase">// Synchronizing...</span>
            </div>
          ) : featuredLawyers.length === 0 ? (
            <div className="text-center py-12 border border-slate-900 text-xs font-mono text-slate-500">
              No legal practitioners found right now.
            </div>
          ) : (
            <motion.div 
              variants={scrollContainerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {featuredLawyers.map((lawyer) => (
                <motion.div
                  key={lawyer._id}
                  variants={scrollItemVariants}
                  onClick={() => router.push(`/browseloyers/${lawyer._id}`)}
                  className="group border border-slate-900 bg-slate-950/20 p-5 flex flex-col justify-between hover:border-amber-400/30 hover:bg-slate-950/50 transition-all duration-300 relative cursor-pointer"
                >
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <div className="w-10 h-10 bg-slate-950 border border-slate-900 flex items-center justify-center text-slate-500 overflow-hidden group-hover:border-amber-400/20 transition-colors">
                        {lawyer.profileImg ? (
                          <img src={lawyer.profileImg} alt={lawyer.name} className="w-full h-full object-cover" onError={(e) => { e.currentTarget.src = ""; }} />
                        ) : (
                          <User size={16} className="stroke-1" />
                        )}
                      </div>
                      
                      <div className="flex flex-col items-end gap-1.5">
                        <span className={`text-[8px] font-mono border px-1.5 py-0.5 uppercase tracking-wider ${lawyer.isBusy ? "bg-red-950/30 border-red-900/30 text-red-400" : "bg-emerald-950/30 border-emerald-900/30 text-emerald-400"}`}>
                          {lawyer.isBusy ? "Booked" : "Available"}
                        </span>
                        <FeaturedLawyerRating lawyerId={lawyer._id} />
                      </div>
                    </div>

                    <h3 className="text-sm font-serif text-slate-200 uppercase tracking-wide group-hover:text-amber-400 transition-colors">
                      {lawyer.name}
                    </h3>
                    <p className="text-[9px] font-mono text-amber-400/80 uppercase mt-0.5">
                      // {lawyer.specialization}
                    </p>
                    <p className="text-xs text-slate-400 font-light mt-3 line-clamp-2 leading-relaxed">
                      {lawyer.bio}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-900 mt-4 flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-[7px] font-mono uppercase tracking-widest text-slate-500">Hourly Retainer</span>
                      <span className="text-xs font-mono text-slate-300">{lawyer.hourlyFee} {lawyer.currency || "BDT"}/hr</span>
                    </div>

                    <button 
                      onClick={(e) => { e.stopPropagation(); router.push(`/browseloyers/${lawyer._id}`); }}
                      className="text-[9px] font-mono uppercase font-bold border border-slate-900 text-slate-400 bg-slate-950 px-2.5 py-1.5 group-hover:border-amber-400 group-hover:text-black group-hover:bg-amber-400 flex items-center gap-1 transition-all duration-300"
                    >
                      Details
                      <ArrowUpRight size={10} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* 4. VALUE PROPOSITION BENEFITS SECTION */}
      <section className="py-24 px-6 bg-[#070A10]">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12 space-y-2 border-b border-slate-900 pb-6">
            <span className="text-[10px] font-mono tracking-widest text-amber-400 uppercase block">// Institutional Trust Parameters</span>
            <h2 className="text-2xl font-light font-serif tracking-wide text-slate-200 uppercase">Why Choose Lexvizo</h2>
          </div>

          <motion.div 
            variants={scrollContainerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {features.map((item, index) => (
              <FeatureCard key={index} {...item} variants={scrollItemVariants} />
            ))}
          </motion.div>
        </div>
      </section>
    </motion.div>
  );
};

export default Home;