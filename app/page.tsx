export const dynamic = "force-dynamic";

import { createServerClient } from "@/lib/supabase/server";
import { Category } from "@/types";
import ListingCard from "@/components/ListingCard";
import Link from "next/link";
import { ArrowRight, Plus, ShoppingBag, Wrench, Calendar, BookOpen } from "lucide-react";
import Mountains from "@/components/ui/Mountains";

const catMeta: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
  product: { label: "Marketplace", icon: <ShoppingBag size={22} strokeWidth={1.8} />, color: "var(--cat-product)" },
  service: { label: "Services", icon: <Wrench size={22} strokeWidth={1.8} />, color: "var(--cat-service)" },
  event: { label: "Events", icon: <Calendar size={22} strokeWidth={1.8} />, color: "var(--cat-event)" },
  learning: { label: "Learning", icon: <BookOpen size={22} strokeWidth={1.8} />, color: "var(--cat-learning)" },
};

export default async function HomePage({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const params = await searchParams;
  const activeCategory = params.category as Category | "all" | undefined;
  const supabase = createServerClient();

  let query = supabase
  .from("listings")
  .select("*")
  .eq("status", "approved")
  .order("is_featured", { ascending: false })
  .order("created_at", { ascending: false });

  if (activeCategory && activeCategory !== "all") {
  query = query.eq("category", activeCategory);
  }

  const { data: listingsData } = await query;
  const listings = listingsData || [];

  const { data: profilesData } = await supabase.from("profiles").select("*");
  const profilesMap = new Map(profilesData?.map((p) => [p.id, p]) || []);
  const listingsWithProfiles = listings.map((l) => ({
  ...l,
  profiles: profilesMap.get(l.user_id) || undefined,
  }));

  const featured = listingsWithProfiles.filter((l) => l.is_featured);
  const hero = featured[0] || listingsWithProfiles[0];
  const fresh = listingsWithProfiles.slice(0, 8);

  // Category counts
  const { data: catCounts } = await supabase
  .from("listings")
  .select("category", { count: "exact", head: false })
  .eq("status", "approved");
  const counts: Record<string, number> = {};
  catCounts?.forEach((c) => {
  counts[c.category] = (counts[c.category] || 0) + 1;
  });

  return (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8"
  >
  {/* Hero */}
  {hero && (
  <div className="relative rounded-lg overflow-hidden mb-8"
  style={{
  background: "linear-gradient(120deg, var(--accent-soft), transparent 70%), var(--surface)",
  border: "1px solid var(--border)",
  }}
  >
  <div className="grid grid-cols-1 md:grid-cols-[1.3fr_1fr] gap-8 items-center p-6 sm:p-10 min-h-[280px]"
  >
  <div className="relative z-10"
  >
  <div className="font-mono text-xs text-accent tracking-[0.16em] uppercase mb-3"
  >
  ● Featured
  </div>
  <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-semibold leading-tight tracking-tight mb-3"
  >
  {hero.title}
  </h1>
  <p className="text-text-2 text-sm sm:text-base leading-relaxed max-w-md mb-6"
  >
  {hero.description || `${hero.category} listing from campus.`}
  </p>
  <div className="flex gap-2.5 flex-wrap"
  >
  <Link
  href={`/listing/${hero.id}`}
  className="btn-primary text-sm py-2.5 px-5 rounded-md"
  >
  View listing <ArrowRight size={16} />
  </Link>
  <Link
  href="/list"
  className="btn-ghost text-sm py-2.5 px-5 rounded-md"
  >
  <Plus size={16} /> Post yours
  </Link>
  </div>
  </div>

  {/* Hero featured pick */}
  <Link href={`/listing/${hero.id}`} className="hidden md:block"
  >
  <div className="bg-bg-elev border border-border rounded-md p-5 cursor-pointer transition-all hover:border-border-strong hover:-translate-y-0.5"
  >
  <div className="thumb-ui thumb-product w-full aspect-[16/10] mb-4"
  >
  {hero.photo_url ? (
  <img src={hero.photo_url} alt="" className="w-full h-full object-cover rounded-md" />
  ) : (
  <span style={{ fontSize: 64, color: "rgba(0,0,0,0.55)" }}
  >
  {hero.category === "product" ? "🛒" : hero.category === "service" ? "🔧" : hero.category === "event" ? "🎪" : "📚"}
  </span>
  )}
  </div>
  <div className="font-mono text-[11px] text-text-mute tracking-wider uppercase mb-1.5"
  >
  {hero.category}
  </div>
  <div className="font-semibold text-base mb-1.5 tracking-tight"
  >
  {hero.title}
  </div>
  <div className="font-mono text-lg font-semibold text-accent"
  >
  {hero.price === 0 ? "Free" : `₹${(hero.price || 0).toLocaleString("en-IN")}`}
  </div>
  </div>
  </Link>
  </div>
  </div>
  )}

  {/* Category tiles */}
  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8"
  >
  {Object.entries(catMeta).map(([key, meta]) => (

  <Link
  key={key}
  href={`/?category=${key}`}
  className="bg-surface border border-border rounded-lg p-4 sm:p-5 cursor-pointer flex items-center gap-3 sm:gap-3.5 transition-all hover:border-border-strong hover:-translate-y-0.5"
  >
  <div
  className="w-12 h-12 rounded-md grid place-items-center text-[22px] flex-shrink-0"
  style={{ background: meta.color, color: "rgba(0,0,0,0.5)" }}
  >
  {meta.icon}
  </div>
  <div className="min-w-0"
  >
  <div className="font-semibold text-base tracking-tight truncate"
  >
  {meta.label}
  </div>
  <div className="font-mono text-xs text-text-mute truncate"
  >
  {counts[key] || 0} live
  </div>
  </div>
  <ArrowRight size={16} className="text-text-mute ml-auto flex-shrink-0 hidden sm:block" />
  </Link>
  ))}
  </div>

  {/* Featured row */}
  {featured.length > 0 && (
  <div className="mb-9"
  >
  <div className="flex items-baseline justify-between mb-3.5"
  >
  <h3 className="font-display text-xl font-semibold tracking-tight"
  >
  Featured this week
  </h3>
  <Link href="/?category=all" className="font-mono text-xs text-text-mute tracking-wider flex items-center gap-1 hover:text-text transition-colors"
  >
  See all <ArrowRight size={12} />
  </Link>
  </div>
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3"
  >
  {featured.slice(0, 4).map((listing) => (

  <ListingCard key={listing.id} listing={listing} />
  ))}
  </div>
  </div>
  )}

  {/* New on campus */}
  {fresh.length > 0 && (
  <div className="mb-9"
  >
  <div className="flex items-baseline justify-between mb-3.5"
  >
  <h3 className="font-display text-xl font-semibold tracking-tight"
  >
  New on campus
  </h3>
  <Link href="/?category=all" className="font-mono text-xs text-text-mute tracking-wider flex items-center gap-1 hover:text-text transition-colors"
  >
  Browse all <ArrowRight size={12} />
  </Link>
  </div>
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3"
  >
  {fresh.map((listing) => (

  <ListingCard key={listing.id} listing={listing} />
  ))}
  </div>
  </div>
  )}

  {listingsWithProfiles.length === 0 && (
  <div className="empty-ui"
  >
  <div className="glyph"
  >🔭</div>
  <h3>Nothing here yet</h3>
  <p>Be the first to list something on the marketplace.</p>
  <Link href="/list" className="btn-primary"
  >List Something</Link>
  </div>
  )}
  </div>
  );
}
