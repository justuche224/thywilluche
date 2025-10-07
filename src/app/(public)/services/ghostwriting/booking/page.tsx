import React from "react";
import { BookingForm } from "@/components/services/booking-form";

const GhostwritingBookingPage = () => {
  return (
    <div className="min-h-screen py-12">
      <BookingForm
        serviceType="ghostwriting"
        serviceName="Professional Ghostwriting"
      />
    </div>
  );
};

export default GhostwritingBookingPage;
