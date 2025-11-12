import NextAuth, { type NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, account, profile, trigger, session }) {
      // Initial sign in
      if (account && profile) {
        token.accessToken = account.access_token;
        token.userId = profile?.sub;
        token.email = profile?.email;
        token.name = profile?.name;
        token.picture = profile?.picture;

        // Create or update user in backend database
        let dbUserId: number | undefined;
        try {
          const response = await fetch(`${API_URL}/api/users/email/${encodeURIComponent(profile.email)}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          });

          if (response.ok) {
            const user = await response.json();
            dbUserId = user.id;
          } else {
            // User doesn't exist, create them
            const createResponse = await fetch(`${API_URL}/api/users`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                google_id: profile.sub,
                email: profile.email,
                name: profile.name || "User",
                avatar_url: profile.picture || null,
                user_type: "guest",
              }),
            });

            if (createResponse.ok) {
              const newUser = await createResponse.json();
              dbUserId = newUser.id;
            }
          }

          if (dbUserId) {
            token.dbUserId = dbUserId;
          }
        } catch (error) {
          console.error("Error creating/fetching user:", error);
        }
      }

      // Update token from session callback
      if (trigger === "update" && session) {
        token.dbUserId = (session as any).dbUserId || token.dbUserId;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = (token.userId as string) || "";
        (session.user as any).dbUserId = token.dbUserId;
        (session.user as any).email = token.email;
      }
      return session;
    },
  },
};

export const { handlers, auth, signIn, signOut } = NextAuth(authOptions);
