import { createServerClient } from "@/lib/supabase/server";
import Image from "next/image";
import Link from "next/link";
import { formatCurrency, formatDate } from "@/lib/utils";
import StatusBadge from "@/components/StatusBadge";
import CopyContactButton from "@/components/CopyContactButton";
import { ArrowLeft, Phone, Mail, MessageCircle, AlertTriangle } from "lucide-react";

export default async function ListingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = createServerClient();

  const { data: listing } = await supabase
  .from("listings")
  .select(`*, profiles (id, full_name, avatar_url, email, role, created_at)`)
  .eq("id", id)
  .single();

  if (!listing) {
  return (
  <div className="max-w-2xl mx-auto px-4 py-16 text-center">
  <h1 className="text-2xl font-bold text-primary mb-2">Listing not found</h1>
  <p className="text-muted mb-6">This listing may have been removed or does not exist.</p>
  <Link href="/" className="text-accent hover:underline">
  Back to marketplace
  </Link>
  </div>
  );
  }

  const isWhatsApp = listing.contact_info.replace(/\D/g, "").length >= 10;
  const whatsappLink = isWhatsApp
  ? `https://wa.me/${listing.contact_info.replace(/\D/g, "")}`
  : null;
  const isEmail = listing.contact_info.includes("@");

  const categoryColors: Record<string, string> = {
  product: "bg-teal-500/10 text-teal-400 border-teal-500/20",
  service: "bg-accent/10 text-accent border-accent/20",
  event: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  };

  return (
  <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
  <Link
  href="/"
  className="inline-flex items-center gap-1 text-sm text-muted hover:text-primary transition-colors mb-6"
  >
  <ArrowLeft className="w-4 h-4" />
  Back to marketplace
  </Link>

  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
  {/* Image */}
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

  {/* Details */}
  <div className="space-y-4">
  <div className="flex items-center gap-2">
  <span
  className={`px-2.5 py-1 text-xs font-medium rounded-md border ${
  categoryColors[listing.category]
  }`}
  >
  {listing.category.charAt(0).toUpperCase() + listing.category.slice(1)}
  </span>
  {listing.is_featured && (
  <span className="px-2.5 py-1 text-xs font-medium rounded-md bg-accent text-white">
  Featured
  </span>
  )}
  <StatusBadge status={listing.status} />
  </div>

  <h1 className="text-2xl font-bold text-primary">{listing.title}</h1>

  <p className="text-3xl font-bold text-accent">
  {listing.price_label || formatCurrency(listing.price)}
  </p>

  <div className="bg-surface border border-surface-border rounded-card p-4">
  <h3 className="text-sm font-medium text-muted mb-2">Description</h3>
  <p className="text-primary whitespace-pre-line">{listing.description}</p>
  </div>

  {/* Seller */}
  <div className="flex items-center gap-3 py-3 border-t border-surface-border">
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
  <p className="text-xs text-muted">
  Listed on {formatDate(listing.created_at)}
  </p>
  </div>
  </div>

  {/* Contact */}
  <div className="space-y-2">
  <h3 className="text-sm font-medium text-muted">Contact Seller</h3>
  <div className="flex flex-wrap gap-2">
  {whatsappLink && (
  <a
  href={whatsappLink}
  target="_blank"
  rel="noopener noreferrer"
  className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-input text-sm font-medium hover:bg-emerald-500/20 transition-colors"
  >
  <MessageCircle className="w-4 h-4" />
  WhatsApp
  </a>
  )}
  {isEmail ? (
  <a
  href={`mailto:${listing.contact_info}`}
  className="inline-flex items-center gap-2 px-4 py-2.5 bg-accent/10 text-accent border border-accent/20 rounded-input text-sm font-medium hover:bg-accent/20 transition-colors"
  >
  <Mail className="w-4 h-4" />
  Email
  </a>
  ) : (
  <a
  href={`tel:${listing.contact_info}`}
  className="inline-flex items-center gap-2 px-4 py-2.5 bg-accent/10 text-accent border border-accent/20 rounded-input text-sm font-medium hover:bg-accent/20 transition-colors"
  >
  <Phone className="w-4 h-4" />
  Call
  </a>
  )}
  <CopyContactButton contact={listing.contact_info} />
  </div>
  </div>

  {/* Report */}
  <button className="inline-flex items-center gap-1.5 text-sm text-red-400 hover:text-red-300 transition-colors">
  <AlertTriangle className="w-4 h-4" />
  Report this listing
  </button>
  </div>
  </div>
  </div>
  );
}
