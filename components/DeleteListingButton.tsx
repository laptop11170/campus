"use client";

import { createClient } from "@/lib/supabase/client";
import { Trash2 } from "lucide-react";
import { useState } from "react";

export default function DeleteListingButton({ id }: { id: string }) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
  if (!confirm("Are you sure you want to delete this listing?")) return;

  setIsDeleting(true);
  try {
  const supabase = createClient();
  const { error } = await supabase.from("listings").delete().eq("id", id);
  if (error) throw error;
  window.location.reload();
  } catch {
  alert("Failed to delete listing");
  } finally {
  setIsDeleting(false);
  }
  };

  return (
  <button
  onClick={handleDelete}
  disabled={isDeleting}
  className="p-2 text-red-500 hover:text-red-400 transition-colors disabled:opacity-50"
  >
  <Trash2 className="w-4 h-4" />
  </button>
  );
}
