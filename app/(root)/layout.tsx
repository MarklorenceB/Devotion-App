import Navbar from "@/components/Navbar";
import { SessionProvider } from "next-auth/react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="font-work-sans">
      <Navbar />
      <SessionProvider>{children}</SessionProvider>
    </main>
  );
}
