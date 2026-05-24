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
  const { data: profile, error } = await supabase
  .from("profiles")
  .select("role")
  .eq("id", userId)
  .single();

  console.log("[Middleware] Admin check:", { userId, role: profile?.role, error: error?.message });

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
