"use client";
import React, { useState, useEffect } from 'react';
import { Star } from "lucide-react";
import { fetchCommentsAction } from "@/lib/actions/api/comments";

// Component to handle calculating and showing the rating of a single lawyer
export const FeaturedLawyerRating = ({ lawyerId }) => {
  const [rating, setRating] = useState("...");

  useEffect(() => {
    let isMounted = true;

    const loadRatingData = async () => {
      if (!lawyerId) return;
      try {
        const comments = await fetchCommentsAction(lawyerId);
        if (!isMounted) return;

        if (comments && comments.length > 0) {
          // Extract numbers from comments and filter out empty values
          const validRatings = comments
            .map(c => Number(c.rating || c.stars || 0))
            .filter(r => !isNaN(r) && r > 0);
          
          if (validRatings.length > 0) {
            const totalSum = validRatings.reduce((acc, curr) => acc + curr, 0);
            setRating((totalSum / validRatings.length).toFixed(1));
            return;
          }
        }
        setRating("N/A");
      } catch (err) {
        if (isMounted) setRating("N/A");
      }
    };

    loadRatingData();
    return () => { isMounted = false; };
  }, [lawyerId]);

  return (
    <div className="flex items-center gap-1 font-mono text-[10px] text-slate-400">
      <Star size={10} className="text-amber-400 fill-amber-400/10 shrink-0" />
      <span className="text-slate-200 font-semibold">{rating}</span>
    </div>
  );
};