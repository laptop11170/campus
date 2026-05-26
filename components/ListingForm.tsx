"use client";

import { useState, useRef } from "react";
import { useAuth } from "@clerk/nextjs";
import { createClient } from "@/lib/supabase/client";
import { X, ImageIcon, Plus } from "lucide-react";
import { Category } from "@/types";
import PaymentModal from "./PaymentModal";

const categories: { value: Category; label: string; glyph: string; desc: string }[] = [
  { value: "product", label: "Marketplace", glyph: "🛒", desc: "A physical item" },
  { value: "service", label: "Services", glyph: "🔧", desc: "A skill you offer" },
  { value: "event", label: "Events", glyph: "🎪", desc: "Fest, trek, talk, meetup" },
];

export default function ListingForm() {
  const { isSignedIn, userId } = useAuth();

  const [step, setStep] = useState(1);
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
  const supabase = createClient();

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
  <form onSubmit={handleSubmit} className="space-y-6">
  {error && (
  <div className="p-3.5 bg-danger-soft border border-danger/20 rounded-lg text-danger text-sm">
  {error}
  </div>
  )}

  {/* Step 1: Category */}
  <div>
  <label className="label-ui">Category <span className="text-danger">*</span></label>
  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
  {categories.map((cat) => (
  <button
  key={cat.value}
  type="button"
  onClick={() => setCategory(cat.value)}
  className={`card-ui p-4 text-left cursor-pointer transition-all ${
  category === cat.value
  ? "border-accent shadow-[0_0_0_4px_var(--accent-soft)]"
  : "hover:border-border-strong"
  }`}
  >
  <div className="text-2xl mb-2">{cat.glyph}</div>
  <div className="font-semibold text-[15px]">{cat.label}</div>
  <div className="text-text-mute text-xs mt-0.5">{cat.desc}</div>
  </button>
  ))}
  </div>
  </div>

  {/* Step 2: Details */}
  <div>
  <label className="label-ui">Title <span className="text-danger">*</span></label>
  <input
  type="text"
  value={title}
  onChange={(e) => setTitle(e.target.value)}
  placeholder="e.g., ThinkPad T14 — barely used, 6mo old"
  className="input-ui"
  required
  />
  </div>

  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
  <div>
  <label className="label-ui">Price (₹)</label>
  <input
  type="number"
  value={price}
  onChange={(e) => setPrice(e.target.value)}
  placeholder="0"
  min="0"
  step="0.01"
  className="input-ui"
  />
  </div>
  <div>
  <label className="label-ui">Price Label</label>
  <input
  type="text"
  value={priceLabel}
  onChange={(e) => setPriceLabel(e.target.value)}
  placeholder="per month, negotiable..."
  className="input-ui"
  />
  </div>
  </div>

  <div>
  <label className="label-ui">Description <span className="text-danger">*</span></label>
  <textarea
  value={description}
  onChange={(e) => setDescription(e.target.value)}
  placeholder="Condition, why selling, where to pick up, etc."
  rows={4}
  className="textarea-ui"
  required
  />
  </div>

  {/* Photo Upload */}
  <div>
  <label className="label-ui">
  Photo <span className="text-text-mute font-normal text-xs ml-1">· up to 4 images, first is primary</span>
  </label>
  <div
  onClick={() => fileInputRef.current?.click()}
  className="border border-dashed border-border-strong rounded-lg p-6 text-center cursor-pointer hover:border-accent-line hover:bg-accent-soft transition-colors"
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
  className="absolute -top-2 -right-2 w-6 h-6 bg-danger rounded-full flex items-center justify-center text-white"
  >
  <X className="w-3 h-3" />
  </button>
  </div>
  ) : (
  <>
  <ImageIcon className="w-6 h-6 text-text-mute mx-auto mb-2" />
  <p className="text-sm text-text-2">Drop or click to upload</p>
  <p className="text-xs text-text-mute mt-1">PNG, JPG up to 5MB</p>
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
  <label className="label-ui">Contact Info <span className="text-danger">*</span></label>
  <input
  type="text"
  value={contactInfo}
  onChange={(e) => setContactInfo(e.target.value)}
  placeholder="WhatsApp number or email"
  className="input-ui"
  required
  />
  </div>

  {/* Submit */}
  <button
  type="submit"
  disabled={isSubmitting}
  className="w-full btn-primary py-3 justify-center text-base"
  >
  {isSubmitting ? (
  "Creating..."
  ) : (
  <>
  <Plus size={16} strokeWidth={2.5} /> Submit for review
  </>
  )}
  </button>

  <p className="text-xs text-text-mute text-center">
  Each listing is reviewed by an admin before going live. Listing fee: ₹149.
  </p>
  </form>
  );
}
