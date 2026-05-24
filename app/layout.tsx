import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { currentUser } from "@clerk/nextjs/server";
import { createServerClient } from "@/lib/supabase/server";
import SyncProfile from "@/components/SyncProfile";

export const metadata: Metadata = {
  title: "IIT Mandi Campus Marketplace",
  description: "Buy, sell, and find services on campus. Everything on campus, one place.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await currentUser();
  let isAdmin = false;

  if (user) {
  const supabase = createServerClient();
  const { data: profile } = await supabase
  .from("profiles")
  .select("role")
  .eq("id", user.id)
  .single();
  isAdmin = profile?.role === "admin";
  }

  return (
  <ClerkProvider
  appearance={{
  baseTheme: dark,
  variables: {
  colorPrimary: "#7c3aed",
  colorBackground: "#111111",
  colorText: "#f9f9f9",
  },
  }}
  >
  <html lang="en" className="dark">
  <body
  className={`${GeistSans.variable} ${GeistMono.variable} antialiased min-h-screen flex flex-col bg-background text-foreground`}
  >
  {user && <SyncProfile />}
  <Navbar isAdmin={isAdmin} />
  <main className="flex-1">{children}</main>
  <Footer />
  </body>
  </html>
  </ClerkProvider>
  );
}
