"use client";

import { ListingStatus } from "@/types";

interface StatusBadgeProps {
  status: ListingStatus;
  className?: string;
}

export default function StatusBadge({ status, className }: StatusBadgeProps) {
  const styles: Record<ListingStatus, { chip: string; dot: string }> = {
  pending: {
  chip: "bg-amber-soft text-amber",
  dot: "bg-amber",
  },
  approved: {
  chip: "bg-accent-soft text-accent",
  dot: "bg-accent",
  },
  rejected: {
  chip: "bg-danger-soft text-danger",
  dot: "bg-danger",
  },
  };

  const labels: Record<ListingStatus, string> = {
  pending: "Pending",
  approved: "Live",
  rejected: "Rejected",
  };

  const s = styles[status];

  return (
  <span
  className={`inline-flex items-center gap-1.5 font-mono text-[11px] tracking-wider uppercase px-2.5 py-1 rounded-sm border border-transparent ${s.chip} ${className || ""}`}
  >
  <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
  {labels[status]}
  </span>
  );
}
