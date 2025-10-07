import React from "react";
import { BookingForm } from "@/components/services/booking-form";

const CoachingBookingPage = () => {
  return (
    <div className="min-h-screen py-12">
      <BookingForm serviceType="coaching" serviceName="Personal Coaching" />
    </div>
  );
};

export default CoachingBookingPage;
