import Link from "next/link";
import React from "react";
import Image from "next/image";

import { auth, signOut, signIn } from "@/auth";
import { Span } from "next/dist/trace";

export const Navbar = async () => {
  const session = await auth();

  return (
    <header className="px-50 py-3 bg-white shadow-md font-work-sans">
      <nav className="flex justify-between item-center">
        <Link href="/" className="font-bold text-lg">
          <Image src="/logo.png" alt="Logo" width={120} height={30} />
        </Link>

        <div className="flex items-center gap-5 text-black font-medium">
          {session && session?.user ? (
            <>
              <Link href="/startup/create">
                <span className="max-sm:hidden">Create</span>
              </Link>

              <form
                action={async () => {
                  "use server";

                  await signOut({ redirectTo: "/" });
                }}
              >
                <button type="submit">Logout</button>
              </form>
              <Link href={`/user/${session?.user.id}`}>
                <span>{session?.user?.name}</span>
              </Link>
            </>
          ) : (
            <form
              action={async () => {
                "use server";
                await signIn("google");
              }}
            >
              <button type="submit">Signin with Google</button>
            </form>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
