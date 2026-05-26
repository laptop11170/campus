export const dynamic = "force-dynamic";

import { createServerClient } from "@/lib/supabase/server";
import Link from "next/link";
import StatusBadge from "@/components/StatusBadge";
import { formatCurrency, formatDateShort } from "@/lib/utils";

export default async function AdminDashboard() {
  const supabase = createServerClient();

  const { data: listingsData } = await supabase
  .from("listings")
  .select("*")
  .order("created_at", { ascending: false });

  const listings = listingsData || [];

  // FK join is broken in schema cache; fetch profiles separately and match manually
  const { data: profilesData } = await supabase.from("profiles").select("*");
  const profilesMap = new Map(profilesData?.map((p) => [p.id, p]) || []);
  for (const l of listings) {
  (l as any).profiles = profilesMap.get(l.user_id) || undefined;
  }

  const total = listings.length;
  const pending = listings.filter((l) => l.status === "pending");
  const approved = listings.filter((l) => l.status === "approved");
  const rejected = listings.filter((l) => l.status === "rejected");
  const featuredReqs = listings.filter((l) => l.is_featured && l.status === "pending");

  // Payment revenue today (mock for now since we track via payment_amount)
  const todayRevenue = listings
  .filter((l) => l.payment_amount && new Date(l.created_at).toDateString() === new Date().toDateString())
  .reduce((sum, l) => sum + (l.payment_amount || 0), 0);

  return (
  <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
  {/* Header */}
  <div className="section-head-ui mb-6">
  <div>
  <div className="eyebrow-ui">ADMIN</div>
  <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight mt-1">Moderation</h1>
  </div>
  <div className="flex gap-2">
  <span className="chip-ui chip-success">
  ● {pending.length} pending
  </span>
  <span className="chip-ui chip-featured">
  ● {featuredReqs.length} featured
  </span>
  </div>
  </div>

  {/* Stats */}
  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
  <div className="stat-ui">
  <div className="label">Pending listings</div>
  <div className="value text-accent">{pending.length}</div>
  <div className="text-xs text-text-mute">oldest pending</div>
  </div>
  <div className="stat-ui">
  <div className="label">Featured requests</div>
  <div className="value" style={{ color: "var(--brand-pink)" }}>{featuredReqs.length}</div>
  <div className="text-xs text-text-mute">awaiting approval</div>
  </div>
  <div className="stat-ui">
  <div className="label">Revenue today</div>
  <div className="value">₹{todayRevenue.toLocaleString("en-IN")}</div>
  <div className="text-xs text-text-mute">listing fees collected</div>
  </div>
  <div className="stat-ui">
  <div className="label">Active listings</div>
  <div className="value">{approved.length}</div>
  <div className="text-xs text-text-mute">across all categories</div>
  </div>
  </div>

  {/* Tabs */}
  <div className="flex items-center gap-1 border-b border-border mb-5">
  {[
  { k: "pending", label: "Pending listings", count: pending.length },
  { k: "featured", label: "Featured requests", count: featuredReqs.length },
  { k: "approved", label: "Approved", count: approved.length },
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

  {/* Pending list */}
  {pending.length === 0 ? (
  <div className="empty-ui">
  <div className="glyph">✅</div>
  <h3 className="text-lg">Inbox zero</h3>
  <p>No listings pending review. Nice.</p>
  </div>
  ) : (
  <div className="row-list-ui">
  <div
  className="row-head-ui"
  style={{ gridTemplateColumns: "52px 1.6fr 110px 120px 100px 130px 140px" }}
  >
  <div></div>
  <div>Listing</div>
  <div>Tier</div>
  <div>Status</div>
  <div>Price</div>
  <div>Submitted</div>
  <div></div>
  </div>
  {pending.map((listing) => (
  <div
  key={listing.id}
  className="row-ui"
  style={{ gridTemplateColumns: "52px 1.6fr 110px 120px 100px 130px 140px" }}
  >
  <div className={`thumb-tiny ${listing.category}`}>
  {listing.category === "product" ? "🛒" : listing.category === "service" ? "🔧" : listing.category === "event" ? "🎪" : "📚"}
  </div>
  <div className="min-w-0">
  <div className="font-medium text-sm truncate">{listing.title}</div>
  <div className="text-text-mute text-xs font-mono mt-0.5">
  {listing.profiles?.full_name || "Anonymous"}
  </div>
  </div>
  <div>
  {listing.is_featured ? (
  <span className="chip-ui chip-featured">Featured</span>
  ) : (
  <span className="chip-ui">Standard</span>
  )}
  </div>
  <div>
  <StatusBadge status={listing.status} />
  </div>
  <div className="font-mono text-sm font-semibold">
  {listing.price === 0 ? "Free" : `₹${(listing.price || 0).toLocaleString("en-IN")}`}
  </div>
  <div className="font-mono text-xs text-text-mute">
  {formatDateShort(listing.created_at)}
  </div>
  <div className="flex items-center justify-end gap-1.5">
  <Link
  href={`/admin/listings/${listing.id}`}
  className="btn-ghost btn-sm"
  >
  Review
  </Link>
  <Link
  href={`/admin/listings/${listing.id}`}
  className="btn-primary btn-sm px-2"
  >
  ✓
  </Link>
  </div>
  </div>
  ))}
  </div>
  )}

  {/* Quick links */}
  <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
  <Link
  href="/admin/listings"
  className="flex items-center justify-between p-5 bg-surface border border-border rounded-lg hover:border-border-strong transition-colors"
  >
  <div>
  <h3 className="font-medium text-text">Manage All Listings</h3>
  <p className="text-sm text-text-mute mt-0.5">Review, approve, and manage all {total} listings</p>
  </div>
  <span className="text-text-mute">→</span>
  </Link>
  </div>
  </div>
  );
}
