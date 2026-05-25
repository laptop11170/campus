import { createServerClient } from "@/lib/supabase/server";
import { Category } from "@/types";
import ListingCard from "@/components/ListingCard";
import CategoryTabsWrapper from "@/components/CategoryTabsWrapper";
import { ArrowRight, Store } from "lucide-react";
import Link from "next/link";

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

  // FK join is broken in schema cache; fetch profiles separately and match manually
  const { data: profilesData } = await supabase.from("profiles").select("*");
  const profilesMap = new Map(profilesData?.map((p) => [p.id, p]) || []);
  const listingsWithProfiles = listings.map((l) => ({
  ...l,
  profiles: profilesMap.get(l.user_id) || undefined,
  }));

  return (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
  {/* Hero */}
  <section className="text-center py-16 sm:py-24">
  <div className="inline-flex items-center gap-2 px-3 py-1 bg-accent/10 border border-accent/20 rounded-full text-accent text-sm font-medium mb-6">
  <Store className="w-4 h-4" />
  IIT Mandi Marketplace
  </div>
  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-primary tracking-tight">
  Everything on campus.
  <br />
  <span className="text-accent">One place.</span>
  </h1>
  <p className="mt-4 text-lg text-muted max-w-xl mx-auto">
  Find products, services, and events listed by your fellow students.
  </p>
  <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
  <Link
  href="/list"
  className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-white font-medium rounded-input hover:bg-accent-hover transition-colors"
  >
  List Something
  <ArrowRight className="w-4 h-4" />
  </Link>
  <Link
  href="#listings"
  className="inline-flex items-center gap-2 px-6 py-3 border border-surface-border text-primary font-medium rounded-input hover:bg-white/5 transition-colors"
  >
  Browse Listings
  </Link>
  </div>
  </section>

  {/* Listings */}
  <section id="listings" className="py-8">
  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
  <h2 className="text-2xl font-bold text-primary">Latest Listings</h2>
  <CategoryTabsWrapper activeCategory={activeCategory || "all"} />
  </div>

  {listingsWithProfiles.length > 0 ? (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
  {listingsWithProfiles.map((listing) => (
  <ListingCard key={listing.id} listing={listing} />
  ))}
  </div>
  ) : (
  <div className="py-20 text-center border border-dashed border-surface-border rounded-card">
  <Store className="w-12 h-12 text-muted mx-auto mb-4" />
  <h3 className="text-lg font-semibold text-primary mb-1">
  Nothing here yet
  </h3>
  <p className="text-muted mb-4">
  Be the first to list something on the marketplace.
  </p>
  <Link
  href="/list"
  className="inline-flex items-center gap-2 px-4 py-2 bg-accent text-white text-sm font-medium rounded-input hover:bg-accent-hover transition-colors"
  >
  List Something
  </Link>
  </div>
  )}
  </section>
  </div>
  );
}
