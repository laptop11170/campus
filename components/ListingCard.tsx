"use client";

import Image from "next/image";
import Link from "next/link";
import { Listing } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { Sparkles } from "lucide-react";

interface ListingCardProps {
  listing: Listing;
}

const categoryColors: Record<string, string> = {
  product: "bg-teal-500/10 text-teal-400 border-teal-500/20",
  service: "bg-accent/10 text-accent border-accent/20",
  event: "bg-amber-500/10 text-amber-400 border-amber-500/20",
};

export default function ListingCard({ listing }: ListingCardProps) {
  return (
  <Link href={`/listing/${listing.id}`} className="group block">
  <div className="relative bg-surface border border-surface-border rounded-card overflow-hidden transition-all duration-300 hover:border-accent/30 hover:-translate-y-1 hover:shadow-lg hover:shadow-accent/5">
  {/* Image */}
  <div className="relative aspect-[16/10] overflow-hidden bg-background">
  {listing.photo_url ? (
  <Image
  src={listing.photo_url}
  alt={listing.title}
  fill
  className="object-cover transition-transform duration-500 group-hover:scale-105"
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  />
  ) : (
  <div className="flex items-center justify-center h-full bg-background">
  <span className="text-muted text-sm">No image</span>
  </div>
  )}

  {/* Featured badge */}
  {listing.is_featured && (
  <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 bg-accent text-white text-xs font-medium rounded-md">
  <Sparkles className="w-3 h-3" />
  Featured
  </div>
  )}

  {/* Category badge */}
  <div
  className={`absolute bottom-3 left-3 px-2 py-1 text-xs font-medium rounded-md border ${
  categoryColors[listing.category]
  }`}
  >
  {listing.category.charAt(0).toUpperCase() + listing.category.slice(1)}
  </div>
  </div>

  {/* Content */}
  <div className="p-4">
  <h3 className="text-primary font-semibold text-base truncate group-hover:text-accent transition-colors">
  {listing.title}
  </h3>

  <p className="text-muted text-sm mt-1 line-clamp-2">
  {listing.description}
  </p>

  <div className="flex items-center justify-between mt-3">
  <span className="text-primary font-bold text-sm">
  {listing.price_label || formatCurrency(listing.price)}
  </span>

  {listing.profiles && (
  <div className="flex items-center gap-2">
  {listing.profiles.avatar_url ? (
  <Image
  src={listing.profiles.avatar_url}
  alt={listing.profiles.full_name || ""}
  width={24}
  height={24}
  className="rounded-full"
  />
  ) : (
  <div className="w-6 h-6 rounded-full bg-surface-border flex items-center justify-center">
  <span className="text-xs text-muted">
  {(listing.profiles.full_name || "U").charAt(0).toUpperCase()}
  </span>
  </div>
  )}
  <span className="text-xs text-muted truncate max-w-[80px]">
  {listing.profiles.full_name || "Anonymous"}
  </span>
  </div>
  )}
  </div>
  </div>
  </div>
  </Link>
  );
}
