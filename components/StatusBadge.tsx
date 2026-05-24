"use client";

import { ListingStatus } from "@/types";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: ListingStatus;
  className?: string;
}

const statusStyles: Record<ListingStatus, string> = {
  pending: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  approved: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  rejected: "bg-red-500/10 text-red-500 border-red-500/20",
};

const statusLabels: Record<ListingStatus, string> = {
  pending: "Pending",
  approved: "Approved",
  rejected: "Rejected",
};

export default function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
  <span
  className={cn(
  "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
  statusStyles[status],
  className
  )}
  >
  {statusLabels[status]}
  </span>
  );
}
