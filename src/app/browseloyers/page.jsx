"use client";
import React, { useState, useEffect } from "react";
import { Search, SlidersHorizontal, ArrowUpDown, User, ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import toast from "react-hot-toast";
import { fetchLawyersList } from "@/lib/actions/lawyer";
import { GetUserImage } from "@/lib/actions/api/images";
import { useRouter } from "next/navigation";

const CARDS_PER_PAGE = 12;

const BrowseLawyersPage = () => {
  const router = useRouter();
  
  const [lawyers, setLawyers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpecialization, setSelectedSpecialization] = useState("all");
  const [sortBy, setSortBy] = useState("default");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const loadDynamicCatalog = async () => {
      try {
        setIsLoading(true);
        const rawLawyersList = await fetchLawyersList();
        
        if (!rawLawyersList || rawLawyersList.length === 0) {
          setLawyers([]);
          return;
        }

        const resolvedLawyers = await Promise.all(
          rawLawyersList.map(async (lawyer) => {
            let imgUrl = "";
            if (lawyer.userId) {
              try {
                const imgData = await GetUserImage(lawyer.userId);
                imgUrl = imgData?.imageUrl || "";
              } catch (imgError) {
                console.error(imgError);
              }
            }
            return {
              ...lawyer,
              profileImg: imgUrl,
              isBusy: lawyer.isBusy ?? false 
            };
          })
        );

        setLawyers(resolvedLawyers);
      } catch (error) {
        toast.error("Database connection failure: Could not load listing records.");
      } finally {
        setIsLoading(false);
      }
    };

    loadDynamicCatalog();
  }, []);

  // Reset to page 1 whenever filters/search/sort changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedSpecialization, sortBy]);

  const filteredLawyers = lawyers
    .filter((lawyer) => {
      const nameMatch = lawyer.name?.toLowerCase().includes(searchQuery.toLowerCase()) || false;
      const specMatch = lawyer.specialization?.toLowerCase().includes(searchQuery.toLowerCase()) || false;
      const matchesSearch = nameMatch || specMatch;
      const matchesSpecialization = selectedSpecialization === "all" || lawyer.specialization === selectedSpecialization;
      return matchesSearch && matchesSpecialization;
    })
    .sort((a, b) => {
      const feeA = Number(a.hourlyFee) || 0;
      const feeB = Number(b.hourlyFee) || 0;
      if (sortBy === "price-asc") return feeA - feeB;
      if (sortBy === "price-desc") return feeB - feeA;
      return 0;
    });

  const specializations = ["all", ...new Set(lawyers.map((l) => l.specialization).filter(Boolean))];

  // Pagination calculations
  const totalPages = Math.ceil(filteredLawyers.length / CARDS_PER_PAGE);
  const startIndex = (currentPage - 1) * CARDS_PER_PAGE;
  const paginatedLawyers = filteredLawyers.slice(startIndex, startIndex + CARDS_PER_PAGE);

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Generate page number array with ellipsis logic
  const getPageNumbers = () => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    const pages = [];
    if (currentPage <= 3) {
      pages.push(1, 2, 3, 4, "...", totalPages);
    } else if (currentPage >= totalPages - 2) {
      pages.push(1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
    } else {
      pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
    }
    return pages;
  };

  return (
    <div className="min-h-screen bg-[#050811] text-white selection:bg-[#FCBA80] selection:text-black px-4 sm:px-8 py-12">
      
      <div className="max-w-7xl mx-auto border-b border-[#131B2E] pb-8 mb-10 space-y-2">
        <span className="text-[10px] font-mono tracking-widest text-[#FCBA80] uppercase block">// Vanguard Legal Network</span>
        <h1 className="text-4xl md:text-5xl font-serif text-gray-100 tracking-wide">Find & Hire Expert Counsel</h1>
        <p className="text-xs text-gray-400 font-mono max-w-xl leading-relaxed">
          Explore global trial-tested professionals built for complex arbitration, enterprise protection, and high-stakes courtroom victories.
        </p>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="md:col-span-2 relative border border-[#131B2E] bg-[#0A0F1D] flex items-center px-4 focus-within:border-[#FCBA80]/40 transition-colors">
          <Search size={14} className="text-gray-500 mr-2 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search litigators by name or field..."
            className="w-full bg-transparent text-xs py-3.5 text-gray-200 focus:outline-none font-mono placeholder-gray-600"
          />
        </div>

        <div className="border border-[#131B2E] bg-[#0A0F1D] flex items-center px-4 gap-3 focus-within:border-[#FCBA80]/40 transition-colors">
          <SlidersHorizontal size={14} className="text-gray-500 shrink-0" />
          <select
            value={selectedSpecialization}
            onChange={(e) => setSelectedSpecialization(e.target.value)}
            className="w-full bg-[#0A0F1D] text-xs py-3.5 pr-4 text-gray-300 font-mono focus:outline-none cursor-pointer capitalize appearance-none"
          >
            {specializations.map((spec) => (
              <option key={spec} value={spec} className="bg-[#0A0F1D] text-gray-300 capitalize">
                {spec === "all" ? "All Fields" : spec}
              </option>
            ))}
          </select>
        </div>

        <div className="border border-[#131B2E] bg-[#0A0F1D] flex items-center px-4 gap-3 focus-within:border-[#FCBA80]/40 transition-colors">
          <ArrowUpDown size={14} className="text-gray-500 shrink-0" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full bg-[#0A0F1D] text-xs py-3.5 pr-4 text-gray-300 font-mono focus:outline-none cursor-pointer appearance-none"
          >
            <option value="default" className="bg-[#0A0F1D] text-gray-300">Sort Default</option>
            <option value="price-asc" className="bg-[#0A0F1D] text-gray-300">Rate: Low to High</option>
            <option value="price-desc" className="bg-[#0A0F1D] text-gray-300">Rate: High to Low</option>
          </select>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-3">
            <div className="w-6 h-6 border border-[#FCBA80] border-t-transparent animate-spin rounded-full" />
            <span className="text-[10px] font-mono tracking-widest text-gray-500 uppercase animate-pulse">
              // Syncing Elite Database Parameters...
            </span>
          </div>
        ) : filteredLawyers.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-[#131B2E] text-xs font-mono text-gray-500">
            No expert litigators match parameters.
          </div>
        ) : (
          <>
            {/* Results count */}
            <div className="flex items-center justify-between mb-6">
              <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">
                // Showing {startIndex + 1}–{Math.min(startIndex + CARDS_PER_PAGE, filteredLawyers.length)} of {filteredLawyers.length} counsel
              </span>
              <span className="text-[10px] font-mono text-gray-600 uppercase tracking-widest">
                Page {currentPage} / {totalPages}
              </span>
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {paginatedLawyers.map((lawyer) => (
                <div 
                  key={lawyer._id}
                  onClick={() => router.push(`/browseloyers/${lawyer._id}`)}
                  className="group border border-[#131B2E] bg-[#090D1A]/40 p-5 flex flex-col justify-between hover:border-[#FCBA80]/40 hover:bg-[#0a0f20]/60 transition-all duration-300 relative cursor-pointer"
                >
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <div className="w-12 h-12 bg-[#0A0F1D] border border-[#131B2E] flex items-center justify-center text-gray-400 overflow-hidden group-hover:border-[#FCBA80]/30 transition-colors">
                        {lawyer.profileImg ? (
                          <img 
                            src={lawyer.profileImg} 
                            alt={lawyer.name} 
                            className="w-full h-full object-cover" 
                            onError={(e) => { e.currentTarget.src = ""; }} 
                          />
                        ) : (
                          <User size={18} className="stroke-1" />
                        )}
                      </div>
                      <span className={`text-[9px] font-mono border px-2 py-0.5 uppercase tracking-widest ${lawyer.isBusy ? "bg-red-950/40 border-red-900/40 text-red-400" : "bg-emerald-950/40 border-emerald-900/40 text-emerald-400"}`}>
                        {lawyer.isBusy ? "Fully Booked" : "Available"}
                      </span>
                    </div>
                    
                    <h3 className="text-sm font-serif text-gray-200 uppercase tracking-wide group-hover:text-[#FCBA80] transition-colors">{lawyer.name}</h3>
                    <p className="text-[10px] font-mono text-[#FCBA80]/80 uppercase mt-0.5">// {lawyer.specialization}</p>
                    <p className="text-xs text-gray-400 font-light mt-3 line-clamp-3 leading-relaxed">{lawyer.bio}</p>
                  </div>

                  <div className="pt-4 border-t border-[#131B2E] mt-4 flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-[8px] font-mono uppercase tracking-widest text-gray-500">Hourly Retainer</span>
                      <span className="text-xs font-mono text-gray-200">{lawyer.hourlyFee} {lawyer.currency || "BDT"}/hr</span>
                    </div>
                    
                    <button 
                      onClick={(e) => { 
                        e.stopPropagation(); 
                        router.push(`/browseloyers/${lawyer._id}`); 
                      }}
                      className="text-[10px] font-mono uppercase font-bold border border-[#131B2E] text-gray-300 bg-[#0A0F1D] px-3 py-1.5 group-hover:border-[#FCBA80] group-hover:text-black group-hover:bg-[#FCBA80] flex items-center gap-1 transition-all duration-300"
                    >
                      Details
                      <ArrowUpRight size={12} className="opacity-60 group-hover:opacity-100" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-12 flex items-center justify-center gap-2">
                {/* Prev Button */}
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="flex items-center gap-1.5 border border-[#131B2E] bg-[#0A0F1D] px-3 py-2 font-mono text-[10px] uppercase text-gray-400 hover:border-[#FCBA80]/40 hover:text-white transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ChevronLeft size={12} />
                  Prev
                </button>

                {/* Page Numbers */}
                <div className="flex items-center gap-1">
                  {getPageNumbers().map((page, idx) =>
                    page === "..." ? (
                      <span
                        key={`ellipsis-${idx}`}
                        className="w-8 text-center font-mono text-[10px] text-gray-600"
                      >
                        ...
                      </span>
                    ) : (
                      <button
                        key={page}
                        onClick={() => goToPage(page)}
                        className={`w-8 h-8 font-mono text-[11px] border transition-all duration-200 ${
                          currentPage === page
                            ? "bg-[#FCBA80] text-black border-[#FCBA80] font-bold"
                            : "bg-[#0A0F1D] text-gray-400 border-[#131B2E] hover:border-[#FCBA80]/40 hover:text-white"
                        }`}
                      >
                        {page}
                      </button>
                    )
                  )}
                </div>

                {/* Next Button */}
                <button
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="flex items-center gap-1.5 border border-[#131B2E] bg-[#0A0F1D] px-3 py-2 font-mono text-[10px] uppercase text-gray-400 hover:border-[#FCBA80]/40 hover:text-white transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  Next
                  <ChevronRight size={12} />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default BrowseLawyersPage;