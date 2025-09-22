"use client";

import { useState, useEffect } from "react";

interface ReactionButtonsProps {
  postId: string;
  initialReactions: {
    like: number;
    love: number;
    pray: number;
    wow: number;
  };
  userId?: string;
}

type ReactionType = "like" | "love" | "pray" | "wow";

const ReactionButtons = ({
  postId,
  initialReactions,
  userId,
}: ReactionButtonsProps) => {
  const [counts, setCounts] = useState(initialReactions);
  const [userReaction, setUserReaction] = useState<ReactionType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showReactionMsg, setShowReactionMsg] = useState(false);

  useEffect(() => {
    const storageKey = `reaction_${postId}`;
    const savedReaction = localStorage.getItem(storageKey);
    if (
      savedReaction &&
      ["like", "love", "pray", "wow"].includes(savedReaction)
    ) {
      setUserReaction(savedReaction as ReactionType);
    }
  }, [postId]);

  const handleReact = async (type: ReactionType) => {
    if (isLoading) return;
    const storageKey = `reaction_${postId}`;

    if (userReaction === type) return;

    setIsLoading(true);

    try {
      const newCounts = { ...counts };
      if (userReaction) {
        newCounts[userReaction] = Math.max(0, newCounts[userReaction] - 1);
      }
      newCounts[type] = newCounts[type] + 1;

      setCounts(newCounts);
      setUserReaction(type);
      localStorage.setItem(storageKey, type);

      setShowReactionMsg(true);
      setTimeout(() => setShowReactionMsg(false), 3000);

      const response = await fetch("/api/react", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          postId,
          type,
          previousReaction: userReaction,
          userId,
        }),
      });

      const result = await response.json();
      if (!response.ok)
        throw new Error(result.error || `HTTP ${response.status}`);
      if (result.counts) setCounts(result.counts);
    } catch (error) {
      console.error("Failed to update reaction:", error);
      setCounts(initialReactions);
      setUserReaction(null);
      localStorage.removeItem(storageKey);
    } finally {
      setIsLoading(false);
    }
  };

  const reactionButtons = [
    { type: "like" as ReactionType, emoji: "👍", label: "Like" },
    { type: "love" as ReactionType, emoji: "❤️", label: "Love" },
    { type: "pray" as ReactionType, emoji: "🙏", label: "Pray" },
    { type: "wow" as ReactionType, emoji: "😮", label: "Wow" },
  ];

  return (
    <div
      className="
        flex flex-wrap gap-2 sm:gap-3 mt-4 p-2 sm:p-3  rounded-lg 
        justify-center sm:justify-start
      "
    >
      {reactionButtons.map(({ type, emoji, label }) => (
        <button
          key={type}
          onClick={() => handleReact(type)}
          disabled={isLoading}
          className={`
            flex items-center gap-1 px-2 py-1 sm:px-3 sm:py-1.5 
            rounded-full shadow-sm transition-all duration-200 
            text-xs sm:text-sm font-medium
            ${
              userReaction === type
                ? "bg-primary text-white shadow-md scale-105"
                : "bg-white hover:shadow-md hover:scale-105"
            }
            ${isLoading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
          `}
          title={`${label} this devotion`}
        >
          <span className="text-sm sm:text-base">{emoji}</span>
          <span className="min-w-[14px] sm:min-w-[16px] text-center text-gray-700 text-xs sm:text-base">
            {counts[type] > 0 ? counts[type] : ""}
          </span>
        </button>
      ))}

      {userReaction && (
        <div
          className={`
            w-full sm:w-auto flex items-center justify-center sm:justify-start
            mt-2 sm:mt-0 text-[11px] sm:text-sm text-gray-500
            transition-opacity duration-700
            ${showReactionMsg ? "opacity-100" : "opacity-0"}
          `}
        >
          <span>
            You reacted with{" "}
            {reactionButtons.find((r) => r.type === userReaction)?.emoji}
          </span>
        </div>
      )}
    </div>
  );
};

export default ReactionButtons;
