"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect } from "react";
import { useSupabase } from "@/lib/supabase/client";

export default function SyncProfile() {
  const { user } = useUser();
  const { getClient, userId } = useSupabase();

  useEffect(() => {
  if (!user || !userId) return;

  const sync = async () => {
  const supabase = await getClient();
  if (!supabase) return;

  const { data: existing } = await supabase
  .from("profiles")
  .select("id")
  .eq("id", userId)
  .single();

  if (!existing) {
  await supabase.from("profiles").upsert(
  {
  id: userId,
  full_name: `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.username || "User",
  email: user.primaryEmailAddress?.emailAddress || null,
  avatar_url: user.imageUrl || null,
  role: "user",
  },
  { onConflict: "id" }
  );
  }
  };

  sync();
  }, [user, userId, getClient]);

  return null;
}
