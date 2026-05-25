"use client";

import { useAuth, useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const { isSignedIn, userId } = useAuth();
  const { user } = useUser();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
  if (!isSignedIn || !userId) {
  router.replace("/login");
  return;
  }

  const checkAdmin = async () => {
  const supabase = createClient();

  // Check by user ID first
  const { data: profile } = await supabase
  .from("profiles")
  .select("role")
  .eq("id", userId)
  .single();

  if (profile?.role === "admin") {
  setIsAdmin(true);
  return;
  }

  // Fallback: check by email
  const email = user?.primaryEmailAddress?.emailAddress;
  if (email) {
  const { data: byEmail } = await supabase
  .from("profiles")
  .select("role")
  .eq("email", email)
  .single();

  if (byEmail?.role === "admin") {
  setIsAdmin(true);
  return;
  }
  }

  // Not admin
  router.replace("/");
  };

  checkAdmin();
  }, [isSignedIn, userId, user, router]);

  if (isAdmin === null) {
  return (
  <div className="max-w-4xl mx-auto px-4 py-20 text-center">
  <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto" />
  <p className="text-muted text-sm mt-3">Checking permissions...</p>
  </div>
  );
  }

  return <>{children}</>;
}
