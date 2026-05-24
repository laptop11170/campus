import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { createServerClient } from "./lib/supabase/server";

const isAdminRoute = createRouteMatcher(["/admin(.*)"]);
const isAuthRoute = createRouteMatcher(["/dashboard", "/list"]);

export default clerkMiddleware(async (auth, req) => {
  if (isAdminRoute(req)) {
  const { userId } = await auth();
  if (!userId) {
  return Response.redirect(new URL("/login", req.url));
  }

  const supabase = createServerClient();
  const { data: profile } = await supabase
  .from("profiles")
  .select("role")
  .eq("id", userId)
  .single();

  if (!profile || profile.role !== "admin") {
  return Response.redirect(new URL("/", req.url));
  }
  }

  if (isAuthRoute(req)) {
  const { userId } = await auth();
  if (!userId) {
  return Response.redirect(new URL("/login", req.url));
  }
  }
});

export const config = {
  matcher: [
  "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
