"use client";

import { Store, Heart } from "lucide-react";

export default function Footer() {
  return (
  <footer className="border-t border-surface-border bg-background">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
  <div className="flex items-center gap-2">
  <Store className="w-5 h-5 text-accent" />
  <span className="font-semibold text-primary">Campus Marketplace</span>
  </div>

  <p className="text-sm text-muted">
  Built for students, by students
  </p>

  <p className="text-sm text-muted flex items-center gap-1">
  Made with <Heart className="w-3 h-3 text-red-500" /> at IIT Mandi
  </p>
  </div>
  </div>
  </footer>
  );
}
