import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { createServerClient } from "./supabase/server";

export async function requireAdmin() {
  const { userId } = await auth();

  if (!userId) {
  redirect("/login");
  }

  const supabase = createServerClient();

  // Try by user ID first
  let { data: profile } = await supabase
  .from("profiles")
  .select("role")
  .eq("id", userId)
  .single();

  // Fallback: try by email
  if (!profile) {
  const { sessionClaims } = await auth();
  const email = sessionClaims?.email as string | undefined;
  if (email) {
  const { data: byEmail } = await supabase
  .from("profiles")
  .select("role")
  .eq("email", email)
  .single();
  profile = byEmail || null;
  }
  }

  if (!profile || profile.role !== "admin") {
  redirect("/");
  }

  return { userId };
}
