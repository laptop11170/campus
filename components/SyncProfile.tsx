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

  const { data: existing } = await supabase
  .from("profiles")
  .select("id")
  .eq("id", user.id)
  .single();

  if (!existing) {
  await supabase.from("profiles").upsert(
  {
  id: user.id,
  full_name:
  `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
  user.username ||
  "User",
  email: user.primaryEmailAddress?.emailAddress || null,
  avatar_url: user.imageUrl || null,
  role: "user",
  },
  { onConflict: "id" }
  );
  }
  };

  sync();
  }, [user, isSignedIn]);

  return null;
}
