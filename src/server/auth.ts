import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions:NextAuthOptions={
  providers:[GoogleProvider({clientId:process.env.GOOGLE_CLIENT_ID??"missing",clientSecret:process.env.GOOGLE_CLIENT_SECRET??"missing"})],
  session:{strategy:"jwt"},
  callbacks:{async signIn({profile}){const allowed=process.env.ADMIN_EMAIL?.trim().toLowerCase();const verified=(profile as {email_verified?:boolean}|undefined)?.email_verified;return Boolean(allowed&&verified&&profile?.email?.toLowerCase()===allowed)}},
  pages:{signIn:"/admin/sign-in"},
};
