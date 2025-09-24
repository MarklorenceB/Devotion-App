"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

type ReactionType = "like" | "love" | "pray" | "wow";

type CommentType = {
  _id?: string;
  _key?: string;
  user?: string;
  avatar?: string;
  message: string;
  createdAt?: string;
  reactions?: {
    like: number;
    love: number;
    pray: number;
    wow: number;
  };
};

export default function Comments({
  postId,
  comments = [],
}: {
  postId: string;
  comments?: CommentType[];
}) {
  const { data: session } = useSession();
  const [localComments, setLocalComments] = useState<CommentType[]>([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Track user reaction per comment (not counts!)
  const [userReactions, setUserReactions] = useState<
    Record<string, ReactionType | null>
  >({});

  // ✅ Initialize comments + restore user reactions
  useEffect(() => {
    // First, set the comments with their existing reaction counts
    setLocalComments(
      comments.map((comment) => ({
        ...comment,
        reactions: comment.reactions || { like: 0, love: 0, pray: 0, wow: 0 },
      }))
    );

    // Then restore user reactions from localStorage
    const newUserReactions: Record<string, ReactionType | null> = {};
    comments.forEach((comment) => {
      if (comment._key) {
        const savedUserReaction = localStorage.getItem(
          `comment_reaction_${comment._key}`
        );
        if (
          savedUserReaction &&
          ["like", "love", "pray", "wow"].includes(savedUserReaction)
        ) {
          newUserReactions[comment._key] = savedUserReaction as ReactionType;
        }
      }
    });
    setUserReactions(newUserReactions);
  }, [comments]);

  // ✅ Handle new comment submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setLoading(true);

    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          postId,
          message: message.trim(),
          user: session?.user?.name || "Guest",
          avatar: session?.user?.image || "",
        }),
      });

      const data = await res.json();

      const newComment: CommentType = {
        _key: data.result._key,
        user: data.result.user,
        avatar: data.result.avatar || "/default-avatar.png",
        message: data.result.message,
        createdAt: data.result.createdAt,
        reactions: { like: 0, love: 0, pray: 0, wow: 0 },
      };

      setLocalComments((prev) => [...prev, newComment]);
      setMessage("");
    } catch (err) {
      console.error("Submit error:", err);
      alert("Failed to post comment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Handle reactions (sync with Sanity)
  const handleReaction = async (commentKey: string, type: ReactionType) => {
    const userReactionStorageKey = `comment_reaction_${commentKey}`;
    const comment = localComments.find((c) => c._key === commentKey);
    if (!comment) return;

    const previousReaction = userReactions[commentKey] || null;
    if (previousReaction === type) return;

    // Optimistic UI update
    setLocalComments((prev) =>
      prev.map((c) => {
        if (c._key !== commentKey) return c;
        const newReactions = { ...c.reactions };
        if (previousReaction) {
          newReactions[previousReaction] = Math.max(
            0,
            (newReactions[previousReaction] || 0) - 1
          );
        }
        newReactions[type] = (newReactions[type] || 0) + 1;
        return { ...c, reactions: newReactions };
      })
    );

    setUserReactions((prev) => ({ ...prev, [commentKey]: type }));
    localStorage.setItem(userReactionStorageKey, type);

    try {
      const res = await fetch("/api/comment-react", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId, commentKey, type, previousReaction }),
      });

      const data = await res.json();

      if (data.updated && data.updated.comments) {
        // ✅ Replace state with Sanity truth, but preserve user reactions
        setLocalComments(
          data.updated.comments.map((comment: CommentType) => ({
            ...comment,
            reactions: comment.reactions || {
              like: 0,
              love: 0,
              pray: 0,
              wow: 0,
            },
          }))
        );
      }
    } catch (error) {
      console.error("Reaction failed", error);
      // Revert optimistic update on error
      setLocalComments((prev) =>
        prev.map((c) => {
          if (c._key !== commentKey) return c;
          const revertedReactions = { ...c.reactions };
          if (previousReaction) {
            revertedReactions[previousReaction] =
              (revertedReactions[previousReaction] || 0) + 1;
          }
          revertedReactions[type] = Math.max(
            0,
            (revertedReactions[type] || 0) - 1
          );
          return { ...c, reactions: revertedReactions };
        })
      );
      setUserReactions((prev) => ({ ...prev, [commentKey]: previousReaction }));
      if (previousReaction) {
        localStorage.setItem(userReactionStorageKey, previousReaction);
      } else {
        localStorage.removeItem(userReactionStorageKey);
      }
    }
  };

  const reactionButtons: { type: ReactionType; emoji: string }[] = [
    { type: "like", emoji: "👍" },
    { type: "love", emoji: "❤️" },
    { type: "pray", emoji: "🙏" },
    { type: "wow", emoji: "😮" },
  ];

  return (
    <div className="max-w-2xl mx-auto mt-8">
      <h3 className="text-lg font-semibold mb-4">Comments</h3>

      <ul className="space-y-4 mb-6">
        {localComments.length > 0 ? (
          localComments.map((c, i) => (
            <li key={c._key || i} className="border-b pb-2">
              <div className="flex items-center gap-2">
                <img
                  src={
                    c.avatar ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      c.user || "Guest"
                    )}&background=6366f1&color=fff&size=40`
                  }
                  alt={c.user || "Guest"}
                  className="w-10 h-10 rounded-full object-cover bg-gray-200"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      c.user || "Guest"
                    )}&background=6366f1&color=fff&size=40`;
                  }}
                />
                <p className="text-sm font-medium">{c.user || "Guest"}</p>
              </div>
              <p className="text-gray-700 mt-1">{c.message}</p>
              {c.createdAt && (
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(c.createdAt).toLocaleString()}
                </p>
              )}

              {/* ✅ Reactions */}
              <div className="flex gap-2 mt-2 text-xs">
                {reactionButtons.map(({ type, emoji }) => (
                  <button
                    key={type}
                    onClick={() => handleReaction(c._key!, type)}
                    className={`px-2 py-1 rounded ${
                      userReactions[c._key!] === type
                        ? " bg-gray-100 text-dark"
                        : "bg-gray-100 "
                    }`}
                  >
                    {emoji} {c.reactions?.[type] || 0}
                  </button>
                ))}
              </div>
            </li>
          ))
        ) : (
          <p className="text-gray-500 text-sm">No comments yet.</p>
        )}
      </ul>

      {session ? (
        <form onSubmit={handleSubmit} className="space-y-3">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Write a comment..."
            className="w-full border rounded-md p-2 text-sm"
            rows={3}
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !message.trim()}
            className="px-4 py-2 bg-green text-white rounded-md text-sm hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Posting..." : "Post Comment"}
          </button>
        </form>
      ) : (
        <p className="text-sm text-gray-500">
          You must be logged in to post a comment.
        </p>
      )}
    </div>
  );
}
