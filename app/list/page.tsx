import ListingForm from "@/components/ListingForm";

export default function ListPage() {
  return (
  <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
  <div className="mb-8">
  <div className="eyebrow-ui">POST A LISTING</div>
  <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight mt-1">List Something</h1>
  <p className="text-text-mute mt-2">
  Sell a product, offer a service, or promote an event on campus
  </p>
  </div>

  <div className="card-ui p-6 sm:p-8">
  <ListingForm />
  </div>
  </div>
  );
}
