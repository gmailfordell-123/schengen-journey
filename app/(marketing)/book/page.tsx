import type { Metadata } from "next";
import { BookingForm } from "@/components/booking/BookingForm";
import type { OriginId } from "@/lib/flow-data";

export const metadata: Metadata = {
  title: "Book Appointment",
  description:
    "Book your Schengen visa appointment with Schengen Journey. Fill in your details and choose a package.",
};

export default async function BookPage({
  searchParams,
}: {
  searchParams: Promise<{ origin?: string }>;
}) {
  const params = await searchParams;
  const origin =
    params.origin === "uk" || params.origin === "ireland"
      ? (params.origin as OriginId)
      : null;

  return <BookingForm initialOrigin={origin} />;
}
