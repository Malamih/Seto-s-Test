import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";

export async function requireSession() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect("/signin");
  }
  return session;
}

export async function requireRole(roles: string[]) {
  const session = await requireSession();
  if (!session.user.role || !roles.includes(session.user.role)) {
    redirect("/signin");
  }
  return session;
}
