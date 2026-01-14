import NextAuth, { type NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

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
  callbacks: {
    async jwt({ token, account, profile, user, trigger }) {
      if (account && profile) {
        token.accessToken = account.access_token;
        token.userId = profile.sub;
        token.email = profile.email;
      }

      // Fetch user type from backend if not already set or if explicitly updating
      if ((trigger === "signIn" || trigger === "update" || !token.userType) && token.email) {
        try {
          const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
          const response = await fetch(`${apiUrl}/api/users/email/${token.email}`);
          if (response.ok) {
            const userData = await response.json();
            token.userType = userData.user_type;
            console.log("Fetched user type:", userData.user_type);
          }
        } catch (error) {
          console.error("Error fetching user type:", error);
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.userId as string;
        (session.user as any).userType = token.userType;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
