import React from "react";
import { BookingForm } from "@/components/services/booking-form";

const ConsultingBookingPage = () => {
  return (
    <div className="min-h-screen py-12">
      <BookingForm
        serviceType="consulting"
        serviceName="Strategic Consulting"
      />
    </div>
  );
};

export default ConsultingBookingPage;
