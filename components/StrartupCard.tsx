"use client";

import { formatDate } from "@/lib/utils";
import { Book, EyeIcon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "./ui/button";
import { Author, Startup } from "@/sanity/types";
import ReactionButtons from "./ReactionsButton";

export type StartupTypeCard = Omit<Startup, "author"> & { author?: Author };

const StrartupCard = ({ post }: { post: StartupTypeCard }) => {
  const {
    _createdAt,
    views,
    author,
    title,
    category,
    _id,
    image,
    description,
    reactions,
  } = post;

  // Default reaction counts if not provided
  const defaultReactions = {
    like: 0,
    love: 0,
    pray: 0,
    wow: 0,
    ...reactions, // Spread existing reactions to override defaults
  };

  return (
    <li className="startup-card group">
      <div className="flex-between">
        <p className="startup_card_date">{formatDate(_createdAt)}</p>
        <div className="flex gap-1.5">
          <EyeIcon className="size-6 text-primary" />
          <span className="text-16-medium">{views}</span>
        </div>
      </div>

      <div className="flex-between mt-5 gap-5">
        <div className="flex-1">
          <Link
            href={`/user/${author?._id}`}
            className="text-16-medium line-clamp-1"
          >
            {author?.name || "Anonymous"}
          </Link>

          <Link
            href={`/startup/${_id}`}
            className="text-26-semibold mt-3 line-clamp-2 mb-3"
          >
            {title}
          </Link>
        </div>

        <Book className="w-10 h-10 text-dark-600" />
      </div>

      <Link href={`/startup/${_id}`}>
        <p className="startup-card-desc mb-4">{description}</p>
        <img src={image} alt="placeholder" className="startup-card_img" />
      </Link>

      <div className="flex-between gap-3 mt-5">
        <Link href={`/?query=${category?.toLowerCase()}`}>
          <p className="text-16-medium">{category}</p>
        </Link>
        <Button className="startup-card_btn" asChild>
          <Link href={`/startup/${_id}`}>Details</Link>
        </Button>
      </div>

      {/* ✅ Use the separate ReactionButtons component */}
      <ReactionButtons
        postId={_id}
        initialReactions={defaultReactions}
        userId={author?._id} // Optional: pass user ID if available
      />
    </li>
  );
};

export default StrartupCard;
