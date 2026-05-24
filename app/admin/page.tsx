import { createServerClient } from "@/lib/supabase/server";
import Link from "next/link";
import { ArrowRight, ClipboardList, CheckCircle, Clock, XCircle } from "lucide-react";

export default async function AdminDashboard() {
  const supabase = createServerClient();

  const { data: listingsData } = await supabase
  .from("listings")
  .select("id, status")
  .order("created_at", { ascending: false });

  const listings = listingsData || [];
  const total = listings.length;
  const pending = listings.filter((l) => l.status === "pending").length;
  const approved = listings.filter((l) => l.status === "approved").length;
  const rejected = listings.filter((l) => l.status === "rejected").length;

  const stats = [
  { label: "Total Listings", value: total, icon: ClipboardList, color: "text-primary" },
  { label: "Pending", value: pending, icon: Clock, color: "text-amber-500" },
  { label: "Approved", value: approved, icon: CheckCircle, color: "text-emerald-500" },
  { label: "Rejected", value: rejected, icon: XCircle, color: "text-red-500" },
  ];

  return (
  <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
  <div className="mb-8">
  <h1 className="text-2xl font-bold text-primary">Admin Dashboard</h1>
  <p className="text-muted text-sm mt-1">Overview of marketplace activity</p>
  </div>

  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
  {stats.map((stat) => (
  <div
  key={stat.label}
  className="bg-surface border border-surface-border rounded-card p-5"
  >
  <div className="flex items-center justify-between mb-2">
  <stat.icon className={`w-5 h-5 ${stat.color}`} />
  <span className={`text-2xl font-bold ${stat.color}`}>{stat.value}</span>
  </div>
  <div className="text-sm text-muted">{stat.label}</div>
  </div>
  ))}
  </div>

  <div className="bg-surface border border-surface-border rounded-card p-6">
  <div className="flex items-center justify-between mb-4">
  <h2 className="text-lg font-semibold text-primary">Quick Actions</h2>
  </div>
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
  <Link
  href="/admin/listings"
  className="flex items-center justify-between p-4 bg-background border border-surface-border rounded-input hover:border-accent transition-colors"
  >
  <div>
  <h3 className="font-medium text-primary">Manage Listings</h3>
  <p className="text-sm text-muted">Review and approve pending listings</p>
  </div>
  <ArrowRight className="w-5 h-5 text-muted" />
  </Link>
  </div>
  </div>
  </div>
  );
}
