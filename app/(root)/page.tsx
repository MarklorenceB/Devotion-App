import Image from "next/image";
import SearchForm from "@/components/SearchForm";
import StrartupCard, { StartupTypeCard } from "@/components/StrartupCard";
import { STARTUPS_QUERY } from "@/sanity/lib/queries";
import { sanityFetch, SanityLive } from "@/sanity/lib/live";
import { auth } from "@/auth";
import Footer from "@/components/Footer";
import ShowMoreButton from "@/components/ShowMoreButton";

export default async function Home({
  searchParams,
}: {
  searchParams?: Promise<{ query?: string }>;
}) {
  // Await the searchParams promise before accessing its properties
  const resolvedSearchParams = await searchParams;
  const query = resolvedSearchParams?.query;

  const params = { search: query || null };
  const session = await auth();

  console.log(session?.id);

  const { data: posts } = await sanityFetch({
    query: STARTUPS_QUERY,
    params,
  });

  return (
    <>
      <section className="pink_container">
        <h1 className="heading">
          Share Your Devotion,
          <br />
          Connect With Believers
        </h1>
        <p className="sub-heading !max-w-3xl mt-5">
          Share your ideas, support others with your vote, and shine in virtual
          competitions.
        </p>
        <SearchForm query={query} />
      </section>

      <section className="section_container">
        <p className="text-30-semibold">
          {query ? `Search results for "${query}"` : " All Devotions"}
        </p>

        <ShowMoreButton posts={posts} />

        <SanityLive />
      </section>
      <Footer />
    </>
  );
}
