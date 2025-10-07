import React from "react";
import { BookingForm } from "@/components/services/booking-form";

const CustomRequestPage = () => {
  return (
    <div className="min-h-screen py-12">
      <BookingForm serviceType="custom" serviceName="Custom Request" />
    </div>
  );
};

export default CustomRequestPage;
