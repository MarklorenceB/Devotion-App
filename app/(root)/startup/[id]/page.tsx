import React, { Suspense } from "react";
import { formatDate } from "@/lib/utils";
import { client } from "@/sanity/lib/client";
import { STARTUP_BY_ID_QUERY } from "@/sanity/lib/queries";

import Image from "next/image";
import markdownit from "markdown-it";
import { Skeleton } from "@/components/ui/skeleton";
import View from "@/components/View";
import Comments from "@/components/Comments";
import Footer from "@/components/Footer";

const md = new markdownit();

const page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const id = (await params).id;
  const post = await client.fetch(STARTUP_BY_ID_QUERY, { id });

  if (!post) {
    return <p className="no-results">No startup found</p>;
  }

  const parsedContent = md.render(post?.pitch || "");

  return (
    <>
      {/* Hero Section */}
      <section className="pink_container !min-h-[230px] px-4 sm:px-6 lg:px-8">
        <p className="tag">{formatDate(post?._createdAt)}</p>

        <h1 className="heading mt-5">{post.title}</h1>
        <p className="sub-heading !max-w-5xl mt-3">{post.description}</p>
      </section>

      <div className="w-full flex justify-center mt-10 px-4 sm:px-6 lg:px-8">
        <Image
          src={post.image}
          alt="thumbnail"
          width={1200}
          height={800}
          className="rounded-xl object-cover w-full max-w-5xl h-[400px] sm:h-[500px] shadow-lg"
          priority
        />
      </div>

      {/* Content Wrapper */}
      <div className="space-y-5 mt-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex-between gap-5">
          <div className="flex gap-3 items-center mb-3">
            {post.author?.image ? (
              <Image
                src={post.author.image}
                alt={post.author.name || "avatar"}
                width={64}
                height={64}
                className="rounded-full drop-shadow-lg"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-gray-300" /> // fallback avatar
            )}
            <div>
              <p className="text-20-medium">{post.author?.name}</p>
              <p className="text-16-medium !text-black-300">
                @{post.author?.username}
              </p>
            </div>
          </div>

          <p className="category-tag">{post.category}</p>
        </div>

        {/* Pitch Details */}
        <h3 className="text-30-bold">Devotion Details</h3>
        {parsedContent ? (
          <article
            className="prose max-w-4xl font-work-sans break-words"
            dangerouslySetInnerHTML={{ __html: parsedContent }}
          />
        ) : (
          <p className="no-result">No details provided</p>
        )}

        <hr className="divider" />

        <Suspense fallback={<Skeleton />}>
          <View id={id} />
        </Suspense>
      </div>

      {/* Comments Section */}
      <div className="max-w-5xl mx-auto w-full mt-10 px-4 sm:px-6 lg:px-8 mb-5">
        <Comments postId={post._id} comments={post.comments || []} />
      </div>

      <Footer />
    </>
  );
};

export default page;
