export const dynamic = "force-dynamic";

import { createServerClient } from "@/lib/supabase/server";
import { auth } from "@clerk/nextjs/server";
import { Listing } from "@/types";
import StatusBadge from "@/components/StatusBadge";
import { formatDate, formatCurrency } from "@/lib/utils";
import Link from "next/link";
import { Plus, ArrowRight, Clock, Inbox } from "lucide-react";
import DeleteListingButton from "@/components/DeleteListingButton";

export default async function DashboardPage() {
  const { userId } = await auth();

  if (!userId) {
  return null; // middleware handles redirect
  }

  const supabase = createServerClient();

  // Old listings may have user_id from pre-Clerk Supabase Auth UUIDs.
  // Gather all profile IDs that share the current user's email so we
  // can fetch listings across auth migrations.
  const { data: myProfile } = await supabase
  .from("profiles")
  .select("email")
  .eq("id", userId)
  .single();

  let listingsQuery = supabase.from("listings").select("*");

  if (myProfile?.email) {
  const { data: matchingProfiles } = await supabase
  .from("profiles")
  .select("id")
  .eq("email", myProfile.email);

  const ids = [...new Set([userId, ...(matchingProfiles?.map((p) => p.id) || [])])];
  listingsQuery = listingsQuery.in("user_id", ids);
  } else {
  listingsQuery = listingsQuery.eq("user_id", userId);
  }

  const { data: listingsData } = await listingsQuery.order("created_at", { ascending: false });
  const listings = listingsData || [];

  const pending = listings.filter((l: Listing) => l.status === "pending");
  const approved = listings.filter((l: Listing) => l.status === "approved");
  const rejected = listings.filter((l: Listing) => l.status === "rejected");

  return (
  <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
  <div className="flex items-center justify-between mb-8">
  <div>
  <h1 className="text-2xl font-bold text-primary">My Listings</h1>
  <p className="text-muted text-sm mt-1">
  Manage your listings and track their status
  </p>
  </div>
  <Link
  href="/list"
  className="inline-flex items-center gap-2 px-4 py-2 bg-accent text-white text-sm font-medium rounded-input hover:bg-accent-hover transition-colors"
  >
  <Plus className="w-4 h-4" />
  New Listing
  </Link>
  </div>

  <div className="grid grid-cols-3 gap-4 mb-8">
  <div className="bg-surface border border-surface-border rounded-card p-4">
  <div className="text-2xl font-bold text-primary">{pending.length}</div>
  <div className="text-sm text-muted">Pending</div>
  </div>
  <div className="bg-surface border border-surface-border rounded-card p-4">
  <div className="text-2xl font-bold text-emerald-500">{approved.length}</div>
  <div className="text-sm text-muted">Approved</div>
  </div>
  <div className="bg-surface border border-surface-border rounded-card p-4">
  <div className="text-2xl font-bold text-red-500">{rejected.length}</div>
  <div className="text-sm text-muted">Rejected</div>
  </div>
  </div>

  {listings.length > 0 ? (
  <div className="space-y-3">
  {listings.map((listing: Listing) => (
  <div
  key={listing.id}
  className="bg-surface border border-surface-border rounded-card p-4 flex items-center gap-4"
  >
  <div className="flex-1 min-w-0">
  <div className="flex items-center gap-2 mb-1">
  <Link
  href={`/listing/${listing.id}`}
  className="font-medium text-primary hover:text-accent transition-colors truncate"
  >
  {listing.title}
  </Link>
  <StatusBadge status={listing.status} />
  {listing.is_featured && (
  <span className="text-xs text-accent font-medium">Featured</span>
  )}
  </div>
  <div className="flex items-center gap-3 text-sm text-muted">
  <span className="capitalize">{listing.category}</span>
  <span>•</span>
  <span>{listing.price_label || formatCurrency(listing.price)}</span>
  <span>•</span>
  <span>{formatDate(listing.created_at)}</span>
  </div>
  {listing.rejection_reason && (
  <p className="text-sm text-red-400 mt-1">
  Reason: {listing.rejection_reason}
  </p>
  )}
  </div>
  <div className="flex items-center gap-2 flex-shrink-0">
  <Link
  href={`/listing/${listing.id}`}
  className="p-2 text-muted hover:text-primary transition-colors"
  >
  <ArrowRight className="w-4 h-4" />
  </Link>
  <DeleteListingButton id={listing.id} />
  </div>
  </div>
  ))}
  </div>
  ) : (
  <div className="py-16 text-center border border-dashed border-surface-border rounded-card">
  <Inbox className="w-12 h-12 text-muted mx-auto mb-4" />
  <h3 className="text-lg font-semibold text-primary mb-1">
  No listings yet
  </h3>
  <p className="text-muted mb-4">
  Start selling by creating your first listing
  </p>
  <Link
  href="/list"
  className="inline-flex items-center gap-2 px-4 py-2 bg-accent text-white text-sm font-medium rounded-input hover:bg-accent-hover transition-colors"
  >
  <Plus className="w-4 h-4" />
  Create Listing
  </Link>
  </div>
  )}

  {pending.length > 0 && (
  <div className="mt-6 flex items-center gap-3 p-4 bg-amber-500/5 border border-amber-500/10 rounded-card">
  <Clock className="w-5 h-5 text-amber-500 flex-shrink-0" />
  <p className="text-sm text-muted">
  Your pending listings are under review. We will notify you once they are approved.
  </p>
  </div>
  )}
  </div>
  );
}
