"use client";

import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { BadgePlus } from "lucide-react";
import LogoutButton from "./LogoutButton";

interface AuthenticatedNavProps {
  user: {
    id?: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
  userId?: string;
}

export default function AuthenticatedNav({
  user,
  userId,
}: AuthenticatedNavProps) {
  return (
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
      <LogoutButton />

      {/* Avatar */}
      <Link href={`/user/${userId}`}>
        <Avatar className="">
          <AvatarImage
            src={user?.image || ""}
            alt={user?.name || ""}
            width={60}
            className="rounded-full object-cover"
          />
          <AvatarFallback>AV</AvatarFallback>
        </Avatar>
      </Link>
    </>
  );
}
