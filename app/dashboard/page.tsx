export const dynamic = "force-dynamic";

import { createServerClient } from "@/lib/supabase/server";
import { auth } from "@clerk/nextjs/server";
import { Listing } from "@/types";
import StatusBadge from "@/components/StatusBadge";
import { formatCurrency, formatDateShort } from "@/lib/utils";
import Link from "next/link";
import { Plus, ArrowRight, Clock, Inbox, Eye, Bookmark, Star } from "lucide-react";
import DeleteListingButton from "@/components/DeleteListingButton";
import Image from "next/image";

export default async function DashboardPage() {
  const { userId } = await auth();

  if (!userId) {
  return null;
  }

  const supabase = createServerClient();

  const { data: myProfile } = await supabase
  .from("profiles")
  .select("email, full_name, avatar_url, role")
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
  <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
  {/* Header */}
  <div className="flex items-center justify-between mb-8">
  <div>
  <div className="eyebrow-ui">YOUR ACCOUNT</div>
  <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight mt-1">Dashboard</h1>
  </div>
  <Link href="/list" className="btn-primary">
  <Plus size={16} strokeWidth={2.5} /> New listing
  </Link>
  </div>

  {/* Stats */}
  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
  <div className="stat-ui">
  <div className="label">Active listings</div>
  <div className="value">{approved.length}</div>
  <div className="text-xs text-text-mute"><span className="text-accent">+{pending.length}</span> pending</div>
  </div>
  <div className="stat-ui">
  <div className="label">Total listings</div>
  <div className="value">{listings.length}</div>
  <div className="text-xs text-text-mute">since joining</div>
  </div>
  <div className="stat-ui">
  <div className="label">Rejected</div>
  <div className="value text-danger">{rejected.length}</div>
  <div className="text-xs text-text-mute">need attention</div>
  </div>
  <div className="stat-ui">
  <div className="label">Featured</div>
  <div className="value text-[#ff7ba0]">{listings.filter((l) => l.is_featured).length}</div>
  <div className="text-xs text-text-mute">pinned listings</div>
  </div>
  </div>

  {/* Listings table */}
  {listings.length > 0 ? (
  <div>
  <div className="flex items-center gap-1 border-b border-border mb-4">
  {[
  { k: "all", label: "All", count: listings.length },
  { k: "approved", label: "Live", count: approved.length },
  { k: "pending", label: "Pending", count: pending.length },
  { k: "rejected", label: "Rejected", count: rejected.length },
  ].map((tab, i) => (
  <button
  key={tab.k}
  className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
  i === 0
  ? "text-text border-accent"
  : "text-text-mute border-transparent hover:text-text"
  }`}
  >
  {tab.label}
  <span className="ml-2 font-mono text-[11px] text-text-mute">{tab.count}</span>
  </button>
  ))}
  </div>

  <div className="row-list-ui">
  <div
  className="row-head-ui"
  style={{ gridTemplateColumns: "52px 1.6fr 100px 110px 100px 100px 90px" }}
  >
  <div></div>
  <div>Listing</div>
  <div>Tier</div>
  <div>Status</div>
  <div>Views</div>
  <div>Price</div>
  <div></div>
  </div>
  {listings.map((listing: Listing) => (
  <div
  key={listing.id}
  className="row-ui cursor-pointer"
  style={{ gridTemplateColumns: "52px 1.6fr 100px 110px 100px 100px 90px" }}
  >
  <div
  className={`thumb-tiny ${listing.category} w-11 h-11 text-lg`}
  >
  {listing.category === "product" ? "🛒" : listing.category === "service" ? "🔧" : listing.category === "event" ? "🎪" : "📚"}
  </div>
  <div className="min-w-0">
  <div className="font-medium text-sm truncate">{listing.title}</div>
  <div className="text-text-mute text-xs font-mono mt-0.5">
  {listing.category} · {formatDateShort(listing.created_at)}
  </div>
  </div>
  <div className="flex items-center">
  {listing.is_featured ? (
  <span className="chip-ui chip-featured">Featured</span>
  ) : (
  <span className="chip-ui">Standard</span>
  )}
  </div>
  <div>
  <StatusBadge status={listing.status} />
  </div>
  <div className="font-mono text-sm text-text-2">
  --
  </div>
  <div className="font-mono text-sm font-semibold text-text">
  {listing.price === 0 ? "Free" : formatCurrency(listing.price)}
  </div>
  <div className="flex items-center justify-end gap-1.5">
  <Link
  href={`/listing/${listing.id}`}
  className="btn-ghost btn-sm"
  >
  View
  </Link>
  <DeleteListingButton id={listing.id} />
  </div>
  </div>
  ))}
  </div>
  </div>
  ) : (
  <div className="empty-ui">
  <div className="glyph">📭</div>
  <h3 className="text-lg">No listings yet</h3>
  <p className="mb-4">Start selling by creating your first listing</p>
  <Link href="/list" className="btn-primary">
  <Plus size={16} /> Create Listing
  </Link>
  </div>
  )}

  {pending.length > 0 && (
  <div className="mt-6 flex items-center gap-3 p-4 bg-amber-soft border border-amber/10 rounded-lg">
  <Clock className="w-5 h-5 text-amber flex-shrink-0" />
  <p className="text-sm text-text-mute">
  {pending.length} listing{pending.length > 1 ? "s" : ""} under review. Admins typically approve within 30 minutes.
  </p>
  </div>
  )}
  </div>
  );
}
