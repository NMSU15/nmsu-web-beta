import NextAuth from "next-auth/next";
import GoogleProvider from "next-auth/providers/google";
import PocketBase from 'pocketbase';

const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL);

export const authOptions = {
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
      //   const imageResponse = await fetch(session.user.image);
      //   const imageBlob = await imageResponse.blob();

      //   const formData = new FormData();
      //   formData.append('file', new File([imageBlob], `${session.userId}.png`, { type: 'image/png' }));
      //   formData.append('name', session.user.name);
      //   formData.append('email', session.user.email);
      //   formData.append('guser_id', session.userId);

      //   const response = await fetch(`http://localhost:3030/api/user`, {
      //     method: 'POST',
      //     body: formData,
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
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
