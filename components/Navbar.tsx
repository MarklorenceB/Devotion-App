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
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 text-sm sm:text-base font-medium shadow-sm hover:bg-gray-100 transition"
              >
                {/* Google Icon */}
                <svg
                  className="w-5 h-5"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 48 48"
                >
                  <path
                    fill="#4285F4"
                    d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.93 2.38 30.47 0 24 0 14.62 0 6.51 5.42 2.57 13.28l7.98 6.2C12.35 13.21 17.74 9.5 24 9.5z"
                  />
                  <path
                    fill="#34A853"
                    d="M46.1 24.5c0-1.57-.14-3.08-.41-4.5H24v9h12.35c-.53 2.77-2.1 5.12-4.48 6.69l7.02 5.45C43.59 37.64 46.1 31.49 46.1 24.5z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M10.55 28.48a14.5 14.5 0 0 1 0-8.96l-7.98-6.2a23.98 23.98 0 0 0 0 21.36l7.98-6.2z"
                  />
                  <path
                    fill="#EA4335"
                    d="M24 48c6.48 0 11.93-2.13 15.91-5.79l-7.02-5.45c-2 1.35-4.54 2.14-8.89 2.14-6.26 0-11.65-3.71-13.45-9.02l-7.98 6.2C6.51 42.58 14.62 48 24 48z"
                  />
                </svg>

                <span>Sign in with Google</span>
              </button>
            </form>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
