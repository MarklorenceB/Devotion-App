import { formatDate } from "@/lib/utils";
import { EyeIcon } from "lucide-react"; // <-- dito lang si EyeIcon
import Link from "next/link"; // <-- dapat galing sa next/link
import Image from "next/image";
import { Button } from "./ui/button";
import { Author, Startup } from "@/sanity/types";

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
  } = post;
  return (
    <li className="startup-card group">
      <div className="flex-between">
        <p className="startup_card_date">{formatDate(post._createdAt)}</p>
        <div className="flex gap-1.5">
          <EyeIcon className="size-6 text-primary" />
          <span className="text-16-medium">{post.views}</span>
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
            className="text-26-semibold mt-3 line-clamp-2 "
          >
            {title}
          </Link>
        </div>
        <Image
          src={post.author?.image || "https://placehold.co/64x64"}
          alt={post.author?.name || "avatar"}
          width={64}
          height={64}
          className="rounded-full drop-shadow-lg object-cover"
        />
      </div>

      <Link href={`/startup/${_id}`}>
        <p className="startup-card-desc">{description}</p>

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
    </li>
  );
};

export default StrartupCard;
