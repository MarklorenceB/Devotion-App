import { auth } from "@/auth";
import React from "react";

export const Footer = async () => {
  const session = await auth();
  return (
    <footer className="bg-gray-100 text-center py-6 mt-10 font-work-sans ">
      <p className="text-sm text-gray-600">
        © {new Date().getFullYear()} Daily Devotion.
        <span className="block sm:inline"> All rights reserved.</span>
      </p>
      <p className="text-xs text-gray-500 mt-2 font-work-sans ">
        “Your word is a lamp to my feet and a light to my path.” – Psalm 119:105
      </p>
    </footer>
  );
};

export default Footer;
