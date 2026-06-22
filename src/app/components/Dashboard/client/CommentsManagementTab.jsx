"use client";

import React from "react";
import { Star, Loader2 } from "lucide-react";

const  CommentsManagementTab = ({ 
  comments, 
  isLoading,
  editingComment, 
  editText, 
  setEditText, 
  editRating,
  setEditRating,
  startEditComment, 
  saveCommentUpdate, 
  setEditingComment, 
  deleteComment 
}) =>  {
  
  if (isLoading) {
    return (
      <div className="h-60 w-full flex flex-col items-center justify-center space-y-3 font-mono text-xs text-slate-500">
        <Loader2 className="animate-spin text-[#e0a96d]" size={20} />
        <span>// FETCHING LIVE EVALUATION HISTORY MATRIX...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn relative">
      <div>
        <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">
          Dashboard &gt; <span className="text-[#e0a96d]">Comment Management</span>
        </div>
        <h2 className="text-2xl lg:text-3xl font-serif text-slate-100 mt-2 font-normal tracking-wide">Your Profile Valuations</h2>
      </div>

      {comments.length === 0 ? (
        <div className="border border-dashed border-[#111927] p-8 text-center font-mono text-xs text-slate-600 bg-[#050a12]/20">
          // No active client evaluations or structural reviews associated with this account node.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {comments.map((comment) => {
            const commentId = comment._id || comment.id; 
            const isEditing = editingComment === commentId;
            const displayAuthor = comment.author || "Anonymous Client";
            
            const formattedDate = comment.date 
              ? new Date(comment.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })
              : "Recent";

            return (
              <div key={commentId} className="bg-[#050a12] border border-[#111927] p-5 flex flex-col justify-between space-y-4 rounded-none">
                <div>
                  <div className="flex justify-between items-start mb-2 gap-2">
                    <div className="min-w-0 flex-1">
                      <h4 className="font-serif text-slate-200 text-sm font-semibold truncate">
                        {displayAuthor}
                      </h4>
                      <div className="text-[10px] font-mono text-slate-500 capitalize mb-1">
                        Role: {comment.role || "client"}
                      </div>
                      
                      <div className="flex gap-0.5 mt-1">
                        {Array.from({ length: 5 }).map((_, idx) => {
                          const currentStarValue = idx + 1;
                          const activeColor = isEditing
                            ? currentStarValue <= (editRating || 5)
                            : currentStarValue <= Number(comment.rating || 5);

                          return (
                            <Star 
                              key={idx} 
                              size={11} 
                              onClick={() => isEditing && setEditRating && setEditRating(currentStarValue)}
                              className={`${isEditing ? "cursor-pointer" : ""} ${
                                activeColor ? "text-[#e0a96d] fill-[#e0a96d]/20" : "text-slate-700"
                              }`} 
                            />
                          );
                        })}
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-slate-500 shrink-0">{formattedDate}</span>
                  </div>
                  
                  {isEditing ? (
                    <textarea 
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      className="w-full bg-[#09101d] border border-[#e0a96d]/40 p-2 text-xs text-slate-200 focus:outline-none font-mono mt-2 rounded-none"
                      rows={3}
                    />
                  ) : (
                    <p className="text-xs text-slate-400 italic leading-relaxed bg-[#03060b] p-3 border border-[#111927] rounded-none font-serif">
                      "{comment.text}" 
                    </p>
                  )}
                </div>

                <div className="flex gap-2 justify-end pt-2 border-t border-[#111927]/60 font-mono">
                  {isEditing ? (
                    <>
                      <button 
                        onClick={() => setEditingComment(null)} 
                        className="border border-slate-700 text-slate-400 text-[10px] uppercase px-3 py-1 hover:bg-slate-800 rounded-none"
                      >
                        Cancel
                      </button>
                      <button 
                        onClick={() => saveCommentUpdate(commentId, comment.lawyerId)} 
                        className="bg-[#e0a96d] text-black font-bold text-[10px] uppercase px-3 py-1 rounded-none hover:bg-[#cda063]"
                      >
                        Save
                      </button>
                    </>
                  ) : (
                    <>
                      <button 
                        onClick={() => startEditComment(comment)} 
                        className="border border-slate-700 text-slate-300 text-[10px] uppercase px-3 py-1 hover:bg-slate-800 transition-colors rounded-none"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => deleteComment(commentId, comment.lawyerId)} 
                        className="border border-rose-900/40 text-rose-400 hover:bg-rose-950/20 text-[10px] uppercase px-3 py-1 transition-colors rounded-none"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}


export default CommentsManagementTab;