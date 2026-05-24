import ListingForm from "@/components/ListingForm";
import { Phone } from "lucide-react";

const CONTACT_NUMBER = process.env.NEXT_PUBLIC_CONTACT_NUMBER || "+918999150333";

export default function ListPage() {
  return (
  <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
  <div className="mb-8">
  <h1 className="text-2xl font-bold text-primary">List Something</h1>
  <p className="text-muted mt-1">
  Sell a product, offer a service, or promote an event
  </p>
  </div>

  <div className="bg-surface border border-surface-border rounded-card p-6 sm:p-8">
  <ListingForm />
  </div>

  <p className="text-xs text-muted text-center mt-6 flex items-center justify-center gap-1">
  <Phone className="w-3 h-3" />
  Need help? Contact {CONTACT_NUMBER}
  </p>
  </div>
  );
}
