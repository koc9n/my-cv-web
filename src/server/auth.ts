import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export function isAllowedAdmin(
  profile: { email?: string | null; email_verified?: boolean } | undefined,
  allowedEmail: string | undefined,
) {
  return Boolean(
    allowedEmail &&
    profile?.email_verified &&
    profile.email?.trim().toLowerCase() === allowedEmail.trim().toLowerCase(),
  );
}
export function adminEnvironmentEnabled(
  environment = process.env.VERCEL_ENV,
  previewOverride = process.env.ENABLE_PREVIEW_ADMIN,
) {
  return environment !== "preview" || previewOverride === "true";
}

export const authOptions: NextAuthOptions = {
  secret: process.env.AUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "missing",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "missing",
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async signIn({ profile }) {
      return (
        adminEnvironmentEnabled() &&
        isAllowedAdmin(
          profile as
            { email?: string | null; email_verified?: boolean } | undefined,
          process.env.ADMIN_EMAIL,
        )
      );
    },
  },
  pages: { signIn: "/admin/sign-in" },
};
