"use client";

import Logo from "@/components/ui/Logo";
import Mountains from "@/components/ui/Mountains";

export default function Footer() {
  return (
  <footer className="border-t border-border bg-bg">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
  <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6">
  <div>
  <Logo size={28} />
  <p className="mt-4 text-[13px] text-text-mute max-w-sm leading-relaxed">
  A student project for IIT Mandi — Entrepreneurship & Venture Building Programme.
  </p>
  </div>
  <div className="flex gap-6 font-mono text-xs text-text-mute tracking-wider">
  <span>iitmandicampus.live</span>
  </div>
  </div>
  </div>
  </footer>
  );
}
