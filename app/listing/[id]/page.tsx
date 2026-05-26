import { createServerClient } from "@/lib/supabase/server";
import Image from "next/image";
import Link from "next/link";
import { formatCurrency, formatDate } from "@/lib/utils";
import StatusBadge from "@/components/StatusBadge";
import CopyContactButton from "@/components/CopyContactButton";
import { ArrowLeft, Phone, Mail, MessageCircle, Bookmark } from "lucide-react";

export default async function ListingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = createServerClient();

  const { data: listing } = await supabase
  .from("listings")
  .select("*")
  .eq("id", id)
  .single();

  if (listing) {
  const { data: profile } = await supabase
  .from("profiles")
  .select("*")
  .eq("id", listing.user_id)
  .single();
  if (profile) {
  (listing as any).profiles = profile;
  }
  }

  if (!listing) {
  return (
  <div className="max-w-2xl mx-auto px-4 py-16 text-center">
  <h1 className="text-2xl font-bold text-text mb-2">Listing not found</h1>
  <p className="text-text-mute mb-6">This listing may have been removed or does not exist.</p>
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

  const specs: Record<string, string> = {
  Category: listing.category,
  Posted: formatDate(listing.created_at),
  Status: listing.status,
  Contact: listing.contact_info,
  };

  return (
  <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
  <Link
  href="/"
  className="inline-flex items-center gap-1 text-sm text-text-mute hover:text-text transition-colors mb-6"
  >
  <ArrowLeft className="w-4 h-4" />
  Back to marketplace
  </Link>

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
  <button className="absolute top-3 right-3 w-9 h-9 rounded-full grid place-items-center bg-black/40 text-white backdrop-blur-sm hover:bg-black/60 transition-colors">
  <Bookmark size={15} />
  </button>
  </div>
  </div>

  {/* Details side */}
  <div className="flex flex-col gap-5">
  <div>
  <div className="flex items-center gap-2 mb-3">
  <span className="chip-ui capitalize">{listing.category}</span>
  {listing.is_featured && <span className="chip-ui chip-featured">Featured</span>}
  <span className="font-mono text-xs text-text-mute ml-auto">{formatDate(listing.created_at)}</span>
  </div>
  <h1 className="text-2xl sm:text-[32px] font-semibold tracking-tight leading-tight">
  {listing.title}
  </h1>
  </div>

  <div className="flex items-baseline gap-3">
  <div className="font-mono text-[44px] font-semibold tracking-tight text-text">
  {listing.price === 0 ? "Free" : `₹${(listing.price || 0).toLocaleString("en-IN")}`}
  </div>
  {listing.price_label && (
  <div className="text-text-mute text-sm font-mono">{listing.price_label}</div>
  )}
  </div>

  {/* CTA buttons */}
  <div className="flex gap-2">
  <Link
  href={whatsappLink || (isEmail ? `mailto:${listing.contact_info}` : `tel:${listing.contact_info}`)}
  target={whatsappLink ? "_blank" : undefined}
  className="btn-primary flex-1 py-3 text-base justify-center"
  >
  <MessageCircle size={18} />
  {listing.category === "event" ? "RSVP" : listing.category === "learning" ? "Enroll" : "Message seller"}
  </Link>
  <button className="btn-ghost icon-btn w-11 h-11 rounded-md" aria-label="Save">
  <Bookmark size={18} />
  </button>
  <Link
  href={isEmail ? `mailto:${listing.contact_info}` : `tel:${listing.contact_info}`}
  className="btn-ghost icon-btn w-11 h-11 rounded-md"
  aria-label="Contact"
  >
  <Phone size={18} />
  </Link>
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
  <div className="text-right">
  <div className="stars-ui text-sm">★★★★★</div>
  <div className="text-text-mute text-[11px] font-mono mt-1">Verified</div>
  </div>
  </div>

  {/* Specs */}
  <div>
  <div className="eyebrow-ui mb-1">DETAILS</div>
  {Object.entries(specs).map(([k, v]) => (
  <div key={k} className="grid grid-cols-[130px_1fr] gap-4 py-3.5 border-b border-divider text-sm">
  <div className="text-text-mute font-mono text-xs tracking-wider uppercase">{k}</div>
  <div className="text-text">{k === "Status" ? <StatusBadge status={v as any} /> : v}</div>
  </div>
  ))}
  </div>
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

  {/* Contact section */}
  <div className="card-ui p-5 sm:p-6">
  <div className="eyebrow-ui mb-3">CONTACT SELLER</div>
  <div className="flex flex-wrap gap-2">
  {whatsappLink && (
  <a
  href={whatsappLink}
  target="_blank"
  rel="noopener noreferrer"
  className="btn-ghost"
  >
  <MessageCircle size={16} />
  WhatsApp
  </a>
  )}
  {isEmail ? (
  <a href={`mailto:${listing.contact_info}`} className="btn-ghost">
  <Mail size={16} />
  Email
  </a>
  ) : (
  <a href={`tel:${listing.contact_info}`} className="btn-ghost">
  <Phone size={16} />
  Call
  </a>
  )}
  <CopyContactButton contact={listing.contact_info} />
  </div>
  </div>
  </div>
  );
}
