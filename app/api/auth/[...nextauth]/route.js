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
        
        // await pb.admins.authWithPassword(process.env.POCKETBASE_AUTH_EMAIL, process.env.POCKETBASE_AUTH_PASS);
        
        // const existingUser = await pb.collection('accounts').getFirstListItem(`guser_id="${profile.sub}"`);
        
        // const userData = {
        //   username: profile.name || '',
        //   email: profile.email,
        //   guser_id: profile.sub,
        //   lastlogin: new Date().toISOString(),
        //   profileImage: profile.picture || '',
        //   clubs: existingUser ? existingUser.clubs : []
        // };
        
        // if (existingUser) {
        //   await pb.collection('accounts').update(existingUser.id, userData);
        // } else {
        //   await pb.collection('accounts').create(userData);
        // }
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      session.idToken = token.idToken;
      session.userId = token.userId;

        // await pb.admins.authWithPassword(process.env.POCKETBASE_AUTH_EMAIL, process.env.POCKETBASE_AUTH_PASS);
        
        // const existingUser = await pb.collection('accounts').getFirstListItem(`guser_id="${profile.sub}"`);
        
        // const userData = {
        //   username: session.user.name || '',
        //   email: session.user.email,
        //   guser_id: session.userId,
        //   lastlogin: new Date().toISOString(),
        //   profileImage: session.user.image || ''
        //   // clubs: existingUser ? existingUser.clubs : []
        // };
        
        // if (existingUser) {
        //   await pb.collection('accounts').update(existingUser.id, userData);
        // } else {
        //   await pb.collection('accounts').create(userData);
        // }

        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/pocketbase/user`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              user: {
                name: session.user.name,
                email: session.user.email,
                guser_id: session.userId,
                picture: session.user.image,
              },
            }),
          });
  
          const data = await response.json();
          if (!response.ok) {
            console.error('PocketBase save failed:', data.error);
          }
        } catch (error) {
          console.error('Error calling PocketBase API route:', error);
        }
  
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
