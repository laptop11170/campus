import { NextResponse } from "next/server";
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher(["/dashboard", "/list"]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
  const { userId } = await auth();
  if (!userId) {
  return NextResponse.redirect(new URL("/login", req.url));
  }
  }
  // Admin checks moved to page level — edge runtime can't reliably use Supabase
});

export const config = {
  matcher: [
  "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
