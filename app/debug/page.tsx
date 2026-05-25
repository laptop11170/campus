"use client";

import { useAuth, useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

export default function DebugPage() {
  const { isSignedIn, userId } = useAuth();
  const { user } = useUser();
  const [profile, setProfile] = useState<any>(null);
  const [allProfiles, setAllProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  if (!isSignedIn) {
  setLoading(false);
  return;
  }

  const supabase = createClient();

  // Fetch current user's profile
  supabase
  .from("profiles")
  .select("*")
  .eq("id", userId)
  .single()
  .then(({ data }) => {
  setProfile(data);
  });

  // Fetch all profiles with matching email
  if (user?.primaryEmailAddress?.emailAddress) {
  supabase
  .from("profiles")
  .select("*")
  .eq("email", user.primaryEmailAddress.emailAddress)
  .then(({ data }) => {
  setAllProfiles(data || []);
  setLoading(false);
  });
  } else {
  setLoading(false);
  }
  }, [isSignedIn, userId, user]);

  const makeAdmin = async () => {
  if (!userId) return;
  const supabase = createClient();
  const { error } = await supabase
  .from("profiles")
  .update({ role: "admin" })
  .eq("id", userId);

  if (error) {
  alert("Error: " + error.message);
  } else {
  alert("Role updated to admin! Refresh the page to verify.");
  window.location.reload();
  }
  };

  if (!isSignedIn) {
  return (
  <div className="max-w-2xl mx-auto px-4 py-20 text-center">
  <h1 className="text-2xl font-bold text-primary mb-4">Not signed in</h1>
  <Link href="/login" className="text-accent hover:underline">
  Sign in
  </Link>
  </div>
  );
  }

  return (
  <div className="max-w-3xl mx-auto px-4 py-8">
  <h1 className="text-2xl font-bold text-primary mb-6">Debug: User Info</h1>

  <div className="space-y-6">
  {/* Clerk Info */}
  <div className="bg-surface border border-surface-border rounded-card p-4">
  <h2 className="font-semibold text-primary mb-2">Clerk User</h2>
  <div className="space-y-1 text-sm">
  <p><span className="text-muted">User ID:</span> <code className="text-accent font-mono">{userId}</code></p>
  <p><span className="text-muted">Email:</span> {user?.primaryEmailAddress?.emailAddress}</p>
  <p><span className="text-muted">Name:</span> {user?.fullName}</p>
  </div>
  </div>

  {/* Current Profile */}
  <div className="bg-surface border border-surface-border rounded-card p-4">
  <h2 className="font-semibold text-primary mb-2">Your Profile (by Clerk ID)</h2>
  {loading ? (
  <p className="text-muted text-sm">Loading...</p>
  ) : profile ? (
  <div className="space-y-1 text-sm">
  <p><span className="text-muted">ID:</span> <code className="font-mono">{profile.id}</code></p>
  <p><span className="text-muted">Email:</span> {profile.email}</p>
  <p><span className="text-muted">Role:</span> <span className={profile.role === "admin" ? "text-emerald-400 font-bold" : "text-amber-400"}>{profile.role}</span></p>
  <p><span className="text-muted">Name:</span> {profile.full_name}</p>
  </div>
  ) : (
  <p className="text-red-400 text-sm">No profile found with your Clerk user ID!</p>
  )}
  </div>

  {/* All matching profiles */}
  <div className="bg-surface border border-surface-border rounded-card p-4">
  <h2 className="font-semibold text-primary mb-2">All Profiles with Your Email</h2>
  {allProfiles.length > 0 ? (
  <div className="space-y-3">
  {allProfiles.map((p) => (
  <div key={p.id} className="text-sm border-l-2 border-surface-border pl-3">
  <p><span className="text-muted">ID:</span> <code className="font-mono text-xs">{p.id}</code></p>
  <p><span className="text-muted">Role:</span> <span className={p.role === "admin" ? "text-emerald-400 font-bold" : "text-amber-400"}>{p.role}</span></p>
  <p><span className="text-muted">Name:</span> {p.full_name}</p>
  </div>
  ))}
  </div>
  ) : (
  <p className="text-muted text-sm">No profiles found with your email.</p>
  )}
  </div>

  {/* Fix button */}
  <div className="bg-surface border border-surface-border rounded-card p-4">
  <h2 className="font-semibold text-primary mb-2">Fix</h2>
  <p className="text-sm text-muted mb-3">
  If your current profile shows <code>role = "user"</code>, click this button to set it to <code>"admin"</code>.
  </p>
  <button
  onClick={makeAdmin}
  className="px-4 py-2 bg-accent text-white text-sm font-medium rounded-input hover:bg-accent-hover transition-colors"
  >
  Set My Role to Admin
  </button>
  </div>
  </div>
  </div>
  );
}
