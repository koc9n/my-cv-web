import { getServerSession } from "next-auth";
import { authOptions } from "@/server/auth";
import { adminEnvironmentEnabled } from "@/server/auth";
export async function requireAdmin() {
  if (!adminEnvironmentEnabled()) throw new Error("UNAUTHORIZED");
  const session = await getServerSession(authOptions);
  if (
    !session?.user?.email ||
    session.user.email.toLowerCase() !== process.env.ADMIN_EMAIL?.toLowerCase()
  )
    throw new Error("UNAUTHORIZED");
  return session;
}
