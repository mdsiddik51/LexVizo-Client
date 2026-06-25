"use client";
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useSession } from "@/lib/auth-client";
import HiringHistoryTab from "@/app/components/Dashboard/client/HiringHistoryTab";
import { getClientRequestsAction, completeHiringPaymentAction } from "@/lib/actions/api/hiring";
import { handlePayment } from "@/lib/actions/api/payments";

export default function UserHiringHistory() {
  const sessionContext = useSession();
  const sessionUser = sessionContext?.data?.user || sessionContext?.user;

  const [hiringHistory, setHiringHistory] = useState([]);
  const [isFetchingHiring, setIsFetchingHiring] = useState(false);
  const [paymentSuccessId, setPaymentSuccessId] = useState(null);

  const fetchClientHiringRequests = async () => {
    if (!sessionUser?.id) return;
    setIsFetchingHiring(true);
    try {
      const data = await getClientRequestsAction(sessionUser.id);
      setHiringHistory(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error pulling live pipeline database records:", error);
      toast.error("Failed to load your hiring history registry.");
    } finally {
      setIsFetchingHiring(false);
    }
  };

  useEffect(() => {
    if (sessionUser?.id) {
      fetchClientHiringRequests();
    }
  }, [sessionUser?.id]);

  // Handle Stripe Success Callback Verification
  useEffect(() => {
    if (typeof window === "undefined" || !sessionUser?.id) return;

    const urlParams = new URLSearchParams(window.location.search);
    const paymentSuccess = urlParams.get("payment_success");
    const sessionId = urlParams.get("session_id");
    const targetHiringId = urlParams.get("hiringId");

    if (paymentSuccess === "true" && sessionId && targetHiringId) {
      const verifyStripePaymentOnReturn = async () => {
        const syncToast = toast.loading(
          "Verifying transaction parameters with central ledger...",
        );
        try {
          const verifiedRequest = await completeHiringPaymentAction(
            targetHiringId,
            sessionId,
          );

          if (verifiedRequest) {
            toast.success("Transaction verified! Retainer paid successfully.", {
              id: syncToast,
            });
            setPaymentSuccessId(targetHiringId);
            fetchClientHiringRequests();

            // Clear queries from URL
            window.history.replaceState(
              {},
              document.title,
              window.location.pathname,
            );
            setTimeout(() => setPaymentSuccessId(null), 5000);
          }
        } catch (err) {
          console.error("Verification sync failed:", err);
          toast.error("Could not sync Stripe session parameter logs.", {
            id: syncToast,
          });
        }
      };
      verifyStripePaymentOnReturn();
    }
  }, [sessionUser?.id]);

  const handlePay = async (id) => {
    const toastId = toast.loading("Initializing secure transaction link...");
    try {
      const response = await handlePayment(id);
      if (response && response.url) {
        toast.success("Redirecting to checkout page...", { id: toastId });
        window.location.href = response.url;
        return;
      }
      if (response && response.error) {
        throw new Error(response.details || response.error);
      }
      throw new Error("No URL returned from checkout generation.");
    } catch (error) {
      console.error("Payment loop error:", error);
      toast.error(error.message || "Stripe gateway session failed.", { id: toastId });
    }
  };

  return (
    <div className="w-full">
      <HiringHistoryTab
        hiringHistory={hiringHistory}
        isLoading={isFetchingHiring}
        paymentSuccessId={paymentSuccessId}
        handlePayment={handlePay}
      />
    </div>
  );
}
