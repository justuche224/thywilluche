"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin, Calendar } from "lucide-react";

interface AvailabilityCalendarProps {
  serviceType: "coaching" | "consulting" | "ghostwriting";
}

const workingHours = {
  coaching: {
    days: ["Monday", "Wednesday", "Friday"],
    times: ["9:00 AM - 11:00 AM", "2:00 PM - 4:00 PM", "6:00 PM - 8:00 PM"],
  },
  consulting: {
    days: ["Tuesday", "Thursday"],
    times: ["10:00 AM - 12:00 PM", "1:00 PM - 5:00 PM"],
  },
  ghostwriting: {
    days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    times: ["9:00 AM - 5:00 PM"],
  },
};

export const AvailabilityCalendar: React.FC<AvailabilityCalendarProps> = ({
  serviceType,
}) => {
  const hours = workingHours[serviceType];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Available Times
        </CardTitle>
        <CardDescription>
          Current availability for {serviceType} services
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h4 className="font-medium mb-3 flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Working Days
          </h4>
          <div className="flex flex-wrap gap-2">
            {hours.days.map((day) => (
              <Badge key={day} variant="secondary" className="text-sm">
                {day}
              </Badge>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-medium mb-3">Available Times</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {hours.times.map((time, index) => (
              <li key={index} className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0" />
                <span>{time}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-medium mb-3 flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            Session Format
          </h4>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {serviceType === "coaching" &&
              "Online video calls or in-person sessions available"}
            {serviceType === "consulting" &&
              "Online video calls, phone calls, or in-person meetings"}
            {serviceType === "ghostwriting" &&
              "Online collaboration with regular check-ins"}
          </p>
        </div>

        <div className="pt-4 border-t">
          <p className="text-xs text-muted-foreground leading-relaxed">
            * Availability may vary. Please book in advance to secure your
            preferred time slot.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
