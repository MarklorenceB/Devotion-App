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
  const [animatingButton, setAnimatingButton] = useState<ReactionType | null>(
    null
  );

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
    if (userReaction === type) return; // Prevent clicking the same reaction

    const storageKey = `reaction_${postId}`;

    // Store original state for rollback
    const originalCounts = { ...counts };
    const originalUserReaction = userReaction;

    // INSTANT UI updates - no loading state initially
    const newCounts = { ...counts };
    if (userReaction) {
      newCounts[userReaction] = Math.max(0, newCounts[userReaction] - 1);
    }
    newCounts[type] = newCounts[type] + 1;

    // Apply changes immediately
    setCounts(newCounts);
    setUserReaction(type);
    localStorage.setItem(storageKey, type);

    // Quick animation feedback
    setAnimatingButton(type);
    setTimeout(() => setAnimatingButton(null), 200);

    setShowReactionMsg(true);
    setTimeout(() => setShowReactionMsg(false), 2500);

    // Background API call (no loading state shown)
    try {
      const response = await fetch("/api/react", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          postId,
          type: type,
          previousReaction: userReaction,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || `HTTP ${response.status}`);
      }

      // Sync with server response (subtle update)
      if (result.counts) {
        setCounts(result.counts);
      }
    } catch (error) {
      console.error("Failed to update reaction:", error);

      // Rollback on error - show a brief loading state only on error
      setIsLoading(true);
      setTimeout(() => {
        setCounts(originalCounts);
        setUserReaction(originalUserReaction);

        // Rollback localStorage
        if (originalUserReaction) {
          localStorage.setItem(storageKey, originalUserReaction);
        } else {
          localStorage.removeItem(storageKey);
        }

        setShowReactionMsg(false);
        setIsLoading(false);

        // Show error briefly
        alert("Could not update reaction. Please try again.");
      }, 300);
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
        flex flex-wrap gap-2 sm:gap-3 mt-4 p-2 sm:p-3 rounded-lg 
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
            rounded-full shadow-sm transition-all duration-150
            text-xs sm:text-sm font-medium transform-gpu
            ${
              userReaction === type
                ? "bg-primary text-white shadow-md scale-105"
                : "bg-white hover:shadow-md hover:scale-105"
            }
            ${animatingButton === type ? "animate-pulse scale-110" : ""}
            ${isLoading ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:bg-gray-50"}
            active:scale-95
          `}
          title={`${label} this devotion`}
        >
          <span
            className={`text-sm sm:text-base transition-transform duration-150 ${
              animatingButton === type ? "scale-125" : ""
            }`}
          >
            {emoji}
          </span>
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
            transition-all duration-300 transform
            ${showReactionMsg ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1"}
          `}
        >
          <span className="flex items-center gap-1">
            <span className="animate-bounce">
              {reactionButtons.find((r) => r.type === userReaction)?.emoji}
            </span>
            <span>Thank you for reacting!</span>
          </span>
        </div>
      )}

      {/* Only show loading on error recovery */}
      {isLoading && (
        <div className="w-full flex justify-center mt-2">
          <div className="text-xs text-red-500 flex items-center">
            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-red-500 mr-1"></div>
            Fixing error...
          </div>
        </div>
      )}
    </div>
  );
};

export default ReactionButtons;
