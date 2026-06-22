"use client";

import { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { AlertTriangle, X } from "lucide-react";

// Data pipelines
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

// Updated Comment Actions
import {
  getUserCommentsAction,
  updateCommentAction,
  deleteCommentAction,
} from "@/lib/actions/api/comments";

export default function UserDashboard() {
  const [activeTab, setActiveTab] = useState("hiring-history");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const sessionContext = useSession();
  const sessionUser = sessionContext?.data?.user || sessionContext?.user;

  const [profile, setProfile] = useState({ fullName: "", avatar: "" });
  const [isUpdating, setIsUpdating] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  // Interactive UI arrays
  const [hiringHistory, setHiringHistory] = useState([
    {
      id: 1,
      lawyer: "Md Lawyer",
      email: "jondowd@gamil.com",
      specialization: "lege",
      fee: "Package: $234,324",
      date: "Jun 21, 2026",
      urgency: "STANDARD",
      status: "pending",
    },
    {
      id: 2,
      lawyer: "Md. Harvey Specter",
      email: "harvey@specterlegal.com",
      specialization: "Corporate Law",
      fee: "$500/hr",
      date: "Jun 20, 2026",
      urgency: "HIGH",
      status: "accepted",
    },
    {
      id: 3,
      lawyer: "Jessica Pearson",
      email: "jessica@pearson.com",
      specialization: "Mergers & Acquisitions",
      fee: "$750/hr",
      date: "Jun 18, 2026",
      urgency: "STANDARD",
      status: "rejected",
    },
  ]);

  // Dynamic comments system states
  const [comments, setComments] = useState([]);
  const [isFetchingComments, setIsFetchingComments] = useState(false);
  const [editingComment, setEditingComment] = useState(null);
  const [editText, setEditText] = useState("");
  const [editRating, setEditRating] = useState(5);
  const [paymentSuccessId, setPaymentSuccessId] = useState(null);

  
  const [commentToDelete, setCommentToDelete] = useState(null);

  
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
    if (sessionUser?.id && activeTab === "comments") {
      fetchUserComments();
    }
  }, [sessionUser?.id, activeTab]);

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

  const handlePayment = (id) => {
    setPaymentSuccessId(id);
    toast.success("Retainer Fee paid successfully!");
    setTimeout(() => setPaymentSuccessId(null), 4000);
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
