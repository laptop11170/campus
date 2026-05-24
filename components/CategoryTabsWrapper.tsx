"use client";

import { Category } from "@/types";
import CategoryTabs from "./CategoryTabs";

interface CategoryTabsWrapperProps {
  activeCategory: Category | "all";
}

export default function CategoryTabsWrapper({ activeCategory }: CategoryTabsWrapperProps) {
  return (
  <CategoryTabs
  activeCategory={activeCategory}
  onChange={(cat) => {
  const url = new URL(window.location.href);
  if (cat === "all") {
  url.searchParams.delete("category");
  } else {
  url.searchParams.set("category", cat);
  }
  window.location.href = url.toString();
  }}
  />
  );
}
