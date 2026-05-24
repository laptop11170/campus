"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

export default function SyncProfile() {
  const { user, isSignedIn } = useUser();

  useEffect(() => {
  if (!isSignedIn || !user) return;

  const sync = async () => {
  const supabase = createClient();

  // Check if profile already exists
  const { data: existing } = await supabase
  .from("profiles")
  .select("id, role")
  .eq("id", user.id)
  .single();

  if (existing) {
  // Profile exists — only update name/email/avatar, NEVER touch role
  await supabase
  .from("profiles")
  .update({
  full_name:
  `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
  user.username ||
  "User",
  email: user.primaryEmailAddress?.emailAddress || null,
  avatar_url: user.imageUrl || null,
  })
  .eq("id", user.id);
  } else {
  // No profile yet — create with default role "user"
  await supabase.from("profiles").insert({
  id: user.id,
  full_name:
  `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
  user.username ||
  "User",
  email: user.primaryEmailAddress?.emailAddress || null,
  avatar_url: user.imageUrl || null,
  role: "user",
  });
  }
  };

  sync();
  }, [user, isSignedIn]);

  return null;
}
