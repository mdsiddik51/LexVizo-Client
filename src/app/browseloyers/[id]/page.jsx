"use client";
import React, { useState, useEffect } from "react";
import {
  User,
  Calendar,
  DollarSign,
  ArrowLeft,
  X,
  ShieldAlert,
  ArrowUpRight,
  Briefcase,
  Star,
  EyeOff
} from "lucide-react";
import toast from "react-hot-toast";
import { fetchLawyersList } from "@/lib/actions/lawyer";
import { GetUserImage } from "@/lib/actions/api/images";
import { useRouter, useParams } from "next/navigation";
import { fetchServiceData } from "@/lib/actions/api/service";
import { createHiringRequestAction } from "@/lib/actions/api/hiring";
import CommentSection from "@/app/components/comments/comment";
import { useSession } from "@/lib/auth-client";
import { fetchCommentsAction } from "@/lib/actions/api/comments";

const LawyerDetailsPage = () => {
  const router = useRouter();
  const { id } = useParams();

  const userSession = useSession();
  const userRole = userSession?.data?.user?.role || "client";

  const currentUserId = userSession?.data?.user?.id;
  const currentUserName = userSession?.data?.user?.name;
  const currentUserEmail = userSession?.data?.user?.email;

  const [lawyer, setLawyer] = useState(null);
  const [lawyerServices, setLawyerServices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [averageRating, setAverageRating] = useState("0.0");

  const [hireModalOpen, setHireModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [isSubmittingHire, setIsSubmittingHire] = useState(false);

  const getTherating = async (lawyerid) => {
    try {
      const comments = await fetchCommentsAction(lawyerid);
      if (comments && comments.length > 0) {
        const validRatings = comments.map(c => Number(c.rating || c.stars || 0)).filter(r => !isNaN(r) && r > 0);
        if (validRatings.length > 0) {
          const totalSum = validRatings.reduce((acc, curr) => acc + curr, 0);
          const avg = (totalSum / validRatings.length).toFixed(1);
          setAverageRating(avg);
        } else {
          setAverageRating("N/A");
        }
      } else {
        setAverageRating("N/A");
      }
    } catch (err) {
      console.error("Failed to compute lawyer rating telemetry matrix:", err);
      setAverageRating("ERR");
    }
  };

  useEffect(() => {
    const getLawyerDetailsAndServices = async () => {
      try {
        setIsLoading(true);
        const allLawyers = await fetchLawyersList();
        const foundLawyer = allLawyers?.find((l) => l._id === id);

        if (!foundLawyer) {
          setLawyer(null);
          return;
        }

        if (foundLawyer._id) {
          getTherating(foundLawyer._id);
        }

        let resolvedImg = "";
        let servicesData = [];

        try {
          if (foundLawyer.userId) {
            const imgData = await GetUserImage(foundLawyer.userId);
            resolvedImg = imgData?.imageUrl || "";
          }
          if (foundLawyer._id) {
            servicesData = await fetchServiceData(foundLawyer._id);
            if ((!servicesData || servicesData.length === 0) && foundLawyer.userId) {
              servicesData = await fetchServiceData(foundLawyer.userId);
            }
          }
        } catch (err) {
          console.error(err);
        }

        const fallbackServices = servicesData || [];
        setLawyerServices(fallbackServices);
        
        setSelectedService(null);

        setLawyer({
          ...foundLawyer,
          profileImg: resolvedImg,
          isBusy: foundLawyer.isBusy ?? false,
          dateJoined: foundLawyer.dateJoined
            ? new Date(foundLawyer.dateJoined).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })
            : "June 20, 2026",
        });
      } catch (error) {
        toast.error("Failed to load secure database counsel attributes.");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) getLawyerDetailsAndServices();
  }, [id]);

  const openRetainerModal = (servicePackage = null) => {
    if (lawyer?.isBusy) {
      toast.error("Counsel allocation rejected. This practitioner is currently fully booked.");
      return;
    }

    if (!userSession?.data?.user) {
      toast.error("Authentication required to interact with system profiles.");
      return;
    }

    if (servicePackage) {
      setSelectedService(servicePackage);
    } else {
      setSelectedService(null);
    }
    
    setHireModalOpen(true);
  };

  const handleHireRequest = async (e) => {
    e.preventDefault();
    if (lawyer?.isBusy) {
      toast.error("Action denied: Profile status is currently set to busy.");
      return;
    }

    if (!currentUserId) {
      toast.error("Session missing. Please authenticate.");
      return;
    }

    setIsSubmittingHire(true);

    // Completely bulletproof sanitizer for parsing incoming price integers or strings safely
    const safeParseFloat = (value) => {
      if (value === null || value === undefined) return 0;
      if (typeof value === "number") return isNaN(value) ? 0 : value;
      
      const parsed = parseFloat(String(value).replace(/[^0-9.]/g, ""));
      return isNaN(parsed) ? 0 : parsed;
    };

    const hasPackage = selectedService && selectedService._id;
    const initialPrice = hasPackage 
      ? safeParseFloat(selectedService.price) 
      : safeParseFloat(lawyer?.hourlyFee);

    // Guaranteed dynamic fallback assertion ensuring final assignment evaluates to a valid number type above zero
    const finalPrice = (!initialPrice || initialPrice <= 0) ? 100 : initialPrice;

    const payload = {
      clientId: currentUserId,
      clientName: currentUserName || "NoName",
      clientEmail: currentUserEmail || "",
      lawyerId: lawyer._id,
      lawyerUserId: lawyer.userId,
      lawyerEmail: lawyer.email || "",
      lawyerName: lawyer.name || "Unknown Professional",
      lawyerImage: lawyer.profileImg || "", 
      caseType: hasPackage ? selectedService.title : (lawyer.specialization || "General Legal Counsel"),
      urgency: hasPackage ? "STANDARD" : "HIGH",
      serviceId: hasPackage ? selectedService._id : null,
      pricingDetails: {
        type: hasPackage ? "package" : "hourly",
        amount: finalPrice
      },
      status: "pending"
    };

    try {
      await createHiringRequestAction(payload);
      const allocationType = hasPackage ? `the "${selectedService.title}" package` : "a flat standard retainer";
      toast.success(`Retainer request submitted securely for ${allocationType} to ${lawyer?.name}`);
      setHireModalOpen(false);
    } catch (error) {
      console.error("Pipeline Transmission Error Details:", error);
      toast.error("Failed to transmit hiring pipeline request payload data structures.");
    } finally {
      setIsSubmittingHire(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#050811] text-white px-4 sm:px-8 py-12 flex items-center justify-center">
        <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-12 gap-12 animate-pulse">
          <div className="md:col-span-5 aspect-[4/5] bg-[#090D1A]/60 border border-[#131B2E]" />
          <div className="md:col-span-7 space-y-6 py-4">
            <div className="h-3 w-32 bg-gray-800 font-mono" />
            <div className="h-12 w-3/4 bg-gray-800" />
            <div className="h-4 w-1/2 bg-gray-800" />
          </div>
        </div>
      </div>
    );
  }

  if (!lawyer) {
    return (
      <div className="min-h-screen bg-[#050811] text-white flex flex-col items-center justify-center font-mono text-xs space-y-4">
        <ShieldAlert size={24} className="text-[#FCBA80]" />
        <span>// RESOURCE_IDENTIFIER_NOT_FOUND: COUNSEL INDEX VOID</span>
        <button onClick={() => router.back()} className="border border-[#131B2E] px-4 py-2 text-gray-400 hover:text-white">
          Return to Network
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050811] text-white selection:bg-[#FCBA80] selection:text-black px-4 sm:px-8 py-12">
      <div className="max-w-6xl mx-auto mb-8">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-[10px] font-mono tracking-widest text-gray-500 uppercase hover:text-[#FCBA80] transition-colors">
          <ArrowLeft size={12} /> // Back to Vanguard Network
        </button>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 items-start border-b border-[#131B2E] pb-14">
        <div className="md:col-span-5 relative group">
          <div className="aspect-[4/5] bg-[#0A0F1D] border border-[#131B2E] overflow-hidden flex items-center justify-center relative group-hover:border-[#FCBA80]/40 transition-colors duration-300">
            {lawyer.profileImg ? (
              <img src={lawyer.profileImg} alt={lawyer.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            ) : (
              <User size={64} className="text-gray-700 stroke-1" />
            )}
            <div className="absolute top-4 right-4">
              <span className={`text-[9px] font-mono border px-3 py-1 uppercase tracking-widest backdrop-blur-md font-bold ${lawyer.isBusy ? "bg-red-950/70 border-red-900/60 text-red-400" : "bg-emerald-950/70 border-emerald-900/60 text-emerald-400"}`}>
                {lawyer.isBusy ? "Fully Booked" : "Available to Retain"}
              </span>
            </div>
          </div>
        </div>

        <div className="md:col-span-7 space-y-6">
          <div className="space-y-2">
            <span className="text-[10px] font-mono tracking-widest text-[#FCBA80] uppercase block">// {lawyer.specialization}</span>
            <h1 className="text-4xl md:text-5xl font-serif text-gray-100 tracking-wide uppercase leading-none">{lawyer.name}</h1>
          </div>

          <div className="border-t border-b border-[#131B2E] py-4 grid grid-cols-3 gap-2 font-mono text-[11px] text-gray-400">
            <div className="flex items-center gap-2">
              <DollarSign size={14} className="text-[#FCBA80]" />
              <span>Rate: <strong className="text-white">${lawyer.hourlyFee || 100} {lawyer.currency || "BDT"}/hr</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <Star size={14} className="text-[#FCBA80] fill-[#FCBA80]/10" />
              <span>Rating: <strong className="text-white">{averageRating} {averageRating !== "N/A" && averageRating !== "ERR" && "★"}</strong></span>
            </div>
            <div className="flex items-center gap-2 justify-end md:justify-start">
              <Calendar size={14} className="text-[#FCBA80]" />
              <span>Joined: <strong className="text-white">{lawyer.dateJoined}</strong></span>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-xs font-mono uppercase tracking-widest text-gray-500">// Professional Dossier Summary</h3>
            <p className="text-sm text-gray-300 font-light leading-relaxed font-serif">{lawyer.bio}</p>
          </div>

          <div className="pt-2 space-y-8">
            {lawyer.isBusy ? (
              <button 
                disabled
                className="flex items-center justify-between border border-zinc-800 bg-zinc-900 text-zinc-500 px-6 py-4 w-full md:w-72 font-mono text-xs uppercase font-bold tracking-widest cursor-not-allowed opacity-60"
              >
                <span>Fully Booked</span>
                <EyeOff size={16} />
              </button>
            ) : (
              <button 
                onClick={() => openRetainerModal(null)} 
                className="group flex items-center justify-between border border-[#FCBA80] bg-[#FCBA80] text-black px-6 py-4 w-full md:w-72 font-mono text-xs uppercase font-bold tracking-widest hover:bg-transparent hover:text-[#FCBA80] transition-all duration-300"
              >
                <span>{selectedService ? `Retain: ${selectedService.title}` : "Hire Counsel Retainer"}</span>
                <ArrowUpRight size={16} />
              </button>
            )}

            <div className="border-t border-[#131B2E] pt-6 space-y-4">
              <div>
                <span className="text-[9px] font-mono text-[#FCBA80] uppercase tracking-wider">// Capabilities Matrix</span>
                <h3 className="text-sm font-mono uppercase tracking-widest text-gray-400">Available Packages</h3>
              </div>

              {lawyerServices.length === 0 ? (
                <div className="text-xs font-mono text-gray-600 border border-dashed border-[#131B2E] py-6 text-center">
                  // No supplemental structural services listed.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {lawyerServices.map((service, index) => {
                    const isSelected = selectedService?._id === service._id;
                    return (
                      <div 
                        key={service._id || index} 
                        onClick={() => !lawyer.isBusy && setSelectedService(service)}
                        className={`border transition-all duration-200 bg-[#0A0F1D]/40 p-4 space-y-4 flex flex-col justify-between text-left ${
                          lawyer.isBusy 
                            ? "border-[#131B2E] opacity-50 cursor-not-allowed" 
                            : isSelected 
                              ? "border-[#FCBA80] bg-[#FCBA80]/5 shadow-[0_0_15px_rgba(252,186,128,0.05)] cursor-pointer" 
                              : "border-[#131B2E] cursor-pointer hover:border-[#FCBA80]/40"
                        }`}
                      >
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-[#FCBA80]">
                            <div className="flex items-center gap-2">
                              <Briefcase size={12} />
                              <h4 className="text-xs font-mono uppercase tracking-wide font-bold">{service.title || "Consultation Brief"}</h4>
                            </div>
                            {!lawyer.isBusy && isSelected && (
                              <span className="text-[8px] font-mono tracking-tight bg-[#FCBA80] text-black px-1.5 py-0.5 font-bold uppercase">
                                [ Active ]
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] font-serif text-gray-400 font-light leading-relaxed line-clamp-3">{service.description || "No description listed."}</p>
                        </div>
                        
                        <div className="space-y-2 pt-2 border-t border-[#131B2E]/60">
                          <div className="flex items-center justify-between font-mono text-[11px]">
                            <span className="text-gray-500 uppercase text-[9px]">Valuation</span>
                            <span className="text-gray-200 font-bold">${service.price} {lawyer.currency || "BDT"}</span>
                          </div>
                          
                          <button 
                            disabled={lawyer.isBusy}
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation(); 
                              openRetainerModal(service);
                            }} 
                            className={`w-full font-mono text-[9px] py-2 uppercase font-bold tracking-wider transition-all duration-200 border ${
                              lawyer.isBusy
                                ? "border-zinc-800 bg-zinc-900 text-zinc-500 cursor-not-allowed"
                                : isSelected 
                                  ? "bg-[#FCBA80] text-black border-[#FCBA80] hover:bg-[#E2A76F]" 
                                  : "border-[#131B2E] bg-[#050811] text-gray-300 hover:bg-[#FCBA80] hover:text-black hover:border-[#FCBA80]"
                            }`}
                          >
                            {lawyer.isBusy ? "Unavailable" : isSelected ? "Initialize Retainer" : "Select Package"}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <CommentSection userRole={userRole} userSession={userSession} />

      {hireModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setHireModalOpen(false)} />
          <div className="relative w-full max-w-md border border-[#131B2E] bg-[#0A0F1D] p-6 text-white space-y-6">
            <button 
              onClick={() => setHireModalOpen(false)} 
              className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
            >
              <X size={16} />
            </button>
            <div className="space-y-1 border-b border-[#131B2E] pb-3">
              <span className="text-[9px] font-mono uppercase tracking-widest text-[#FCBA80] block">// Retainer Protocol Initialization</span>
              <h3 className="text-md font-serif uppercase tracking-wide text-gray-100">Confirm Counsel Mandate</h3>
            </div>
            <div className="space-y-3 font-mono text-xs text-gray-400 bg-[#050811] p-3 border border-[#131B2E]">
              <div className="flex justify-between"><span className="text-gray-600">Counsel:</span><span className="text-white font-serif">{lawyer.name}</span></div>
              <div className="flex justify-between"><span className="text-gray-600">Specialization:</span><span className="text-gray-300">{lawyer.specialization}</span></div>
              {selectedService ? (
                <>
                  <div className="flex justify-between"><span className="text-gray-600">Selected Service:</span><span className="text-white">{selectedService.title}</span></div>
                  <div className="flex justify-between"><span className="text-gray-600">Package Pricing:</span><span className="text-[#FCBA80]">${selectedService.price} {lawyer.currency || "BDT"}</span></div>
                </>
              ) : (
                <div className="flex justify-between"><span className="text-gray-600">Hourly Rate:</span><span className="text-[#FCBA80]">${lawyer.hourlyFee || 100} {lawyer.currency || "BDT"}/hr</span></div>
              )}
            </div>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button 
                type="button" 
                onClick={() => setHireModalOpen(false)} 
                className="border border-[#131B2E] py-2 text-xs font-mono uppercase text-gray-400 hover:text-white transition-colors"
              >
                Abort Protocol
              </button>
              <button 
                onClick={handleHireRequest} 
                disabled={isSubmittingHire || lawyer.isBusy} 
                className="bg-[#FCBA80] text-black py-2 text-xs font-mono font-bold uppercase tracking-wide hover:bg-[#E2A76F] transition-all flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {isSubmittingHire ? <div className="w-3 h-3 border border-black border-t-transparent animate-spin rounded-full" /> : "Confirm & Disclose"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LawyerDetailsPage;