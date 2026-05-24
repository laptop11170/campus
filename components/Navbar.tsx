"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { Menu, X, Store, LayoutDashboard, Shield, LogIn } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavbarProps {
  isAdmin?: boolean;
}

export default function Navbar({ isAdmin = false }: NavbarProps) {
  const pathname = usePathname();
  const { isSignedIn } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
  { href: "/", label: "Marketplace", icon: Store },
  ...(isSignedIn
  ? [
  { href: "/list", label: "List Something", icon: null as never },
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  ]
  : []),
  ...(isAdmin
  ? [{ href: "/admin", label: "Admin", icon: Shield }]
  : []),
  ];

  return (
  <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-surface-border">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
  <div className="flex items-center justify-between h-16">
  {/* Logo */}
  <Link href="/" className="flex items-center gap-2">
  <Store className="w-6 h-6 text-accent" />
  <span className="font-bold text-primary text-lg hidden sm:block">
  Campus Marketplace
  </span>
  </Link>

  {/* Desktop links */}
  <div className="hidden md:flex items-center gap-1">
  {navLinks.map((link) => (
  <Link
  key={link.href}
  href={link.href}
  className={cn(
  "flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors",
  pathname === link.href
  ? "text-accent bg-accent/10"
  : "text-muted hover:text-primary hover:bg-white/5"
  )}
  >
  {link.icon && <link.icon className="w-4 h-4" />}
  {link.label}
  </Link>
  ))}
  </div>

  {/* Auth */}
  <div className="hidden md:flex items-center gap-2">
  {isSignedIn ? (
  <Link
  href="/user"
  className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-accent text-white rounded-input hover:bg-accent-hover transition-colors"
  >
  Account
  </Link>
  ) : (
  <Link
  href="/login"
  className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-accent text-white rounded-input hover:bg-accent-hover transition-colors"
  >
  <LogIn className="w-4 h-4" />
  Sign In
  </Link>
  )}
  </div>

  {/* Mobile menu button */}
  <button
  onClick={() => setMobileOpen(!mobileOpen)}
  className="md:hidden p-2 text-muted hover:text-primary"
  >
  {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
  </button>
  </div>
  </div>

  {/* Mobile menu */}
  {mobileOpen && (
  <div className="md:hidden border-t border-surface-border bg-background">
  <div className="px-4 py-3 space-y-1">
  {navLinks.map((link) => (
  <Link
  key={link.href}
  href={link.href}
  onClick={() => setMobileOpen(false)}
  className={cn(
  "flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors",
  pathname === link.href
  ? "text-accent bg-accent/10"
  : "text-muted hover:text-primary hover:bg-white/5"
  )}
  >
  {link.icon && <link.icon className="w-4 h-4" />}
  {link.label}
  </Link>
  ))}
  {isSignedIn ? (
  <Link
  href="/user"
  onClick={() => setMobileOpen(false)}
  className="flex w-full items-center gap-2 px-3 py-2 text-sm font-medium text-accent"
  >
  Account
  </Link>
  ) : (
  <Link
  href="/login"
  onClick={() => setMobileOpen(false)}
  className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-accent"
  >
  <LogIn className="w-4 h-4" />
  Sign In
  </Link>
  )}
  </div>
  </div>
  )}
  </nav>
  );
}
