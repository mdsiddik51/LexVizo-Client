"use client";

import { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { AlertTriangle, X } from "lucide-react";

import {
  GetUserImage,
  ProfileImage,
  UpdateProfileImage,
} from "@/lib/actions/api/images";
import { updateUserNameAction } from "@/lib/actions/api/user";
import { useSession } from "@/lib/auth-client";
import Sidebar from "@/app/components/Dashboard/client/Sidebar";
import Header from "@/app/components/Dashboard/client/Header";
import ManageProfileTab from "@/app/components/Dashboard/client/ManageProfileTab";
import CommentsManagementTab from "@/app/components/Dashboard/client/CommentsManagementTab";
import HiringHistoryTab from "@/app/components/Dashboard/client/HiringHistoryTab";

import {
  getUserCommentsAction,
  updateCommentAction,
  deleteCommentAction,
} from "@/lib/actions/api/comments";
import { getClientRequestsAction, completeHiringPaymentAction } from "@/lib/actions/api/hiring";

export default function UserDashboard() {
  const [activeTab, setActiveTab] = useState("hiring-history");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const sessionContext = useSession();
  const sessionUser = sessionContext?.data?.user || sessionContext?.user;

  const [profile, setProfile] = useState({ fullName: "", avatar: "" });
  const [isUpdating, setIsUpdating] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const [hiringHistory, setHiringHistory] = useState([]);
  const [isFetchingHiring, setIsFetchingHiring] = useState(false);
  const [paymentSuccessId, setPaymentSuccessId] = useState(null);

  const [comments, setComments] = useState([]);
  const [isFetchingComments, setIsFetchingComments] = useState(false);
  const [editingComment, setEditingComment] = useState(null);
  const [editText, setEditText] = useState("");
  const [editRating, setEditRating] = useState(5);
  
  const [commentToDelete, setCommentToDelete] = useState(null);

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

  const fetchUserComments = async () => {
    if (!sessionUser?.id) return;
    setIsFetchingComments(true);
    try {
      const data = await getUserCommentsAction(sessionUser.id);
      setComments(Array.isArray(data) ? data : data ? [data] : []);
    } catch (error) {
      console.error("Error pulling live evaluation data pipeline:", error);
      toast.error("Failed to load your posted reviews.");
    } finally {
      setIsFetchingComments(false);
    }
  };

  useEffect(() => {
    if (sessionUser?.id) {
      if (activeTab === "hiring-history") {
        fetchClientHiringRequests();
      } else if (activeTab === "comments") {
        fetchUserComments();
      }
    }
  }, [sessionUser?.id, activeTab]);

  useEffect(() => {
    if (typeof window === "undefined" || !sessionUser?.id) return;

    const urlParams = new URLSearchParams(window.location.search);
    const paymentSuccess = urlParams.get("payment_success");
    const sessionId = urlParams.get("session_id");
    const targetHiringId = urlParams.get("hiringId");

    if (paymentSuccess === "true" && sessionId && targetHiringId) {
      const verifyStripePaymentOnReturn = async () => {
        const syncToast = toast.loading("Verifying transaction parameters with central ledger...");
        try {
          const verifiedRequest = await completeHiringPaymentAction(targetHiringId, sessionId);
          
          if (verifiedRequest) {
            toast.success("Transaction verified! Retainer paid successfully.", { id: syncToast });
            setPaymentSuccessId(targetHiringId);
            fetchClientHiringRequests();
            
            window.history.replaceState({}, document.title, window.location.pathname);
            setTimeout(() => setPaymentSuccessId(null), 5000);
          }
        } catch (err) {
          console.error("Verification sync failed:", err);
          toast.error("Could not sync Stripe session parameter logs.", { id: syncToast });
        }
      };
      verifyStripePaymentOnReturn();
    }
  }, [sessionUser?.id]);

  useEffect(() => {
    if (sessionUser?.name) {
      setProfile((prev) => ({
        ...prev,
        fullName: sessionUser.name,
        avatar: prev.avatar || sessionUser.image || "",
      }));
    }
  }, [sessionUser?.name, sessionUser?.image]);

  useEffect(() => {
    const fetchLiveDatabaseImage = async () => {
      if (sessionUser?.id) {
        try {
          const data = await GetUserImage(sessionUser.id);
          if (data && data.imageUrl) {
            setProfile((prev) => ({ ...prev, avatar: data.imageUrl }));
          }
        } catch (error) {
          console.error("Failed to fetch custom database avatar asset:", error);
        }
      }
    };
    fetchLiveDatabaseImage();
  }, [sessionUser?.id]);

  const handleImageReupload = async (e) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file.");
      return;
    }
    if (!sessionUser?.id) {
      toast.error("User session not found. Please log in again.");
      return;
    }

    const imgbbApiKey = process.env.NEXT_PUBLIC_IMG_UP_DATA;
    setIsUploading(true);
    const toastId = toast.loading("Uploading image to asset server...");

    try {
      const uploadData = new FormData();
      uploadData.append("image", file);

      const response = await fetch(
        `https://api.imgbb.com/1/upload?key=${imgbbApiKey}`,
        {
          method: "POST",
          body: uploadData,
        },
      );
      const result = await response.json();

      if (result.success) {
        const hostedUrl = result.data.url;
        setProfile((prev) => ({ ...prev, avatar: hostedUrl }));
        toast.loading("Syncing avatar with your account profile...", {
          id: toastId,
        });

        if (sessionUser.image || profile.avatar) {
          await UpdateProfileImage({
            userId: sessionUser.id,
            imageUrl: hostedUrl,
          });
        } else {
          await ProfileImage({ userId: sessionUser.id, imageUrl: hostedUrl });
        }

        toast.success("Profile image successfully updated live!", {
          id: toastId,
        });
        if (typeof window !== "undefined") window.location.reload();
      } else {
        throw new Error("Upload failed");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to update profile image asset.", { id: toastId });
    } finally {
      setIsUploading(false);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    if (!profile.fullName.trim()) {
      toast.error("Name cannot be blank.");
      return;
    }
    if (!sessionUser?.id) {
      toast.error("Authentication required. Please log in.");
      return;
    }

    setIsUpdating(true);
    const loadingToast = toast.loading(
      "Updating your profile values in database...",
    );
    try {
      const updatedData = await updateUserNameAction(
        sessionUser.id,
        profile.fullName,
        profile.avatar,
      );
      if (updatedData) {
        setProfile({
          fullName: updatedData.fullName || profile.fullName,
          avatar: updatedData.avatar || profile.avatar,
        });
        toast.success("Profile updated successfully!", { id: loadingToast });
        if (typeof window !== "undefined") window.location.reload();
      } else {
        toast.error("Failed to update user profile on the server.", {
          id: loadingToast,
        });
      }
    } catch (error) {
      console.error("Error executing name update:", error);
      toast.error("An unexpected error occurred.", { id: loadingToast });
    } finally {
      setIsUpdating(false);
    }
  };

  const startEditComment = (comment) => {
    const targetId = comment._id || comment.id;
    setEditingComment(targetId);
    setEditText(comment.text || "");
    setEditRating(Number(comment.rating || 5));
  };

  const saveCommentUpdate = async (commentId, lawyerId) => {
    if (!editText.trim()) {
      toast.error("Comment description text cannot be left unassigned.");
      return;
    }
    const toastId = toast.loading("Saving changes to tracking node...");
    try {
      await updateCommentAction(commentId, {
        text: editText,
        rating: editRating,
        lawyerId: lawyerId,
      });
      toast.success("Comment updated successfully!", { id: toastId });
      setEditingComment(null);
      fetchUserComments();
    } catch (error) {
      console.error("Error updating comment asset:", error);
      toast.error("Failed to update comment matrix row.", { id: toastId });
    }
  };

  const deleteComment = (commentId, lawyerId) => {
    setCommentToDelete({ id: commentId, lawyerId: lawyerId });
  };

  const handleConfirmDelete = async () => {
    if (!commentToDelete) return;

    const { id, lawyerId } = commentToDelete;
    setCommentToDelete(null); 

    const clearToast = toast.loading("Purging structural log entry...");
    try {
      await deleteCommentAction(id, lawyerId);
      toast.success("Comment removed explicitly.", { id: clearToast });
      fetchUserComments();
    } catch (err) {
      console.error(err);
      toast.error("Could not remove specified review ledger item.", {
        id: clearToast,
      });
    }
  };

  const handlePayment = async (hiringRequestId) => {
    if (!hiringRequestId) {
      toast.error("Invalid hiring request context passed.");
      return;
    }

    const toastId = toast.loading("Initializing secure Stripe session gateway...");
    const BaseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
    
    try {
      const response = await fetch(`${BaseUrl}/api/payment/create-checkout-session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hiringId: String(hiringRequestId)
        }),
      });

      const responseText = await response.text();
      let responseData = {};
      try {
        responseData = JSON.parse(responseText);
      } catch (e) {
        throw new Error(`Server returned non-JSON structure (Status ${response.status})`);
      }

      if (!response.ok) {
        throw new Error(responseData.error || responseData.details || "Server error occurred");
      }

      if (responseData.url) {
        toast.loading("Redirecting to Stripe credit card portal...", { id: toastId });
        window.location.href = responseData.url;
      } else {
        throw new Error("No URL returned from checkout generation session endpoint.");
      }
    } catch (error) {
      console.error("Payment pipeline gateway error:", error);
      toast.error(error.message || "Failed to initiate transaction window.", { id: toastId });
    }
  };

  return (
    <div className="min-h-screen bg-[#04080f] text-slate-100 font-sans flex flex-col lg:flex-row relative overflow-x-hidden">
      
      <div className="lg:hidden h-16 bg-[#050a12] border-b border-[#111927] flex items-center justify-between px-4 sticky top-0 z-50 w-full">
        <h1 className="text-xl font-serif text-[#e0a96d] tracking-wide font-medium">
          LexVizo
        </h1>
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="text-slate-100 text-xl focus:outline-none p-2"
        >
          {isSidebarOpen ? "✕" : "☰"}
        </button>
      </div>

      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        profile={profile}
        sessionUser={sessionUser}
      />

      <main className="flex-1 flex flex-col min-w-0 bg-[#04080f]">
        <Header setActiveTab={setActiveTab} profile={profile} />

        <div className="p-4 lg:p-8 max-w-[1600px] w-full mx-auto space-y-8 overflow-x-hidden">
          {activeTab === "hiring-history" && (
            <HiringHistoryTab
              hiringHistory={hiringHistory}
              isLoading={isFetchingHiring}
              paymentSuccessId={paymentSuccessId}
              handlePayment={handlePayment}
            />
          )}

          {activeTab === "update-profile" && (
            <ManageProfileTab
              profile={profile}
              setProfile={setProfile}
              sessionUser={sessionUser}
              isUpdating={isUpdating}
              isUploading={isUploading}
              fileInputRef={fileInputRef}
              handleProfileUpdate={handleProfileUpdate}
              handleImageReupload={handleImageReupload}
            />
          )}

          {activeTab === "comments" && (
            <CommentsManagementTab
              comments={comments}
              isLoading={isFetchingComments}
              editingComment={editingComment}
              editText={editText}
              setEditText={setEditText}
              editRating={editRating}
              setEditRating={setEditRating}
              startEditComment={startEditComment}
              saveCommentUpdate={saveCommentUpdate}
              setEditingComment={setEditingComment}
              deleteComment={deleteComment}
            />
          )}
        </div>
      </main>

      {commentToDelete && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs transition-opacity duration-200">
          <div className="w-full max-w-xl bg-[#090f1c] border border-[#162235] p-6 shadow-2xl relative">
            <button
              onClick={() => setCommentToDelete(null)}
              className="absolute top-4 right-4 text-slate-500 hover:text-slate-300 transition-colors"
            >
              <X size={16} />
            </button>

            <div className="flex items-start gap-4 pr-4">
              <div className="p-2 border border-rose-950 bg-rose-950/20 text-rose-500 shrink-0 mt-0.5">
                <AlertTriangle size={16} />
              </div>
              <div className="space-y-2">
                <h3 className="text-xs font-mono text-[#e0a96d] tracking-wider uppercase font-semibold">
                  CONFIRM COMMENT DELETION
                </h3>
                <p className="text-xs text-slate-400 font-sans leading-relaxed">
                  Are you absolutely sure you want to completely remove this
                  active client evaluation comment from your framework account
                  dashboard parameters? This change cannot be undone.
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6 font-mono text-[10px] uppercase tracking-wider">
              <button
                onClick={() => setCommentToDelete(null)}
                className="px-4 py-2 border border-[#162235] text-slate-400 hover:bg-slate-900/50 transition-colors font-medium rounded-none"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold transition-colors rounded-none"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}