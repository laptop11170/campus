"use client";

import { useState, useRef } from "react";
import { useAuth } from "@clerk/nextjs";
import { useSupabase } from "@/lib/supabase/client";
import { X, ImageIcon } from "lucide-react";
import { Category } from "@/types";
import PaymentModal from "./PaymentModal";

const categories: { value: Category; label: string }[] = [
  { value: "product", label: "Product" },
  { value: "service", label: "Service" },
  { value: "event", label: "Event" },
];

export default function ListingForm() {
  const { isSignedIn, userId } = useAuth();
  const { getClient } = useSupabase();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<Category>("product");
  const [price, setPrice] = useState("");
  const [priceLabel, setPriceLabel] = useState("");
  const [contactInfo, setContactInfo] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [showPayment, setShowPayment] = useState(false);
  const [createdListingId, setCreatedListingId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;

  if (!file.type.startsWith("image/")) {
  setError("Please upload an image file");
  return;
  }

  if (file.size > 5 * 1024 * 1024) {
  setError("File size must be under 5MB");
  return;
  }

  setPhoto(file);
  setPhotoPreview(URL.createObjectURL(file));
  setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!isSignedIn || !userId) {
  setError("Please sign in first");
  return;
  }

  if (!title.trim() || !description.trim() || !contactInfo.trim()) {
  setError("Please fill in all required fields");
  return;
  }

  setIsSubmitting(true);
  setError("");

  try {
  const supabase = await getClient();

  let photoUrl: string | null = null;

  if (photo) {
  const fileExt = photo.name.split(".").pop();
  const fileName = `${userId}-${Date.now()}.${fileExt}`;

  const { error: uploadError } = await supabase.storage
  .from("listing-photos")
  .upload(fileName, photo);

  if (uploadError) throw uploadError;

  const { data: urlData } = supabase.storage
  .from("listing-photos")
  .getPublicUrl(fileName);

  photoUrl = urlData.publicUrl;
  }

  const { data: listing, error: insertError } = await supabase
  .from("listings")
  .insert({
  user_id: userId,
  title: title.trim(),
  description: description.trim(),
  category,
  price: price ? parseFloat(price) : null,
  price_label: priceLabel.trim() || null,
  photo_url: photoUrl,
  contact_info: contactInfo.trim(),
  status: "pending",
  })
  .select()
  .single();

  if (insertError) throw insertError;

  setCreatedListingId(listing.id);
  setShowPayment(true);
  } catch (err) {
  setError(err instanceof Error ? err.message : "Something went wrong");
  } finally {
  setIsSubmitting(false);
  }
  };

  if (showPayment && createdListingId) {
  return (
  <PaymentModal
  listingId={createdListingId}
  onClose={() => setShowPayment(false)}
  onSuccess={() => {
  window.location.href = "/dashboard";
  }}
  />
  );
  }

  return (
  <form onSubmit={handleSubmit} className="space-y-5">
  {error && (
  <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-input text-red-400 text-sm">
  {error}
  </div>
  )}

  {/* Title */}
  <div>
  <label className="block text-sm font-medium text-primary mb-1.5">
  Title <span className="text-red-400">*</span>
  </label>
  <input
  type="text"
  value={title}
  onChange={(e) => setTitle(e.target.value)}
  placeholder="e.g., TI-84 Calculator for Sale"
  className="w-full px-4 py-2.5 bg-background border border-surface-border rounded-input text-primary placeholder:text-muted-dark focus:outline-none focus:border-accent transition-colors"
  required
  />
  </div>

  {/* Category */}
  <div>
  <label className="block text-sm font-medium text-primary mb-1.5">
  Category <span className="text-red-400">*</span>
  </label>
  <div className="grid grid-cols-3 gap-2">
  {categories.map((cat) => (
  <button
  key={cat.value}
  type="button"
  onClick={() => setCategory(cat.value)}
  className={`px-4 py-2.5 rounded-input text-sm font-medium border transition-all ${
  category === cat.value
  ? "border-accent bg-accent/10 text-accent"
  : "border-surface-border text-muted hover:text-primary hover:border-muted-dark"
  }`}
  >
  {cat.label}
  </button>
  ))}
  </div>
  </div>

  {/* Description */}
  <div>
  <label className="block text-sm font-medium text-primary mb-1.5">
  Description <span className="text-red-400">*</span>
  </label>
  <textarea
  value={description}
  onChange={(e) => setDescription(e.target.value)}
  placeholder="Describe your listing in detail..."
  rows={4}
  className="w-full px-4 py-2.5 bg-background border border-surface-border rounded-input text-primary placeholder:text-muted-dark focus:outline-none focus:border-accent transition-colors resize-none"
  required
  />
  </div>

  {/* Price */}
  <div className="grid grid-cols-2 gap-4">
  <div>
  <label className="block text-sm font-medium text-primary mb-1.5">
  Price (Rs.)
  </label>
  <input
  type="number"
  value={price}
  onChange={(e) => setPrice(e.target.value)}
  placeholder="250"
  min="0"
  step="0.01"
  className="w-full px-4 py-2.5 bg-background border border-surface-border rounded-input text-primary placeholder:text-muted-dark focus:outline-none focus:border-accent transition-colors"
  />
  </div>
  <div>
  <label className="block text-sm font-medium text-primary mb-1.5">
  Price Label
  </label>
  <input
  type="text"
  value={priceLabel}
  onChange={(e) => setPriceLabel(e.target.value)}
  placeholder="Rs.250/month"
  className="w-full px-4 py-2.5 bg-background border border-surface-border rounded-input text-primary placeholder:text-muted-dark focus:outline-none focus:border-accent transition-colors"
  />
  </div>
  </div>

  {/* Photo Upload */}
  <div>
  <label className="block text-sm font-medium text-primary mb-1.5">
  Photo
  </label>
  <div
  onClick={() => fileInputRef.current?.click()}
  className="border-2 border-dashed border-surface-border rounded-input p-6 text-center cursor-pointer hover:border-muted-dark transition-colors"
  >
  {photoPreview ? (
  <div className="relative inline-block">
  <img
  src={photoPreview}
  alt="Preview"
  className="max-h-40 rounded-md"
  />
  <button
  type="button"
  onClick={(e) => {
  e.stopPropagation();
  setPhoto(null);
  setPhotoPreview(null);
  }}
  className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white"
  >
  <X className="w-3 h-3" />
  </button>
  </div>
  ) : (
  <>
  <ImageIcon className="w-8 h-8 text-muted mx-auto mb-2" />
  <p className="text-sm text-muted">Click to upload a photo</p>
  <p className="text-xs text-muted-dark mt-1">PNG, JPG up to 5MB</p>
  </>
  )}
  <input
  ref={fileInputRef}
  type="file"
  accept="image/*"
  onChange={handlePhotoChange}
  className="hidden"
  />
  </div>
  </div>

  {/* Contact Info */}
  <div>
  <label className="block text-sm font-medium text-primary mb-1.5">
  Contact Info <span className="text-red-400">*</span>
  </label>
  <input
  type="text"
  value={contactInfo}
  onChange={(e) => setContactInfo(e.target.value)}
  placeholder="Phone, WhatsApp, or email"
  className="w-full px-4 py-2.5 bg-background border border-surface-border rounded-input text-primary placeholder:text-muted-dark focus:outline-none focus:border-accent transition-colors"
  required
  />
  </div>

  {/* Submit */}
  <button
  type="submit"
  disabled={isSubmitting}
  className="w-full py-3 bg-accent text-white font-medium rounded-input hover:bg-accent-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
  >
  {isSubmitting ? "Creating..." : "Continue to Payment"}
  </button>

  <p className="text-xs text-muted text-center">
  Listing fee applies. You can review your listing before final submission.
  </p>
  </form>
  );
}
