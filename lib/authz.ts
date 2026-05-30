import { redirect } from "next/navigation";
import { auth } from "@/auth";

export async function requireUser() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  return session.user;
}

export async function requirePermission(permission: string) {
  const user = await requireUser();
  if (!user.permissions.includes(permission)) redirect("/dashboard");
  return user;
}

export function hasPermission(permissions: string[] | undefined, permission: string) {
  return Boolean(permissions?.includes(permission));
}
