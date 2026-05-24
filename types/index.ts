export type Category = "product" | "service" | "event";

export type ListingStatus = "pending" | "approved" | "rejected";

export interface Profile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  email: string | null;
  role: "user" | "admin";
  created_at: string;
}

export interface Listing {
  id: string;
  user_id: string;
  title: string;
  description: string;
  category: Category;
  price: number | null;
  price_label: string | null;
  photo_url: string | null;
  contact_info: string;
  status: ListingStatus;
  is_featured: boolean;
  payment_screenshot_url: string | null;
  payment_amount: number | null;
  rejection_reason: string | null;
  created_at: string;
  updated_at: string;
  profiles?: Profile;
}
