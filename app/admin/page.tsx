export const dynamic = "force-dynamic";

import { createServerClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/admin";
import Link from "next/link";
import {
  ArrowRight,
  ClipboardList,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
  Eye,
} from "lucide-react";
import StatusBadge from "@/components/StatusBadge";
import { formatDate, formatCurrency } from "@/lib/utils";

export default async function AdminDashboard() {
  await requireAdmin();
  const supabase = createServerClient();

  const { data: listingsData } = await supabase
  .from("listings")
  .select(`*, profiles (id, full_name, avatar_url, email, role, created_at)`)
  .order("created_at", { ascending: false });

  const listings = listingsData || [];
  const total = listings.length;
  const pending = listings.filter((l) => l.status === "pending");
  const approved = listings.filter((l) => l.status === "approved").length;
  const rejected = listings.filter((l) => l.status === "rejected").length;

  const stats = [
  { label: "Total", value: total, icon: ClipboardList, color: "text-primary", bg: "bg-primary/5" },
  { label: "Pending", value: pending.length, icon: Clock, color: "text-amber-500", bg: "bg-amber-500/5" },
  { label: "Approved", value: approved, icon: CheckCircle, color: "text-emerald-500", bg: "bg-emerald-500/5" },
  { label: "Rejected", value: rejected, icon: XCircle, color: "text-red-500", bg: "bg-red-500/5" },
  ];

  return (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
  {/* Header */}
  <div className="mb-6 sm:mb-8">
  <h1 className="text-xl sm:text-2xl font-bold text-primary">Admin Dashboard</h1>
  <p className="text-muted text-sm mt-1">Manage and review marketplace listings</p>
  </div>

  {/* Stats */}
  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
  {stats.map((stat) => (
  <div
  key={stat.label}
  className={`${stat.bg} border border-surface-border rounded-card p-4 sm:p-5`}
  >
  <div className="flex items-center justify-between mb-2">
  <stat.icon className={`w-5 h-5 ${stat.color}`} />
  <span className={`text-xl sm:text-2xl font-bold ${stat.color}`}>{stat.value}</span>
  </div>
  <div className="text-sm text-muted">{stat.label}</div>
  </div>
  ))}
  </div>

  {/* Pending Listings — Quick Actions */}
  <div className="mb-6 sm:mb-8">
  <div className="flex items-center justify-between mb-4">
  <h2 className="text-lg font-semibold text-primary flex items-center gap-2">
  <AlertCircle className="w-5 h-5 text-amber-500" />
  Pending Review
  {pending.length > 0 && (
  <span className="px-2 py-0.5 bg-amber-500/10 text-amber-500 text-xs rounded-full">
  {pending.length}
  </span>
  )}
  </h2>
  <Link
  href="/admin/listings"
  className="text-sm text-accent hover:text-accent-hover transition-colors flex items-center gap-1"
  >
  View all
  <ArrowRight className="w-4 h-4" />
  </Link>
  </div>

  {pending.length > 0 ? (
  <div className="space-y-3">
  {pending.map((listing) => (
  <div
  key={listing.id}
  className="bg-surface border border-surface-border rounded-card p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4"
  >
  {/* Info */}
  <div className="flex-1 min-w-0">
  <div className="flex items-center gap-2 flex-wrap">
  <h3 className="font-medium text-primary truncate">
  {listing.title}
  </h3>
  <StatusBadge status={listing.status} />
  {listing.is_featured && (
  <span className="text-xs text-accent font-medium">Featured</span>
  )}
  </div>
  <div className="flex items-center gap-2 text-sm text-muted mt-1 flex-wrap">
  <span className="capitalize">{listing.category}</span>
  <span>·</span>
  <span>{listing.price_label || formatCurrency(listing.price)}</span>
  <span>·</span>
  <span>{listing.profiles?.full_name || "Anonymous"}</span>
  <span>·</span>
  <span>{formatDate(listing.created_at)}</span>
  </div>
  </div>

  {/* Actions */}
  <div className="flex items-center gap-2 flex-shrink-0">
  <Link
  href={`/admin/listings/${listing.id}`}
  className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-primary bg-background border border-surface-border rounded-input hover:border-accent transition-colors"
  >
  <Eye className="w-4 h-4" />
  Review
  </Link>
  <Link
  href={`/admin/listings/${listing.id}`}
  className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium bg-accent text-white rounded-input hover:bg-accent-hover transition-colors"
  >
  <CheckCircle className="w-4 h-4" />
  Approve
  </Link>
  </div>
  </div>
  ))}
  </div>
  ) : (
  <div className="py-10 text-center border border-dashed border-surface-border rounded-card">
  <CheckCircle className="w-10 h-10 text-emerald-500 mx-auto mb-3" />
  <h3 className="text-primary font-medium">All caught up!</h3>
  <p className="text-muted text-sm mt-1">No listings pending review</p>
  </div>
  )}
  </div>

  {/* Quick Actions */}
  <div className="bg-surface border border-surface-border rounded-card p-4 sm:p-6">
  <h2 className="text-lg font-semibold text-primary mb-4">Quick Actions</h2>
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
  <Link
  href="/admin/listings"
  className="flex items-center justify-between p-4 bg-background border border-surface-border rounded-input hover:border-accent transition-colors"
  >
  <div>
  <h3 className="font-medium text-primary">Manage Listings</h3>
  <p className="text-sm text-muted">Review, approve, and manage all listings</p>
  </div>
  <ArrowRight className="w-5 h-5 text-muted" />
  </Link>
  </div>
  </div>
  </div>
  );
}
