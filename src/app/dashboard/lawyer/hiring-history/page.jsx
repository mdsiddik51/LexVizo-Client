"use client";
import React, { useState, useEffect } from "react";
import { useSession } from "@/lib/auth-client";
import { GetLawyerData } from "@/lib/actions/api/lawyerdata";
import { getLawyerRequestsAction } from "@/lib/actions/api/hiring";
import HiringHistory from "@/app/components/Dashboard/lawyer/hirehistory";

export default function LawyerHiringHistory() {
  const sessionContext = useSession();
  const sessionUser = sessionContext?.data?.user || sessionContext?.user;

  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchHiringHistory = async () => {
    const targetId = sessionUser?.id || sessionUser?._id;
    if (!targetId) return;

    try {
      setIsLoading(true);
      const lawyerProfile = await GetLawyerData(targetId);
      if (lawyerProfile?._id) {
        const allRequests = await getLawyerRequestsAction(lawyerProfile._id);
        setRequests(allRequests || []);
      }
    } catch (error) {
      console.error("Failed fetching lawyer hiring history:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (sessionUser) {
      fetchHiringHistory();
    }
  }, [sessionUser]);

  if (isLoading) {
    return (
      <div className="space-y-4 animate-pulse">
        <p className="text-xs font-mono text-slate-500 uppercase tracking-widest">// Retrieving Lawyer Requests Registry...</p>
        <div className="h-40 bg-[#050a12] border border-[#111927] flex items-center justify-center text-sm font-mono text-slate-400">
          Syncing Cases...
        </div>
      </div>
    );
  }

  const userid = sessionUser?.id || sessionUser?._id;

  return (
    <div className="w-full">
      <div className="mb-6">
        <h2 className="text-xl font-serif text-slate-100 font-normal uppercase tracking-wide">
          Hiring Requests Queue
        </h2>
        <p className="text-xs text-slate-400 font-mono mt-1">
          Review and update inbound legal representation request status from users.
        </p>
      </div>

      <HiringHistory initialRequests={requests} userid={userid} />
    </div>
  );
}
