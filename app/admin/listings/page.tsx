"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { Listing, ListingStatus } from "@/types";
import StatusBadge from "@/components/StatusBadge";
import { formatCurrency, formatDateShort } from "@/lib/utils";
import Link from "next/link";

export default function AdminListingsPage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [filter, setFilter] = useState<ListingStatus | "all">("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchListings = useCallback(async () => {
  setLoading(true);
  setError("");

  const supabase = createClient();

  let query = supabase
  .from("listings")
  .select("*")
  .order("created_at", { ascending: false });

  if (filter !== "all") {
  query = query.eq("status", filter);
  }

  const { data: listingsData, error: listingsError } = await query;
  const { data: profilesData } = await supabase.from("profiles").select("*");

  if (listingsError) {
  setError(listingsError.message);
  } else {
  const profilesMap = new Map(profilesData?.map((p) => [p.id, p]) || []);
  const merged = (listingsData || []).map((l) => ({
  ...l,
  profiles: profilesMap.get(l.user_id) || undefined,
  }));
  setListings(merged);
  }
  setLoading(false);
  }, [filter]);

  useEffect(() => {
  fetchListings();
  }, [fetchListings]);

  const handleApprove = async (id: string) => {
  const supabase = createClient();
  const { error } = await supabase
  .from("listings")
  .update({ status: "approved" })
  .eq("id", id);
  if (!error) fetchListings();
  };

  const handleReject = async (id: string) => {
  const reason = prompt("Rejection reason:");
  if (!reason) return;
  const supabase = createClient();
  const { error } = await supabase
  .from("listings")
  .update({ status: "rejected", rejection_reason: reason })
  .eq("id", id);
  if (!error) fetchListings();
  };

  const handleToggleFeatured = async (id: string, featured: boolean) => {
  const supabase = createClient();
  const { error } = await supabase
  .from("listings")
  .update({ is_featured: featured })
  .eq("id", id);
  if (!error) fetchListings();
  };

  const handleDelete = async (id: string) => {
  if (!confirm("Delete this listing permanently?")) return;
  const supabase = createClient();
  const { error } = await supabase.from("listings").delete().eq("id", id);
  if (!error) fetchListings();
  };

  const tabs = [
  { k: "all" as const, label: "All", count: listings.length },
  { k: "pending" as const, label: "Pending", count: listings.filter((l) => l.status === "pending").length },
  { k: "approved" as const, label: "Live", count: listings.filter((l) => l.status === "approved").length },
  { k: "rejected" as const, label: "Rejected", count: listings.filter((l) => l.status === "rejected").length },
  ];

  return (
  <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
  {/* Header */}
  <div className="section-head-ui mb-6">
  <div>
  <div className="eyebrow-ui">ADMIN</div>
  <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight mt-1">All Listings</h1>
  </div>
  <div className="font-mono text-xs text-text-mute">
  {listings.length} total
  </div>
  </div>

  {/* Filters */}
  <div className="flex items-center gap-2 mb-5 flex-wrap">
  {tabs.map((t) => (
  <button
  key={t.k}
  onClick={() => setFilter(t.k)}
  className={`filter-chip-ui ${filter === t.k ? "active" : ""}`}
  >
  {t.label}
  <span className="ml-1.5 opacity-60">{t.count}</span>
  </button>
  ))}
  </div>

  {error && (
  <div className="p-4 bg-danger-soft border border-danger/20 rounded-lg text-danger text-sm mb-6">
  {error}
  </div>
  )}

  {loading ? (
  <div className="py-20 text-center">
  <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto" />
  <p className="text-text-mute text-sm mt-3">Loading listings...</p>
  </div>
  ) : listings.length === 0 ? (
  <div className="empty-ui">
  <div className="glyph">🔭</div>
  <h3 className="text-lg">No listings found</h3>
  <p>No listings match this filter.</p>
  </div>
  ) : (
  <div className="row-list-ui">
  {/* Header row */}
  <div
  className="row-head-ui hidden md:grid"
  style={{ gridTemplateColumns: "52px 1.6fr 100px 100px 110px 100px 120px 160px" }}
  >
  <div></div>
  <div>Listing</div>
  <div>Tier</div>
  <div>Price</div>
  <div>Status</div>
  <div>Seller</div>
  <div>Submitted</div>
  <div></div>
  </div>

  {/* Data rows */}
  {listings.map((listing) => (
  <div
  key={listing.id}
  className="row-ui grid"
  style={{ gridTemplateColumns: "52px 1fr auto", md: { gridTemplateColumns: "52px 1.6fr 100px 100px 110px 100px 120px 160px" } } as any}
  >
  {/* Mobile: simplified layout */}
  <div className={`thumb-tiny ${listing.category}`}>
  {listing.category === "product" ? "🛒" : listing.category === "service" ? "🔧" : listing.category === "event" ? "🎪" : "📚"}
  </div>

  <div className="min-w-0">
  <div className="font-medium text-sm truncate">{listing.title}</div>
  <div className="text-text-mute text-xs font-mono mt-0.5 md:hidden">
  {listing.category} · {formatDateShort(listing.created_at)}
  </div>
  <div className="flex items-center gap-2 mt-1 md:hidden">
  <StatusBadge status={listing.status} />
  {listing.is_featured && <span className="chip-ui chip-featured">Featured</span>}
  </div>
  <div className="flex items-center gap-2 mt-2 md:hidden">
  <button onClick={() => handleApprove(listing.id)} className="btn-primary btn-sm">✓</button>
  <button onClick={() => handleReject(listing.id)} className="btn-danger btn-sm">✕</button>
  <button onClick={() => handleDelete(listing.id)} className="btn-ghost btn-sm">🗑</button>
  </div>
  </div>

  {/* Desktop only columns */}
  <div className="hidden md:flex items-center">
  {listing.is_featured ? (
  <span className="chip-ui chip-featured">Featured</span>
  ) : (
  <span className="chip-ui">Standard</span>
  )}
  </div>
  <div className="hidden md:flex items-center font-mono text-sm font-semibold">
  {listing.price === 0 ? "Free" : `₹${(listing.price || 0).toLocaleString("en-IN")}`}
  </div>
  <div className="hidden md:flex items-center">
  <StatusBadge status={listing.status} />
  </div>
  <div className="hidden md:flex items-center text-sm text-text-2 truncate max-w-[100px]">
  {listing.profiles?.full_name || "Anonymous"}
  </div>
  <div className="hidden md:flex items-center font-mono text-xs text-text-mute">
  {formatDateShort(listing.created_at)}
  </div>
  <div className="hidden md:flex items-center justify-end gap-1.5">
  <Link href={`/admin/listings/${listing.id}`} className="btn-ghost btn-sm">
  Review
  </Link>
  <button
  onClick={() => handleApprove(listing.id)}
  className="btn-primary btn-sm px-2"
  title="Approve"
  >
  ✓
  </button>
  <button
  onClick={() => handleReject(listing.id)}
  className="btn-danger btn-sm px-2"
  title="Reject"
  >
  ✕
  </button>
  <button
  onClick={() => handleDelete(listing.id)}
  className="icon-btn w-8 h-8"
  title="Delete"
  >
  🗑
  </button>
  </div>
  </div>
  ))}
  </div>
  )}
  </div>
  );
}
