import { getServerSession } from "next-auth";
import { authOptions } from "@/server/auth";
export async function requireAdmin(){const session=await getServerSession(authOptions);if(!session?.user?.email||session.user.email.toLowerCase()!==process.env.ADMIN_EMAIL?.toLowerCase())throw new Error("UNAUTHORIZED");return session;}
