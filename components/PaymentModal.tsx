"use client";

import { useState, useRef } from "react";
import { useSupabase } from "@/lib/supabase/client";
import { X, Upload, CreditCard, Sparkles, Phone } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaymentModalProps {
  listingId: string;
  onClose: () => void;
  onSuccess: () => void;
}

const LISTING_FEE = Number(process.env.NEXT_PUBLIC_LISTING_FEE || 49);
const FEATURED_FEE = Number(process.env.NEXT_PUBLIC_FEATURED_FEE || 149);
const UPI_ID = process.env.NEXT_PUBLIC_UPI_ID || "yourname@upi";
const CONTACT_NUMBER = process.env.NEXT_PUBLIC_CONTACT_NUMBER || "+918999150333";

export default function PaymentModal({ listingId, onClose, onSuccess }: PaymentModalProps) {
  const { getClient } = useSupabase();

  const [isFeatured, setIsFeatured] = useState(false);
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fee = isFeatured ? FEATURED_FEE : LISTING_FEE;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  setScreenshot(file);
  setScreenshotPreview(URL.createObjectURL(file));
  setError("");
  };

  const handleSubmit = async () => {
  if (!screenshot) {
  setError("Please upload a payment screenshot");
  return;
  }

  setIsSubmitting(true);
  setError("");

  try {
  const supabase = await getClient();

  // Upload screenshot
  const fileExt = screenshot.name.split(".").pop();
  const fileName = `${listingId}-${Date.now()}.${fileExt}`;

  const { error: uploadError } = await supabase.storage
  .from("payment-screenshots")
  .upload(fileName, screenshot);

  if (uploadError) throw uploadError;

  const { data: urlData } = supabase.storage
  .from("payment-screenshots")
  .getPublicUrl(fileName);

  // Update listing with payment info
  const { error: updateError } = await supabase
  .from("listings")
  .update({
  payment_screenshot_url: urlData.publicUrl,
  payment_amount: fee,
  is_featured: isFeatured,
  })
  .eq("id", listingId);

  if (updateError) throw updateError;

  onSuccess();
  } catch (err) {
  setError(err instanceof Error ? err.message : "Something went wrong");
  } finally {
  setIsSubmitting(false);
  }
  };

  return (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
  <div className="relative w-full max-w-md bg-surface border border-surface-border rounded-card p-6 animate-fade-in">
  <button
  onClick={onClose}
  className="absolute top-4 right-4 text-muted hover:text-primary transition-colors"
  >
  <X className="w-5 h-5" />
  </button>

  <div className="text-center mb-6">
  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-accent/10 mb-3">
  <CreditCard className="w-6 h-6 text-accent" />
  </div>
  <h2 className="text-xl font-bold text-primary">Almost there!</h2>
  <p className="text-muted text-sm mt-1">
  Pay the listing fee to submit for review
  </p>
  </div>

  {/* Plan toggle */}
  <div className="grid grid-cols-2 gap-3 mb-6">
  <button
  onClick={() => setIsFeatured(false)}
  className={cn(
  "p-3 rounded-input border text-left transition-all",
  !isFeatured
  ? "border-accent bg-accent/10"
  : "border-surface-border hover:border-muted-dark"
  )}
  >
  <div className="text-sm font-medium text-primary">Standard</div>
  <div className="text-lg font-bold text-primary">Rs.{LISTING_FEE}</div>
  <div className="text-xs text-muted mt-1">Regular listing</div>
  </button>
  <button
  onClick={() => setIsFeatured(true)}
  className={cn(
  "p-3 rounded-input border text-left transition-all",
  isFeatured
  ? "border-accent bg-accent/10"
  : "border-surface-border hover:border-muted-dark"
  )}
  >
  <div className="flex items-center gap-1 text-sm font-medium text-primary">
  <Sparkles className="w-3.5 h-3.5 text-accent" />
  Featured
  </div>
  <div className="text-lg font-bold text-primary">Rs.{FEATURED_FEE}</div>
  <div className="text-xs text-muted mt-1">Top placement + badge</div>
  </button>
  </div>

  {/* UPI details */}
  <div className="bg-background rounded-input p-4 mb-6 border border-surface-border">
  <p className="text-sm text-primary font-medium mb-2">
  Send Rs.{fee} to:
  </p>
  <div className="flex items-center justify-between">
  <code className="text-accent font-mono text-sm">{UPI_ID}</code>
  <button
  onClick={() => navigator.clipboard.writeText(UPI_ID)}
  className="text-xs text-muted hover:text-primary transition-colors"
  >
  Copy
  </button>
  </div>
  <p className="text-xs text-muted mt-2">
  Open any UPI app and pay to this ID
  </p>
  </div>

  {/* Screenshot upload */}
  <div className="mb-6">
  <label className="block text-sm font-medium text-primary mb-2">
  Upload Payment Screenshot
  </label>
  <div
  onClick={() => fileInputRef.current?.click()}
  className={cn(
  "border-2 border-dashed rounded-input p-6 text-center cursor-pointer transition-colors",
  screenshot
  ? "border-accent bg-accent/5"
  : "border-surface-border hover:border-muted-dark"
  )}
  >
  {screenshotPreview ? (
  <img
  src={screenshotPreview}
  alt="Payment screenshot"
  className="mx-auto max-h-32 rounded-md"
  />
  ) : (
  <>
  <Upload className="w-8 h-8 text-muted mx-auto mb-2" />
  <p className="text-sm text-muted">
  Click to upload screenshot
  </p>
  <p className="text-xs text-muted-dark mt-1">
  PNG, JPG up to 5MB
  </p>
  </>
  )}
  <input
  ref={fileInputRef}
  type="file"
  accept="image/*"
  onChange={handleFileChange}
  className="hidden"
  />
  </div>
  </div>

  {error && (
  <p className="text-red-400 text-sm mb-4">{error}</p>
  )}

  <button
  onClick={handleSubmit}
  disabled={isSubmitting}
  className="w-full py-3 bg-accent text-white font-medium rounded-input hover:bg-accent-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
  >
  {isSubmitting ? "Submitting..." : "Submit for Review"}
  </button>

  <p className="text-xs text-muted text-center mt-4 flex items-center justify-center gap-1">
  <Phone className="w-3 h-3" />
  Questions? Contact {CONTACT_NUMBER}
  </p>
  </div>
  </div>
  );
}
