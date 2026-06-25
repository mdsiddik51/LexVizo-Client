"use client";
import React, { useState, useEffect } from "react";
import { Star, Send, User, MessageSquare } from "lucide-react";
import toast from "react-hot-toast";
import { useParams } from "next/navigation";
import { fetchCommentsAction, postCommentAction } from "@/lib/actions/api/comments";
import { GetUserImage } from "@/lib/actions/api/images";
import { getClientRequestsAction } from "@/lib/actions/api/hiring";

const CommentSection = ({ userRole, userSession }) => {
  const { id: lawyerId } = useParams();

  const currentUserId = userSession?.data?.user?.id;
  const currentUserName = userSession?.data?.user?.name || "Corporate Venture Executive";

  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [newComment, setNewComment] = useState("");
  const [currentUserImage, setCurrentUserImage] = useState("");
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasHired, setHasHired] = useState(false);
  const [isHiringChecked, setIsHiringChecked] = useState(false);

  useEffect(() => {
    const showComments = async () => {
      if (!lawyerId) return;
      try {
        setIsLoading(true);
        const commentsData = await fetchCommentsAction(lawyerId);
        setComments(commentsData || []);
      } catch (err) {
        console.error(err);
        toast.error("Failed to populate client evaluations.");
      } finally {
        setIsLoading(false);
      }
    };
    showComments();
  }, [lawyerId]);

  useEffect(() => {
    const fetchUserImage = async () => {
      if (!currentUserId) return;
      try {
        const imageData = await GetUserImage(currentUserId);
        if (imageData?.imageUrl) {
          setCurrentUserImage(imageData.imageUrl);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchUserImage();
  }, [currentUserId]);

  useEffect(() => {
    const verifyHiringRecord = async () => {
      if (!currentUserId || !lawyerId) {
        setHasHired(false);
        setIsHiringChecked(true);
        return;
      }
      try {
        const history = await getClientRequestsAction(currentUserId);
        const matches = history.some(
          (item) => item.lawyerId === lawyerId && ["paid", "accepted"].includes(item.status)
        );
        setHasHired(matches);
      } catch (err) {
        console.error("Error verifying hiring record:", err);
        setHasHired(false);
      } finally {
        setIsHiringChecked(true);
      }
    };
    verifyHiringRecord();
  }, [currentUserId, lawyerId]);

  const handlePostEvaluation = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    if (!currentUserId) {
      toast.error("Security session expired. Please re-authenticate.");
      return;
    }

    const payload = {
      author: currentUserName,
      role: userRole || userSession?.data?.user?.role || "client",
      rating: Number(rating),
      text: newComment.trim(),
      lawyerId,
      userId: currentUserId,
    };

    try {
      const savedComment = await postCommentAction(payload);
      
      setComments([
        {
          ...savedComment,
          _id: savedComment?._id || savedComment?.id || Date.now(),
          author: payload.author,
          role: payload.role,
          rating: payload.rating,
          text: payload.text,
          userImage: savedComment?.userImage || currentUserImage || "",
          date: new Date().toISOString().split("T")[0],
        },
        ...comments,
      ]);

      setNewComment("");
      setRating(5);
      toast.success("Professional evaluation index updated.");
    } catch (error) {
      console.error(error);
      toast.error("Failed to post comment feedback. Only clients who have hired this lawyer can comment.");
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-12 grid grid-cols-1 md:grid-cols-12 gap-12 border-t border-[#131B2E] mt-12">
      <div className="md:col-span-5 space-y-6">
        <div>
          <h2 className="text-lg font-serif text-gray-200 uppercase tracking-wide">
            Client Evaluation Hub
          </h2>
          <p className="text-xs font-mono text-gray-500 mt-1 leading-relaxed">
            Authenticated Profile Identity: <span className="text-[#FCBA80] font-bold">{currentUserName}</span>
          </p>
        </div>

        {userSession?.data?.user ? (
          !isHiringChecked ? (
            <div className="border border-dashed border-[#131B2E] bg-[#090D1A]/20 p-5 text-center animate-pulse">
              <p className="text-[10px] font-mono text-gray-600 uppercase tracking-wider">
                // Verifying retainer history...
              </p>
            </div>
          ) : hasHired ? (
            <form onSubmit={handlePostEvaluation} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono uppercase tracking-wider text-gray-400 block">
                  // Performance Assessment
                </label>
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="transition-transform duration-100 active:scale-95 text-gray-600 focus:outline-none"
                    >
                      <Star
                        size={16}
                        className={`${
                          star <= (hoverRating || rating)
                            ? "fill-[#FCBA80] stroke-[#FCBA80]"
                            : "stroke-gray-700 fill-transparent"
                        } transition-colors`}
                      />
                    </button>
                  ))}
                  <span className="text-[10px] font-mono text-gray-400 ml-2">
                    ({rating}/5)
                  </span>
                </div>
              </div>

              <div className="space-y-1.5">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Record strategic details of engagement performance..."
                  rows={4}
                  className="w-full bg-[#0A0F1D] border border-[#131B2E] text-xs font-mono text-white p-3 focus:outline-none focus:border-[#FCBA80]/40 placeholder-gray-600 transition-colors"
                  required
                />
              </div>

              <button
                type="submit"
                className="flex items-center gap-2 border border-[#131B2E] bg-[#0A0F1D] px-4 py-2 font-mono text-[10px] text-gray-300 uppercase hover:border-[#FCBA80] hover:text-black hover:bg-[#FCBA80] transition-all duration-300"
              >
                File Case Briefing <Send size={10} />
              </button>
            </form>
          ) : (
            <div className="border border-dashed border-[#131B2E] bg-[#090D1A]/20 p-5 text-center">
              <p className="text-[10px] font-mono text-[#FCBA80] uppercase tracking-wider">
                // Evaluation Locked: Active Retainer Required
              </p>
              <p className="text-xs text-gray-500 font-sans mt-2 leading-relaxed">
                You can only submit evaluation comments after successfully hiring this lawyer and having your request accepted or paid.
              </p>
            </div>
          )
        ) : (
          <div className="border border-dashed border-[#131B2E] bg-[#090D1A]/20 p-4 text-center">
            <p className="text-[10px] font-mono text-gray-500 uppercase tracking-wider">
              // Commits Locked: Authentication Shield Active
            </p>
          </div>
        )}
      </div>

      <div className="md:col-span-7 space-y-4">
        {isLoading ? (
          <div className="space-y-4 animate-pulse">
            {[1, 2].map((idx) => (
              <div key={idx} className="border border-[#131B2E] bg-[#090D1A]/20 h-24 w-full" />
            ))}
          </div>
        ) : comments.length === 0 ? (
          <div className="border border-dashed border-[#131B2E] bg-[#090D1A]/10 p-12 text-center flex flex-col items-center justify-center font-mono text-gray-600 text-xs space-y-2">
            <MessageSquare size={18} className="text-gray-700" />
            <span>// PIPELINE_ARRAY_EMPTY: NO FEEDBACK METRICS FOUND</span>
          </div>
        ) : (
          comments.map((item) => (
            <div key={item._id || item.id} className="border border-[#131B2E] bg-[#090D1A]/30 p-5 space-y-3">
              <div className="flex justify-between items-start text-[9px] font-mono border-b border-[#131B2E]/50 pb-2">
                <div className="flex gap-3 items-center">
                  {item.userImage ? (
                    <img 
                      src={item.userImage} 
                      alt={item.author} 
                      className="w-7 h-7 rounded-full object-cover border border-[#131B2E]" 
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-[#0A0F1D] border border-[#131B2E] flex items-center justify-center text-gray-600">
                      <User size={12} />
                    </div>
                  )}
                  <div className="space-y-0.5">
                    <span className="text-[#FCBA80] uppercase tracking-wider block font-bold">
                      {item.author}
                    </span>
                    <span className="text-gray-500">
                      Identity status protocol: [{item.role}]
                    </span>
                  </div>
                </div>
                
                <div className="flex flex-col items-end gap-1">
                  <span className="text-gray-500">{item.date}</span>
                  <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={10}
                        className={
                          i < item.rating
                            ? "fill-[#FCBA80] stroke-[#FCBA80]"
                            : "stroke-gray-700 fill-transparent"
                        }
                      />
                    ))}
                  </div>
                </div>
              </div>

              {item.lawyerDetails?.name && (
                <div className="text-[9px] font-mono text-[#FCBA80]/80 bg-[#FCBA80]/5 px-2 py-0.5 inline-block border border-[#FCBA80]/10">
                  Target Profile: {item.lawyerDetails.name}
                </div>
              )}

              <p className="text-xs font-serif text-gray-400 font-light leading-relaxed">
                {item.text}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CommentSection;