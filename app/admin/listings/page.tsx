"use client";

import { useEffect, useState, useCallback } from "react";
import { useSupabase } from "@/lib/supabase/client";
import { Listing, ListingStatus } from "@/types";
import AdminTable from "@/components/AdminTable";
import { Filter } from "lucide-react";

export default function AdminListingsPage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [filter, setFilter] = useState<ListingStatus | "all">("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { getClient } = useSupabase();

  const fetchListings = useCallback(async () => {
  setLoading(true);
  setError("");

  const supabase = await getClient();

  let query = supabase
  .from("listings")
  .select(`*, profiles (id, full_name, avatar_url, email, role, created_at)`)
  .order("created_at", { ascending: false });

  if (filter !== "all") {
  query = query.eq("status", filter);
  }

  const { data, error } = await query;

  if (error) {
  setError(error.message);
  } else {
  setListings(data || []);
  }
  setLoading(false);
  }, [filter, getClient]);

  useEffect(() => {
  fetchListings();
  }, [fetchListings]);

  const handleApprove = async (id: string) => {
  const supabase = await getClient();
  const { error } = await supabase
  .from("listings")
  .update({ status: "approved" })
  .eq("id", id);

  if (!error) fetchListings();
  };

  const handleReject = async (id: string, reason: string) => {
  const supabase = await getClient();
  const { error } = await supabase
  .from("listings")
  .update({ status: "rejected", rejection_reason: reason })
  .eq("id", id);

  if (!error) fetchListings();
  };

  const handleToggleFeatured = async (id: string, featured: boolean) => {
  const supabase = await getClient();
  const { error } = await supabase
  .from("listings")
  .update({ is_featured: featured })
  .eq("id", id);

  if (!error) fetchListings();
  };

  const handleDelete = async (id: string) => {
  if (!confirm("Delete this listing permanently?")) return;
  const supabase = await getClient();
  const { error } = await supabase.from("listings").delete().eq("id", id);
  if (!error) fetchListings();
  };

  return (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
  <div>
  <h1 className="text-2xl font-bold text-primary">Listing Management</h1>
  <p className="text-muted text-sm mt-1">
  Review, approve, and manage all marketplace listings
  </p>
  </div>

  <div className="flex items-center gap-2">
  <Filter className="w-4 h-4 text-muted" />
  {(["all", "pending", "approved", "rejected"] as const).map((status) => (
  <button
  key={status}
  onClick={() => setFilter(status)}
  className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
  filter === status
  ? "bg-accent text-white"
  : "text-muted hover:text-primary hover:bg-white/5"
  }`}
  >
  {status.charAt(0).toUpperCase() + status.slice(1)}
  </button>
  ))}
  </div>
  </div>

  {error && (
  <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-card text-red-400 text-sm mb-6">
  {error}
  </div>
  )}

  {loading ? (
  <div className="py-20 text-center">
  <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto" />
  <p className="text-muted text-sm mt-3">Loading listings...</p>
  </div>
  ) : (
  <AdminTable
  listings={listings}
  onApprove={handleApprove}
  onReject={handleReject}
  onToggleFeatured={handleToggleFeatured}
  onDelete={handleDelete}
  />
  )}
  </div>
  );
}
