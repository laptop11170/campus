"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useAuth, UserButton } from "@clerk/nextjs";
import { Menu, X, Plus, Search, Bookmark, LayoutDashboard, Shield, LogIn } from "lucide-react";
import { cn } from "@/lib/utils";
import Logo from "@/components/ui/Logo";

interface NavbarProps {
  isAdmin?: boolean;
}

export default function Navbar({ isAdmin = false }: NavbarProps) {
  const pathname = usePathname();
  const { isSignedIn } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const desktopNav = [
  { href: "/", label: "Home" },
  { href: "/dashboard", label: "Dashboard" },
  ];

  return (
  <nav className="sticky top-0 z-50 bg-bg-elev border-b border-border">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
  <div className="flex items-center justify-between h-[60px]">
  {/* Logo */}
  <Link href="/">
  <Logo size={28} />
  </Link>

  {/* Desktop nav */}
  <div className="hidden md:flex items-center gap-1">
  {desktopNav.map((link) => (
  <Link
  key={link.href}
  href={link.href}
  className={cn(
  "px-3 py-2 text-sm font-medium rounded-sm transition-colors",
  pathname === link.href
  ? "text-text"
  : "text-text-mute hover:text-text"
  )}
  >
  {link.label}
  </Link>
  ))}
  {isAdmin && (
  <Link
  href="/admin"
  className={cn(
  "px-3 py-2 text-sm font-medium rounded-sm transition-colors",
  pathname === "/admin" || pathname.startsWith("/admin/")
  ? "text-text"
  : "text-text-mute hover:text-text"
  )}
  >
  Admin
  </Link>
  )}
  </div>

  {/* Desktop actions */}
  <div className="hidden md:flex items-center gap-3">
  <Link
  href="/list"
  className="btn-primary text-sm py-2 px-4 rounded-md"
  >
  <Plus size={14} strokeWidth={2.5} />
  Post a listing
  </Link>
  {isSignedIn ? (
  <UserButton />
  ) : (
  <Link href="/login" className="text-sm text-text-mute hover:text-text transition-colors">
  Sign in
  </Link>
  )}
  </div>

  {/* Mobile hamburger */}
  <button
  onClick={() => setMobileOpen(!mobileOpen)}
  className="md:hidden p-2 text-text-mute hover:text-text"
  >
  {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
  </button>
  </div>
  </div>

  {/* Mobile menu */}
  {mobileOpen && (
  <div className="md:hidden border-t border-border bg-bg-elev">
  <div className="px-4 py-3 space-y-1">
  <Link
  href="/"
  onClick={() => setMobileOpen(false)}
  className={cn(
  "block px-3 py-2.5 text-sm font-medium rounded-sm",
  pathname === "/" ? "text-text bg-surface" : "text-text-mute"
  )}
  >
  Home
  </Link>
  <Link
  href="/dashboard"
  onClick={() => setMobileOpen(false)}
  className={cn(
  "block px-3 py-2.5 text-sm font-medium rounded-sm",
  pathname === "/dashboard" ? "text-text bg-surface" : "text-text-mute"
  )}
  >
  Dashboard
  </Link>
  {isAdmin && (
  <Link
  href="/admin"
  onClick={() => setMobileOpen(false)}
  className={cn(
  "block px-3 py-2.5 text-sm font-medium rounded-sm",
  pathname.startsWith("/admin") ? "text-text bg-surface" : "text-text-mute"
  )}
  >
  Admin
  </Link>
  )}
  <Link
  href="/list"
  onClick={() => setMobileOpen(false)}
  className="btn-primary text-sm py-2.5 px-3 rounded-md mt-2"
  >
  <Plus size={14} strokeWidth={2.5} />
  Post a listing
  </Link>
  {isSignedIn ? (
  <div className="px-3 py-2">
  <UserButton />
  </div>
  ) : (
  <Link
  href="/login"
  onClick={() => setMobileOpen(false)}
  className="block px-3 py-2.5 text-sm text-accent"
  >
  Sign in
  </Link>
  )}
  </div>
  </div>
  )}
  </nav>
  );
}
