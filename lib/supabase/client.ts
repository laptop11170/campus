import { createClient } from "@supabase/supabase-js";
import { useAuth } from "@clerk/nextjs";

export function useSupabase() {
  const { getToken, userId } = useAuth();

  return {
  userId,
  async getClient() {
  const token = await getToken({ template: "supabase" });
  return createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
  global: {
  headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  },
  }
  );
  },
  };
}
