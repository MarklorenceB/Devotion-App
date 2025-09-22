"use client";

import React, { useState } from "react";
import StrartupCard, { StartupTypeCard } from "@/components/StrartupCard";

interface ShowMoreButtonProps {
  posts: StartupTypeCard[];
}

const ShowMoreButton: React.FC<ShowMoreButtonProps> = ({ posts }) => {
  const [visibleCount, setVisibleCount] = useState(6);
  const ITEMS_PER_PAGE = 6;

  const showMore = () => {
    setVisibleCount((prev) => prev + ITEMS_PER_PAGE);
  };

  const showLess = () => {
    setVisibleCount(6);
  };

  const visiblePosts = posts.slice(0, visibleCount);
  const hasMore = visibleCount < posts.length;
  const showingAll = visibleCount >= posts.length;

  return (
    <>
      <ul className="mt-7 card_grid">
        {visiblePosts.length > 0 ? (
          visiblePosts.map((post: StartupTypeCard) => (
            <StrartupCard key={post._id} post={post} />
          ))
        ) : (
          <p className="no-results">No startups found</p>
        )}
      </ul>

      {posts.length > 6 && (
        <div className="flex flex-col items-center mt-8 gap-4">
          <div className="flex gap-4">
            {hasMore && (
              <button
                onClick={showMore}
                className="button-show px-6 py-3 text-dark rounded-lg hover:bg-primary/90 transition-all duration-300 font-semibold bg-primary shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-2"
              >
                Show More ({posts.length - visibleCount} remaining)
              </button>
            )}

            {showingAll && visibleCount > 6 && (
              <button
                onClick={showLess}
                className="button-show px-6 py-3 text-dark rounded-lg hover:bg-primary/90 transition-all duration-300 font-semibold bg-primary shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-2"
              >
                Show Less
              </button>
            )}
          </div>

          <p className="text-sm text-gray-600">
            Showing {Math.min(visibleCount, posts.length)} of {posts.length}{" "}
            devotions
          </p>
        </div>
      )}
    </>
  );
};

export default ShowMoreButton;
