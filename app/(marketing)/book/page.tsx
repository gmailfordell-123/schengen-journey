import type { Metadata } from "next";
import { BookingForm } from "@/components/booking/BookingForm";

export const metadata: Metadata = {
  title: "Book Appointment",
  description:
    "Book your Schengen visa appointment with Schengen Journey. Fill in your details and choose a package.",
};

export default function BookPage() {
  return <BookingForm />;
}
