import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function requireAdmin() {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    redirect("/login");
  }
  return session;
}

export async function requireAdminAction() {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    throw new Error("No autorizado: se requiere rol ADMIN");
  }
  return session;
}
