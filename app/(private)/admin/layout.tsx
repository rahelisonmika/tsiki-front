import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";
export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const cookieStore = await cookies();           
  const role        = cookieStore.get("role")?.value;

  if (role !== "admin") redirect("/not-authorized");
  return <>{children}</>;
}