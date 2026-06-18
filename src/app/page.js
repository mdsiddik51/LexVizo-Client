"use client"
import React, { useState, useEffect, useRef } from 'react';

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const progressRef = useRef(null);

  const slides = [
    {
      id: "01",
      tagline: "CORPORATE ARCHITECTURE",
      title: "Shaping Tomorrow’s",
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
    <div className="relative w-full h-[700px] md:h-[850px] bg-[#070A10] text-white overflow-hidden font-sans select-none flex flex-col justify-between">


      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div
          className="absolute w-[500px] h-[500px] rounded-full bg-amber-500/5 blur-[120px] transition-all duration-1000 ease-in-out"
          style={{
            top: currentSlide === 0 ? '10%' : currentSlide === 1 ? '30%' : '-10%',
            left: currentSlide === 0 ? '5%' : currentSlide === 1 ? '50%' : '30%',
          }}
        />
        <div
          className="absolute w-[600px] h-[600px] rounded-full bg-blue-600/[0.03] blur-[150px] transition-all duration-1000 ease-in-out"
          style={{
            bottom: currentSlide === 0 ? '-10%' : '20%',
            right: currentSlide === 0 ? '10%' : '40%',
          }}
        />
      </div>


      <div className="absolute inset-0 opacity-[0.03] pointer-events-none z-0">
        <div className="max-w-7xl mx-auto h-full w-full border-x border-white flex justify-between">
          <div className="w-px h-full bg-white" />
          <div className="w-px h-full bg-white" />
          <div className="w-px h-full bg-white" />
        </div>
      </div>


      <div className="relative z-20 max-w-7xl w-full mx-auto px-6 md:px-12 pt-8 flex justify-between items-center text-[10px] tracking-[0.4em] text-slate-500 uppercase font-mono">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
          <span>Vanguard Legal Group</span>
        </div>
        <div className="hidden sm:block">Global Strategy / Private Practice</div>
      </div>


      <div className="relative z-10 max-w-7xl w-full mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 items-center gap-16 my-auto layout-container">

        <div className={`lg:col-span-7 space-y-6 md:space-y-8 transition-all duration-500 ease-out ${isAnimating ? 'opacity-0 translate-y-4 filter blur-sm' : 'opacity-100 translate-y-0 filter blur-none'
          }`}>
          <div className="flex items-center gap-3">
            <div className="h-px w-8 bg-amber-400/50" />
            <span className="text-[11px] font-mono tracking-[0.35em] text-amber-400 font-medium">
              {slides[currentSlide].tagline}
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl tracking-tight font-serif leading-[1.1] text-slate-100 font-light">
            {slides[currentSlide].title}
            <span className="block font-sans font-normal text-slate-400 text-3xl sm:text-4xl md:text-5xl mt-3 tracking-normal font-light">
              {slides[currentSlide].subtitle}
            </span>
          </h1>

          <p className="text-slate-400 font-light text-base md:text-lg max-w-xl leading-relaxed">
            {slides[currentSlide].description}
          </p>

          <div className="pt-4 flex flex-wrap items-center gap-6 sm:gap-10">
            <button className="group relative px-8 py-4 bg-white text-black text-xs font-mono font-semibold tracking-[0.2em] uppercase overflow-hidden transition-all duration-300 hover:bg-amber-400 hover:text-black shadow-2xl shadow-black/50">
              <span className="relative z-10 flex items-center gap-3">
                Retain Firm
                <svg className="w-3.5 h-3.5 transform transition-transform group-hover:translate-x-1.5 duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </span>
            </button>

            <button className="group text-[11px] tracking-[0.25em] uppercase font-mono font-medium text-slate-400 hover:text-white transition-colors duration-300 flex items-center gap-2 py-2">
              <span>Case Studies</span>
              <span className="w-1.5 h-1.5 rounded-full bg-slate-600 group-hover:bg-amber-400 transition-colors" />
            </button>
          </div>
        </div>


        <div className="hidden lg:col-span-5 lg:flex flex-col items-end justify-center">
          <div className={`w-80 h-80 border border-slate-800/60 bg-slate-950/20 backdrop-blur-md p-8 flex flex-col justify-between relative group transition-all duration-700 ease-out hover:border-amber-400/30 shadow-3xl ${isAnimating ? 'opacity-0 scale-95 rotate-1' : 'opacity-100 scale-100 rotate-0'
            }`}>

            <div className="absolute top-[-1px] left-[-1px] w-3 h-[1px] bg-slate-700 group-hover:bg-amber-400 transition-colors" />
            <div className="absolute top-[-1px] left-[-1px] w-[1px] h-3 bg-slate-700 group-hover:bg-amber-400 transition-colors" />
            <div className="absolute bottom-[-1px] right-[-1px] w-3 h-[1px] bg-slate-700 group-hover:bg-amber-400 transition-colors" />
            <div className="absolute bottom-[-1px] right-[-1px] w-[1px] h-3 bg-slate-700 group-hover:bg-amber-400 transition-colors" />

            <div className="flex justify-between items-start">
              <div className="p-3.5 bg-[#0e131f] border border-slate-800 shadow-inner group-hover:border-amber-500/20 transition-colors">
                {slides[currentSlide].icon}
              </div>
              <span className="text-5xl font-mono font-thin text-slate-800 group-hover:text-slate-700 transition-colors select-none">
                {slides[currentSlide].id}
              </span>
            </div>

            <div className="space-y-2">
              <div className="text-[10px] tracking-[0.3em] text-amber-400 font-mono font-medium">// CORE STRATEGY</div>
              <p className="text-xs text-slate-400 font-light leading-relaxed tracking-wide">
                {slides[currentSlide].methodology}
              </p>
            </div>
          </div>
        </div>

      </div>

      <div className="relative z-20 border-t border-slate-900 bg-[#080c14]/40 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-6 md:py-8 grid grid-cols-3 gap-6 md:gap-12">
          {slides.map((slide, index) => {
            const isActive = index === currentSlide;
            return (
              <div
                key={slide.id}
                onClick={() => handleSlideChange(index)}
                className="cursor-pointer group relative pt-4 flex flex-col gap-2 transition-all duration-300"
              >

                <div className="absolute top-0 left-0 w-full h-[1px] bg-slate-800/60 group-hover:bg-slate-700/60 transition-colors">
                  <div
                    ref={isActive ? progressRef : null}
                    className={`h-[2px] bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.4)] rounded-full transition-all ease-linear ${isActive ? 'w-full duration-[7000ms]' : 'w-0 duration-0'
                      }`}
                  />
                </div>


                <div className="flex items-center justify-between sm:justify-start sm:gap-4">
                  <span className={`font-mono text-xs tracking-wider transition-colors duration-300 ${isActive ? 'text-amber-400 font-bold' : 'text-slate-600 group-hover:text-slate-400'
                    }`}>
                    {slide.id}
                  </span>
                  <span className={`text-[10px] sm:text-xs tracking-[0.2em] uppercase font-mono font-medium transition-colors duration-300 ${isActive ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'
                    }`}>
                    {slide.tagline.split(' ')[0]}
                  </span>
                  <span className={`hidden sm:inline font-mono text-[10px] text-slate-700 transition-colors ${isActive ? 'text-slate-500' : 'group-hover:text-slate-600'
                    }`}>
                    // {slide.tagline.split(' ')[1] || 'EXECUTION'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};

export default Home;