"use client";

import Image from "next/image";
import Link from "next/link";
import { Listing } from "@/types";
import { formatCurrency, formatDateShort } from "@/lib/utils";
import { Bookmark, ShoppingBag, Wrench, Calendar, BookOpen } from "lucide-react";

interface ListingCardProps {
  listing: Listing;
  compact?: boolean;
}

const catIcon: Record<string, React.ReactNode> = {
  product: <ShoppingBag size={12} />,
  service: <Wrench size={12} />,
  event: <Calendar size={12} />,
};

export default function ListingCard({ listing, compact = false }: ListingCardProps) {
  const priceDisplay = listing.price_label || (listing.price === 0 ? "Free" : formatCurrency(listing.price));

  return (
  <Link href={`/listing/${listing.id}`} className="group block">
  <div className="bg-surface border border-border rounded-lg p-3 cursor-pointer transition-all hover:border-border-strong hover:-translate-y-0.5 flex flex-col gap-3 h-full">
  {/* Thumbnail */}
  <div className="relative aspect-[4/3] rounded-md overflow-hidden bg-bg">
  {listing.photo_url ? (
  <Image
  src={listing.photo_url}
  alt={listing.title}
  fill
  className="object-cover"
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  />
  ) : (
  <div className={`thumb-ui thumb-${listing.category} w-full h-full`}>
  <span style={{ fontSize: compact ? 36 : 48 }}>
  {listing.category === "product" ? "🛒" : listing.category === "service" ? "🔧" : listing.category === "event" ? "🎪" : "📚"}
  </span>
  </div>
  )}

  {/* Featured badge */}
  {listing.is_featured && (
  <span className="absolute top-2.5 left-2.5 bg-text text-bg font-mono text-[10px] font-semibold tracking-[0.12em] px-2 py-[3px] rounded-sm uppercase">
  Featured
  </span>
  )}

  {/* Bookmark */}
  <button
  className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full grid place-items-center bg-black/40 text-white backdrop-blur-sm transition-colors hover:bg-black/60"
  onClick={(e) => e.preventDefault()}
  aria-label="Save"
  >
  <Bookmark size={14} />
  </button>
  </div>

  {/* Info */}
  <div className="px-1 pb-1 flex flex-col flex-1 min-w-0">
  <div className="flex items-center gap-2 font-mono text-[11px] text-text-mute tracking-wider uppercase mb-2">
  <span className="capitalize">{listing.category}</span>
  <span style={{ color: "var(--text-dim)" }}>·</span>
  <span>{formatDateShort(listing.created_at)}</span>
  </div>

  <h3 className="text-base font-semibold tracking-tight text-text leading-snug mb-1 line-clamp-2">
  {listing.title}
  </h3>

  <div className="flex items-baseline justify-between mt-auto pt-2">
  <div className="font-mono text-lg font-semibold tracking-tight text-text">
  {priceDisplay}
  </div>

  {listing.profiles && (
  <div className="flex items-center gap-1.5 text-xs text-text-mute">
  {listing.profiles.avatar_url ? (
  <Image
  src={listing.profiles.avatar_url}
  alt=""
  width={18}
  height={18}
  className="rounded-full"
  />
  ) : (
  <div className="avatar-ui bg-surface-3 text-text-2" style={{ width: 18, height: 18, fontSize: 10 }}>
  {(listing.profiles.full_name || "U").charAt(0).toUpperCase()}
  </div>
  )}
  <span className="truncate max-w-[60px]">
  {(listing.profiles.full_name || "Anonymous").split(" ")[0]}
  </span>
  </div>
  )}
  </div>
  </div>
  </div>
  </Link>
  );
}
