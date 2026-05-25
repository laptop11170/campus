import { NextResponse } from "next/server";
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { createServerClient } from "./lib/supabase/server";

const isAdminRoute = createRouteMatcher(["/admin(.*)"]);
const isAuthRoute = createRouteMatcher(["/dashboard", "/list"]);

export default clerkMiddleware(async (auth, req) => {
  if (isAdminRoute(req)) {
  const { userId } = await auth();
  if (!userId) {
  console.log("[Middleware] Admin route — no userId, redirecting to /login");
  return NextResponse.redirect(new URL("/login", req.url));
  }

  const supabase = createServerClient();

  // Try by user ID first
  let { data: profile, error } = await supabase
  .from("profiles")
  .select("role")
  .eq("id", userId)
  .single();

  // If not found, try by email (handles clerk ID mismatch)
  if (!profile) {
  const { sessionClaims } = await auth();
  const email = sessionClaims?.email as string | undefined;
  if (email) {
  const { data: byEmail, error: emailErr } = await supabase
  .from("profiles")
  .select("role")
  .eq("email", email)
  .single();
  if (byEmail) {
  profile = byEmail;
  console.log("[Middleware] Admin check (by email):", { email, role: profile.role });
  } else if (emailErr) {
  console.log("[Middleware] Admin check email error:", emailErr.message);
  }
  }
  } else {
  console.log("[Middleware] Admin check (by userId):", { userId, role: profile.role });
  }

  if (error && error.code !== "PGRST116") {
  console.log("[Middleware] Admin check error:", error.message);
  }

  if (!profile || profile.role !== "admin") {
  console.log("[Middleware] Not admin — redirecting to /");
  return NextResponse.redirect(new URL("/", req.url));
  }

  console.log("[Middleware] Admin verified — allowing access");
  }

  if (isAuthRoute(req)) {
  const { userId } = await auth();
  if (!userId) {
  return NextResponse.redirect(new URL("/login", req.url));
  }
  }
});

export const config = {
  matcher: [
  "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
