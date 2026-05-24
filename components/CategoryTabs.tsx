"use client";

import { Category } from "@/types";
import { cn } from "@/lib/utils";

interface CategoryTabsProps {
  activeCategory: Category | "all";
  onChange: (category: Category | "all") => void;
}

const tabs: { label: string; value: Category | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Products", value: "product" },
  { label: "Services", value: "service" },
  { label: "Events", value: "event" },
];

export default function CategoryTabs({ activeCategory, onChange }: CategoryTabsProps) {
  return (
  <div className="flex items-center gap-1 p-1 bg-surface border border-surface-border rounded-input">
  {tabs.map((tab) => (
  <button
  key={tab.value}
  onClick={() => onChange(tab.value)}
  className={cn(
  "px-4 py-2 text-sm font-medium rounded-md transition-all duration-200",
  activeCategory === tab.value
  ? "bg-accent text-white shadow-sm"
  : "text-muted hover:text-primary hover:bg-white/5"
  )}
  >
  {tab.label}
  </button>
  ))}
  </div>
  );
}
