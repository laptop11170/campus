"use client";

import Image from "next/image";
import Link from "next/link";
import { Listing } from "@/types";
import { formatDate } from "@/lib/utils";
import StatusBadge from "./StatusBadge";
import {
  Check,
  X,
  Eye,
  Trash2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useState } from "react";

interface AdminTableProps {
  listings: Listing[];
  onApprove: (id: string) => void;
  onReject: (id: string, reason: string) => void;
  onToggleFeatured: (id: string, featured: boolean) => void;
  onDelete: (id: string) => void;
}

export default function AdminTable({
  listings,
  onApprove,
  onReject,
  onToggleFeatured,
  onDelete,
}: AdminTableProps) {
  const [rejectModal, setRejectModal] = useState<{
  id: string;
  reason: string;
  } | null>(null);
  const [sortField, setSortField] = useState<string>("created_at");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const handleSort = (field: string) => {
  if (sortField === field) {
  setSortDir((d) => (d === "asc" ? "desc" : "asc"));
  } else {
  setSortField(field);
  setSortDir("desc");
  }
  };

  const sortedListings = [...listings].sort((a, b) => {
  let cmp = 0;
  switch (sortField) {
  case "title":
  cmp = a.title.localeCompare(b.title);
  break;
  case "category":
  cmp = a.category.localeCompare(b.category);
  break;
  case "status":
  cmp = a.status.localeCompare(b.status);
  break;
  case "created_at":
  default:
  cmp = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
  break;
  }
  return sortDir === "asc" ? cmp : -cmp;
  });

  const SortIcon = ({ field }: { field: string }) => {
  if (sortField !== field) return null;
  return sortDir === "asc" ? (
  <ChevronUp className="w-3 h-3 inline ml-1" />
  ) : (
  <ChevronDown className="w-3 h-3 inline ml-1" />
  );
  };

  return (
  <>
  <div className="overflow-x-auto border border-surface-border rounded-card">
  <table className="w-full text-sm">
  <thead>
  <tr className="border-b border-surface-border bg-background">
  <th
  className="text-left px-4 py-3 font-medium text-muted cursor-pointer hover:text-primary"
  onClick={() => handleSort("title")}
  >
  Title <SortIcon field="title" />
  </th>
  <th
  className="text-left px-4 py-3 font-medium text-muted cursor-pointer hover:text-primary hidden sm:table-cell"
  onClick={() => handleSort("category")}
  >
  Category <SortIcon field="category" />
  </th>
  <th className="text-left px-4 py-3 font-medium text-muted hidden md:table-cell">
  Seller
  </th>
  <th
  className="text-left px-4 py-3 font-medium text-muted cursor-pointer hover:text-primary"
  onClick={() => handleSort("status")}
  >
  Status <SortIcon field="status" />
  </th>
  <th
  className="text-left px-4 py-3 font-medium text-muted cursor-pointer hover:text-primary hidden lg:table-cell"
  onClick={() => handleSort("created_at")}
  >
  Submitted <SortIcon field="created_at" />
  </th>
  <th className="text-right px-4 py-3 font-medium text-muted">
  Actions
  </th>
  </tr>
  </thead>
  <tbody>
  {sortedListings.map((listing) => (
  <tr
  key={listing.id}
  className="border-b border-surface-border hover:bg-white/[0.02] transition-colors"
  >
  <td className="px-4 py-3">
  <Link
  href={`/admin/listings/${listing.id}`}
  className="text-primary hover:text-accent transition-colors"
  >
  <div className="flex items-center gap-3">
  {listing.photo_url ? (
  <Image
  src={listing.photo_url}
  alt=""
  width={40}
  height={40}
  className="rounded-md object-cover flex-shrink-0"
  />
  ) : (
  <div className="w-10 h-10 rounded-md bg-background flex items-center justify-center flex-shrink-0">
  <span className="text-xs text-muted-dark">No img</span>
  </div>
  )}
  <div>
  <div className="font-medium truncate max-w-[160px] sm:max-w-[200px]">
  {listing.title}
  </div>
  {listing.is_featured && (
  <span className="text-xs text-accent">Featured</span>
  )}
  </div>
  </div>
  </Link>
  </td>
  <td className="px-4 py-3 text-muted capitalize hidden sm:table-cell">
  {listing.category}
  </td>
  <td className="px-4 py-3 hidden md:table-cell">
  <div className="flex items-center gap-2">
  {listing.profiles?.avatar_url ? (
  <Image
  src={listing.profiles.avatar_url}
  alt=""
  width={24}
  height={24}
  className="rounded-full"
  />
  ) : (
  <div className="w-6 h-6 rounded-full bg-surface-border flex items-center justify-center">
  <span className="text-xs text-muted">
  {(listing.profiles?.full_name || "U")
  .charAt(0)
  .toUpperCase()}
  </span>
  </div>
  )}
  <span className="text-muted truncate max-w-[100px]">
  {listing.profiles?.full_name || "Anonymous"}
  </span>
  </div>
  </td>
  <td className="px-4 py-3">
  <StatusBadge status={listing.status} />
  </td>
  <td className="px-4 py-3 text-muted hidden lg:table-cell">
  {formatDate(listing.created_at)}
  </td>
  <td className="px-4 py-3">
  <div className="flex items-center justify-end gap-1">
  <Link
  href={`/admin/listings/${listing.id}`}
  className="p-1.5 text-muted hover:text-primary transition-colors"
  title="View"
  >
  <Eye className="w-4 h-4" />
  </Link>

  {listing.status === "pending" && (
  <>
  <button
  onClick={() => onApprove(listing.id)}
  className="p-1.5 text-emerald-500 hover:text-emerald-400 transition-colors"
  title="Approve"
  >
  <Check className="w-4 h-4" />
  </button>
  <button
  onClick={() =>
  setRejectModal({ id: listing.id, reason: "" })
  }
  className="p-1.5 text-red-500 hover:text-red-400 transition-colors"
  title="Reject"
  >
  <X className="w-4 h-4" />
  </button>
  </>
  )}

  <button
  onClick={() =>
  onToggleFeatured(listing.id, !listing.is_featured)
  }
  className={`p-1.5 transition-colors ${
  listing.is_featured
  ? "text-accent hover:text-accent-hover"
  : "text-muted hover:text-primary"
  }`}
  title="Toggle featured"
  >
  <svg
  className="w-4 h-4"
  fill={listing.is_featured ? "currentColor" : "none"}
  viewBox="0 0 24 24"
  stroke="currentColor"
  strokeWidth={2}
  >
  <path
  strokeLinecap="round"
  strokeLinejoin="round"
  d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
  />
  </svg>
  </button>

  <button
  onClick={() => onDelete(listing.id)}
  className="p-1.5 text-red-500 hover:text-red-400 transition-colors"
  title="Delete"
  >
  <Trash2 className="w-4 h-4" />
  </button>
  </div>
  </td>
  </tr>
  ))}
  </tbody>
  </table>

  {listings.length === 0 && (
  <div className="py-12 text-center">
  <p className="text-muted">No listings found</p>
  </div>
  )}
  </div>

  {/* Reject Modal */}
  {rejectModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
  <div className="w-full max-w-md bg-surface border border-surface-border rounded-card p-6">
  <h3 className="text-lg font-bold text-primary mb-2">
  Reject Listing
  </h3>
  <p className="text-sm text-muted mb-4">
  Provide a reason for rejection. The seller will see this.
  </p>
  <textarea
  value={rejectModal.reason}
  onChange={(e) =>
  setRejectModal({ ...rejectModal, reason: e.target.value })
  }
  placeholder="e.g., Image is blurry, inappropriate content..."
  rows={3}
  className="w-full px-4 py-2.5 bg-background border border-surface-border rounded-input text-primary placeholder:text-muted-dark focus:outline-none focus:border-accent transition-colors resize-none mb-4"
  />
  <div className="flex gap-2 justify-end">
  <button
  onClick={() => setRejectModal(null)}
  className="px-4 py-2 text-sm font-medium text-muted hover:text-primary transition-colors"
  >
  Cancel
  </button>
  <button
  onClick={() => {
  if (rejectModal.reason.trim()) {
  onReject(rejectModal.id, rejectModal.reason);
  setRejectModal(null);
  }
  }}
  className="px-4 py-2 text-sm font-medium bg-red-500 text-white rounded-input hover:bg-red-600 transition-colors"
  >
  Reject
  </button>
  </div>
  </div>
  </div>
  )}
  </>
  );
}
