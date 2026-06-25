"use client";
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useSession } from "@/lib/auth-client";
import { AlertTriangle, X } from "lucide-react";
import CommentsManagementTab from "@/app/components/Dashboard/client/CommentsManagementTab";
import {
  getUserCommentsAction,
  updateCommentAction,
  deleteCommentAction,
} from "@/lib/actions/api/comments";

export default function UserComments() {
  const sessionContext = useSession();
  const sessionUser = sessionContext?.data?.user || sessionContext?.user;

  const [comments, setComments] = useState([]);
  const [isFetchingComments, setIsFetchingComments] = useState(false);
  const [editingComment, setEditingComment] = useState(null);
  const [editText, setEditText] = useState("");
  const [editRating, setEditRating] = useState(5);

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
    if (sessionUser?.id) {
      fetchUserComments();
    }
  }, [sessionUser?.id]);

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

  return (
    <div className="w-full">
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
                <h3 className="text-xs font-mono text-[#FCBA80] tracking-wider uppercase font-semibold">
                  CONFIRM COMMENT DELETION
                </h3>
                <p className="text-xs text-slate-400 font-sans leading-relaxed">
                  Are you absolutely sure you want to completely remove this active client evaluation comment? This change cannot be undone.
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
