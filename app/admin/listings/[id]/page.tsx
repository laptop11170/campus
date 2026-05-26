"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { Listing } from "@/types";
import StatusBadge from "@/components/StatusBadge";
import { formatCurrency, formatDate } from "@/lib/utils";
import { ArrowLeft, Check, X, Star, ExternalLink, Trash2, Bookmark } from "lucide-react";

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
  <div className="max-w-5xl mx-auto px-4 py-20 text-center">
  <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto" />
  </div>
  );
  }

  if (!listing) {
  return (
  <div className="max-w-2xl mx-auto px-4 py-16 text-center">
  <h1 className="text-2xl font-bold text-text">Listing not found</h1>
  </div>
  );
  }

  const specs: Record<string, string | React.ReactNode> = {
  Category: listing.category,
  Price: listing.price === 0 ? "Free" : `₹${(listing.price || 0).toLocaleString("en-IN")}`,
  Status: <StatusBadge status={listing.status} />,
  Tier: listing.is_featured ? "Featured" : "Standard",
  "Posted on": formatDate(listing.created_at),
  "Contact": listing.contact_info,
  };

  if (listing.payment_amount) {
  specs["Payment"] = `₹${listing.payment_amount.toLocaleString("en-IN")}`;
  }

  return (
  <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
  <button
  onClick={() => router.push("/admin/listings")}
  className="inline-flex items-center gap-1 text-sm text-text-mute hover:text-text transition-colors mb-6"
  >
  <ArrowLeft className="w-4 h-4" />
  Back to listings
  </button>

  <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-8 mb-10">
  {/* Image */}
  <div>
  <div className="aspect-[5/4] rounded-xl overflow-hidden bg-surface border border-border relative">
  {listing.photo_url ? (
  <Image
  src={listing.photo_url}
  alt={listing.title}
  fill
  className="object-cover"
  />
  ) : (
  <div className={`thumb-ui thumb-${listing.category} w-full h-full`}>
  <span style={{ fontSize: 120, color: "rgba(0,0,0,0.5)" }}>
  {listing.category === "product" ? "🛒" : listing.category === "service" ? "🔧" : listing.category === "event" ? "🎪" : "📚"}
  </span>
  </div>
  )}
  {listing.is_featured && (
  <span className="absolute top-3 left-3 bg-text text-bg font-mono text-[10px] font-semibold tracking-[0.12em] px-2 py-[3px] rounded-sm uppercase">
  Featured
  </span>
  )}
  </div>

  {/* Payment screenshot */}
  {listing.payment_screenshot_url && (
  <div className="card-ui p-4 mt-4">
  <div className="eyebrow-ui mb-2">PAYMENT SCREENSHOT</div>
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
  <div className="flex flex-col gap-5">
  <div>
  <div className="flex items-center gap-2 mb-3">
  <span className="chip-ui capitalize">{listing.category}</span>
  <StatusBadge status={listing.status} />
  {listing.is_featured && <span className="chip-ui chip-featured">Featured</span>}
  </div>
  <h1 className="text-2xl sm:text-[32px] font-semibold tracking-tight leading-tight">
  {listing.title}
  </h1>
  </div>

  <div className="font-mono text-[44px] font-semibold tracking-tight text-text">
  {listing.price === 0 ? "Free" : `₹${(listing.price || 0).toLocaleString("en-IN")}`}
  </div>

  {/* Seller card */}
  <div className="card-ui p-4 flex items-center gap-3.5">
  {listing.profiles?.avatar_url ? (
  <Image
  src={listing.profiles.avatar_url}
  alt=""
  width={44}
  height={44}
  className="rounded-full"
  />
  ) : (
  <div className="avatar-ui bg-surface-3 text-text-2" style={{ width: 44, height: 44, fontSize: 15 }}>
  {(listing.profiles?.full_name || "U").charAt(0).toUpperCase()}
  </div>
  )}
  <div className="flex-1">
  <div className="font-semibold text-[15px]">{listing.profiles?.full_name || "Anonymous"}</div>
  <div className="text-text-mute text-xs font-mono">Student · IIT Mandi</div>
  </div>
  </div>

  {/* Specs */}
  <div>
  <div className="eyebrow-ui mb-1">DETAILS</div>
  {Object.entries(specs).map(([k, v]) => (
  <div key={k} className="grid grid-cols-[130px_1fr] gap-4 py-3.5 border-b border-divider text-sm">
  <div className="text-text-mute font-mono text-xs tracking-wider uppercase">{k}</div>
  <div className="text-text">{v}</div>
  </div>
  ))}
  </div>

  {/* Rejection reason */}
  {listing.rejection_reason && (
  <div className="p-3 bg-danger-soft border border-danger/20 rounded-lg">
  <p className="text-sm text-danger">Rejection reason: {listing.rejection_reason}</p>
  </div>
  )}
  </div>
  </div>

  {/* Description */}
  {listing.description && (
  <div className="mb-10">
  <div className="eyebrow-ui mb-3">DESCRIPTION</div>
  <p className="text-base leading-relaxed text-text-2 max-w-3xl whitespace-pre-line">
  {listing.description}
  </p>
  </div>
  )}

  {/* Admin Actions */}
  <div className="card-ui p-5 sm:p-6">
  <div className="eyebrow-ui mb-3">ADMIN ACTIONS</div>
  <div className="flex flex-wrap gap-2">
  {listing.status === "pending" && (
  <>
  <button
  onClick={handleApprove}
  className="btn-primary"
  >
  <Check className="w-4 h-4" />
  Approve & Publish
  </button>
  <button
  onClick={() => setShowRejectInput(true)}
  className="btn-danger"
  >
  <X className="w-4 h-4" />
  Reject
  </button>
  </>
  )}
  <button
  onClick={handleToggleFeatured}
  className={listing.is_featured ? "btn-primary" : "btn-ghost"}
  >
  <Star className="w-4 h-4" />
  {listing.is_featured ? "Unfeature" : "Feature"}
  </button>
  <button
  onClick={handleDelete}
  className="btn-danger"
  >
  <Trash2 className="w-4 h-4" />
  Delete
  </button>
  </div>

  {/* Reject reason input */}
  {showRejectInput && (
  <div className="mt-4 space-y-2">
  <textarea
  value={rejectReason}
  onChange={(e) => setRejectReason(e.target.value)}
  placeholder="Enter rejection reason..."
  rows={2}
  className="textarea-ui"
  />
  <div className="flex gap-2">
  <button
  onClick={() => setShowRejectInput(false)}
  className="btn-ghost btn-sm"
  >
  Cancel
  </button>
  <button
  onClick={handleReject}
  disabled={!rejectReason.trim()}
  className="btn-danger btn-sm"
  >
  Confirm Reject
  </button>
  </div>
  </div>
  )}
  </div>
  </div>
  );
}
