import NextAuth from "next-auth/next";
import GoogleProvider from "next-auth/providers/google";
import PocketBase from 'pocketbase';

const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL);

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account && profile) {
        token.accessToken = account.access_token;
        token.idToken = account.id_token;
        token.userId = profile.sub;
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      session.idToken = token.idToken;
      session.userId = token.userId;

        // try {
        //   const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/pocketbase/user`, {
        //     method: 'POST',
        //     headers: {
        //       'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify({
        //       user: {
        //         name: session.user.name,
        //         email: session.user.email,
        //         guser_id: session.userId,
        //         picture: session.user.image,
        //       },
        //     }),
        //   });
  
        //   const data = await response.json();
        //   if (!response.ok) {
        //     console.error('PocketBase save failed:', data.error);
        //   }
        // } catch (error) {
        //   console.error('Error calling PocketBase API route:', error);
        // }
  
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
