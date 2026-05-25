"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { Listing } from "@/types";
import StatusBadge from "@/components/StatusBadge";
import { formatCurrency, formatDate } from "@/lib/utils";
import { ArrowLeft, Check, X, Star, ExternalLink, Trash2 } from "lucide-react";

export default function AdminListingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [rejectReason, setRejectReason] = useState("");
  const [showRejectInput, setShowRejectInput] = useState(false);

  const id = params.id as string;

  const fetchListing = useCallback(async () => {
  const supabase = createClient();
  const { data } = await supabase
  .from("listings")
  .select("*")
  .eq("id", id)
  .single();

  if (data) {
  const { data: profile } = await supabase
  .from("profiles")
  .select("*")
  .eq("id", data.user_id)
  .single();
  if (profile) {
  setListing({ ...data, profiles: profile });
  } else {
  setListing(data);
  }
  } else {
  setListing(data);
  }
  setLoading(false);
  }, [id]);

  useEffect(() => {
  fetchListing();
  }, [fetchListing]);

  const handleApprove = async () => {
  const supabase = createClient();
  const { error } = await supabase
  .from("listings")
  .update({ status: "approved" })
  .eq("id", id);
  if (!error) fetchListing();
  };

  const handleReject = async () => {
  if (!rejectReason.trim()) return;
  const supabase = createClient();
  const { error } = await supabase
  .from("listings")
  .update({ status: "rejected", rejection_reason: rejectReason })
  .eq("id", id);
  if (!error) {
  setShowRejectInput(false);
  setRejectReason("");
  fetchListing();
  }
  };

  const handleToggleFeatured = async () => {
  if (!listing) return;
  const supabase = createClient();
  const { error } = await supabase
  .from("listings")
  .update({ is_featured: !listing.is_featured })
  .eq("id", id);
  if (!error) fetchListing();
  };

  const handleDelete = async () => {
  if (!confirm("Delete this listing permanently?")) return;
  const supabase = createClient();
  await supabase.from("listings").delete().eq("id", id);
  router.push("/admin/listings");
  };

  if (loading) {
  return (
  <div className="max-w-4xl mx-auto px-4 py-20 text-center">
  <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto" />
  </div>
  );
  }

  if (!listing) {
  return (
  <div className="max-w-2xl mx-auto px-4 py-16 text-center">
  <h1 className="text-2xl font-bold text-primary">Listing not found</h1>
  </div>
  );
  }

  const categoryColors: Record<string, string> = {
  product: "bg-teal-500/10 text-teal-400 border-teal-500/20",
  service: "bg-accent/10 text-accent border-accent/20",
  event: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  };

  return (
  <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
  <button
  onClick={() => router.push("/admin/listings")}
  className="inline-flex items-center gap-1 text-sm text-muted hover:text-primary transition-colors mb-6"
  >
  <ArrowLeft className="w-4 h-4" />
  Back to listings
  </button>

  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
  {/* Image */}
  <div className="space-y-4">
  <div className="aspect-[4/3] bg-surface border border-surface-border rounded-card overflow-hidden">
  {listing.photo_url ? (
  <Image
  src={listing.photo_url}
  alt={listing.title}
  width={600}
  height={450}
  className="w-full h-full object-cover"
  />
  ) : (
  <div className="flex items-center justify-center h-full">
  <span className="text-muted">No image</span>
  </div>
  )}
  </div>

  {/* Payment screenshot */}
  {listing.payment_screenshot_url && (
  <div className="bg-surface border border-surface-border rounded-card p-4">
  <h3 className="text-sm font-medium text-muted mb-2">Payment Screenshot</h3>
  <a
  href={listing.payment_screenshot_url}
  target="_blank"
  rel="noopener noreferrer"
  className="inline-flex items-center gap-2 text-accent hover:underline text-sm"
  >
  <ExternalLink className="w-4 h-4" />
  View Screenshot
  </a>
  </div>
  )}
  </div>

  {/* Details */}
  <div className="space-y-4">
  <div className="flex items-center gap-2 flex-wrap">
  <span className={`px-2.5 py-1 text-xs font-medium rounded-md border ${categoryColors[listing.category]}`}>
  {listing.category.charAt(0).toUpperCase() + listing.category.slice(1)}
  </span>
  <StatusBadge status={listing.status} />
  {listing.is_featured && (
  <span className="px-2.5 py-1 text-xs font-medium rounded-md bg-accent text-white">
  Featured
  </span>
  )}
  </div>

  <h1 className="text-2xl font-bold text-primary">{listing.title}</h1>

  <p className="text-3xl font-bold text-accent">
  {listing.price_label || formatCurrency(listing.price)}
  </p>

  {listing.payment_amount && (
  <p className="text-sm text-muted">
  Payment amount: {formatCurrency(listing.payment_amount)}
  </p>
  )}

  <div className="bg-surface border border-surface-border rounded-card p-4">
  <h3 className="text-sm font-medium text-muted mb-2">Description</h3>
  <p className="text-primary whitespace-pre-line">{listing.description}</p>
  </div>

  <div className="bg-surface border border-surface-border rounded-card p-4">
  <h3 className="text-sm font-medium text-muted mb-2">Contact Info</h3>
  <p className="text-primary">{listing.contact_info}</p>
  </div>

  <div className="flex items-center gap-3 py-2 border-t border-surface-border">
  {listing.profiles?.avatar_url ? (
  <Image
  src={listing.profiles.avatar_url}
  alt=""
  width={40}
  height={40}
  className="rounded-full"
  />
  ) : (
  <div className="w-10 h-10 rounded-full bg-surface-border flex items-center justify-center">
  <span className="text-sm text-muted">
  {(listing.profiles?.full_name || "U").charAt(0).toUpperCase()}
  </span>
  </div>
  )}
  <div>
  <p className="text-sm font-medium text-primary">
  {listing.profiles?.full_name || "Anonymous"}
  </p>
  <p className="text-xs text-muted">Listed on {formatDate(listing.created_at)}</p>
  </div>
  </div>

  {listing.rejection_reason && (
  <div className="p-3 bg-red-500/5 border border-red-500/10 rounded-input">
  <p className="text-sm text-red-400">Rejection reason: {listing.rejection_reason}</p>
  </div>
  )}

  {/* Actions */}
  <div className="flex flex-wrap gap-2 pt-4">
  {listing.status === "pending" && (
  <>
  <button
  onClick={handleApprove}
  className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white text-sm font-medium rounded-input hover:bg-emerald-600 transition-colors"
  >
  <Check className="w-4 h-4" />
  Approve
  </button>
  <button
  onClick={() => setShowRejectInput(true)}
  className="inline-flex items-center gap-2 px-4 py-2 bg-red-500 text-white text-sm font-medium rounded-input hover:bg-red-600 transition-colors"
  >
  <X className="w-4 h-4" />
  Reject
  </button>
  </>
  )}
  <button
  onClick={handleToggleFeatured}
  className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-input transition-colors ${
  listing.is_featured
  ? "bg-accent text-white"
  : "bg-background border border-surface-border text-primary hover:bg-white/5"
  }`}
  >
  <Star className="w-4 h-4" />
  {listing.is_featured ? "Unfeature" : "Feature"}
  </button>
  <button
  onClick={handleDelete}
  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-400 hover:text-red-300 transition-colors"
  >
  <Trash2 className="w-4 h-4" />
  Delete
  </button>
  </div>

  {/* Reject reason input */}
  {showRejectInput && (
  <div className="space-y-2">
  <textarea
  value={rejectReason}
  onChange={(e) => setRejectReason(e.target.value)}
  placeholder="Enter rejection reason..."
  rows={2}
  className="w-full px-4 py-2.5 bg-background border border-surface-border rounded-input text-primary placeholder:text-muted-dark focus:outline-none focus:border-red-500 transition-colors resize-none"
  />
  <div className="flex gap-2">
  <button
  onClick={() => setShowRejectInput(false)}
  className="px-3 py-1.5 text-sm text-muted hover:text-primary transition-colors"
  >
  Cancel
  </button>
  <button
  onClick={handleReject}
  disabled={!rejectReason.trim()}
  className="px-3 py-1.5 text-sm bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors disabled:opacity-50"
  >
  Confirm Reject
  </button>
  </div>
  </div>
  )}
  </div>
  </div>
  </div>
  );
}
