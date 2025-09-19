import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { AUTHOR_BY_GOOGLE_ID_QUERY } from "@/sanity/lib/queries";
import { client } from "@/sanity/lib/client";
import { writeClient } from "@/sanity/lib/write-client";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user: { name, email, image }, profile }) {
      const googleId = profile?.sub; // ✅ Google’s unique user ID

      const existingUser = await client
        .withConfig({ useCdn: false })
        .fetch(AUTHOR_BY_GOOGLE_ID_QUERY, { id: googleId });

      if (!existingUser) {
        await writeClient.create({
          _type: "author",
          id: googleId,
          name,
          username: email?.split("@")[0], // ✅ fallback username
          email,
          image,
          bio: "", // ✅ Google has no bio field
        });
      }

      return true;
    },

    async jwt({ token, account, profile }) {
      if (account && profile) {
        const googleId = profile.sub; // ✅ use sub instead of id

        const user = await client
          .withConfig({ useCdn: false })
          .fetch(AUTHOR_BY_GOOGLE_ID_QUERY, { id: googleId });

        token.id = user?._id;
      }
      return token;
    },

    async session({ session, token }) {
      Object.assign(session, { id: token.id });
      return session;
    },
  },
});
