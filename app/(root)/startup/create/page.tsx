import { auth } from "@/auth";
import Footer from "@/components/Footer";
import StartupForm from "@/components/StartupForm";
import { redirect } from "next/navigation";

export const Page = async () => {
  const session = await auth();

  if (!session) redirect("/");

  return (
    <>
      <section className="pink_container !min-h-[230px]">
        <h1 className="heading">Share Your Devotion</h1>
      </section>

      <StartupForm />
      <Footer />
    </>
  );
};

export default Page;
