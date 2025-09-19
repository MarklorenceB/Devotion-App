import Link from "next/link";
import React from "react";
import Image from "next/image";

import { auth, signOut, signIn } from "@/auth";
import { Span } from "next/dist/trace";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { BadgePlus, LogOut } from "lucide-react";

export const Navbar = async () => {
  const session = await auth();

  return (
    <header className="px-4 sm:px-6 py-3 bg-white shadow-md font-work-sans">
      <nav className="flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="font-bold text-lg">
          <Image
            src="/logo.png"
            alt="Logo"
            width={100}
            height={50}
            className="object-contain"
          />
        </Link>

        {/* Right side */}
        <div className="flex items-center gap-4 text-black font-medium">
          {session && session?.user ? (
            <>
              {/* Create button / icon */}
              <Link
                href="/startup/create"
                className="flex items-center gap-1 text-sm sm:text-base"
              >
                <BadgePlus className="size-6" />
                <span className="hidden sm:inline">Create</span>
              </Link>

              {/* Logout */}
              <form
                action={async () => {
                  "use server";
                  await signOut({ redirectTo: "/" });
                }}
              >
                <button
                  type="submit"
                  className="flex items-center gap-1 text-sm sm:text-base"
                >
                  <LogOut className="size-6 text-red-500" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </form>

              {/* Avatar */}
              <Link href={`/user/${session?.id}`}>
                <Avatar className="">
                  <AvatarImage
                    src={session?.user?.image || ""}
                    alt={session?.user?.name || ""}
                    width={60}
                    className="rounded-full object-cover"
                  />
                  <AvatarFallback>AV</AvatarFallback>
                </Avatar>
              </Link>
            </>
          ) : (
            <form
              action={async () => {
                "use server";
                await signIn("google");
              }}
            >
              <button
                type="submit"
                className="px-3 py-1 rounded-md bg-purple-600 text-white text-sm sm:text-base"
              >
                Sign in
              </button>
            </form>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
