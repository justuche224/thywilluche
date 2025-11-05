"use client";

import { User } from "better-auth";
import React from "react";
import { motion } from "framer-motion";
import { Oswald } from "next/font/google";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { CheckCircle2, Clock, XCircle } from "lucide-react";

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
});

interface ExtendedUser extends User {
  username: string;
}

interface RegistrationData {
  id: string;
  userId: string;
  phoneNumber: string;
  country: string;
  state: string;
  city: string;
  address: string;
  receiptUrl: string | null;
  status: "pending" | "approved" | "rejected";
  createdAt: Date | string;
  updatedAt: Date | string;
}

interface RegistrationInfoProps {
  user: ExtendedUser;
  registration: RegistrationData;
  status: "pending" | "approved" | "rejected";
}

const RegistrationInfo = ({
  user,
  registration,
  status,
}: RegistrationInfoProps) => {
  const statusConfig = {
    pending: {
      icon: Clock,
      label: "Pending",
      color: "bg-yellow-100 text-yellow-800 border-yellow-200",
      message: "Your registration is being reviewed. Please wait for approval.",
      info: "You will be notified via email once your registration is approved or rejected.",
    },
    approved: {
      icon: CheckCircle2,
      label: "Approved",
      color: "bg-green-100 text-green-800 border-green-200",
      message: "Congratulations! Your registration has been approved.",
      info: "You can now start participating in the championship.",
    },
    rejected: {
      icon: XCircle,
      label: "Rejected",
      color: "bg-red-100 text-red-800 border-red-200",
      message:
        "Your registration was not approved. Please contact support for more information.",
      info: "Please contact support for more information.",
    },
  };

  const currentStatus = statusConfig[status];
  const StatusIcon = currentStatus.icon;

  return (
    <div className="min-h-screen space-y-10 my-10">
      <section className="relative py-0 lg:py-0 mt-10">
        <div className="max-w-4xl mx-auto px-5 md:px-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h1
              className={`text-4xl lg:text-6xl font-bold text-[#800000] mb-6 ${oswald.className}`}
            >
              THYWILL&apos;S CHAMPION&apos;S LEAGUE
            </h1>
            <p className="text-xl lg:text-2xl text-gray-600 font-light mb-8">
              Registration Status
            </p>
          </motion.div>
        </div>
      </section>

      <section className="relative py-0 lg:py-0 mt-10">
        <div className="max-w-4xl mx-auto px-5 md:px-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <Card className="bg-white/70 border-gray-200">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <h2
                    className={`text-3xl lg:text-4xl font-bold text-[#800000] ${oswald.className}`}
                  >
                    Registration Status
                  </h2>
                  <Badge
                    className={`${currentStatus.color} border flex items-center gap-2 px-4 py-2`}
                  >
                    <StatusIcon className="w-4 h-4" />
                    {currentStatus.label}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div
                  className={`p-4 rounded-lg border ${currentStatus.color} bg-opacity-50`}
                >
                  <p className="text-sm font-medium">{currentStatus.message}</p>
                  <p className="text-sm font-medium">{currentStatus.info}</p>
                </div>

                <div>
                  <h3
                    className={`text-xl font-bold text-[#800000] mb-4 ${oswald.className}`}
                  >
                    User Information
                  </h3>
                  <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                      {user.image ? (
                        <Image
                          src={user.image}
                          alt={user.name ?? "User"}
                          width={96}
                          height={96}
                          className="rounded-full object-cover w-24 h-24"
                        />
                      ) : (
                        <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-2xl text-gray-500">
                          {(user.name ?? user.email ?? "U")
                            .slice(0, 1)
                            .toUpperCase()}
                        </div>
                      )}
                      <div className="flex-1 w-full">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-gray-500">Name</p>
                            <p className="text-lg font-semibold text-gray-900">
                              {user.name ?? "—"}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Email</p>
                            <p className="text-lg font-semibold text-gray-900">
                              {user.email ?? "—"}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Username</p>
                            <p className="text-lg font-semibold text-gray-900">
                              {user.username ?? "—"}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">
                              Phone Number
                            </p>
                            <p className="text-lg font-semibold text-gray-900">
                              {registration.phoneNumber}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3
                    className={`text-xl font-bold text-[#800000] mb-4 ${oswald.className}`}
                  >
                    Registration Details
                  </h3>
                  <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Country</p>
                        <p className="text-lg font-semibold text-gray-900">
                          {registration.country}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">State</p>
                        <p className="text-lg font-semibold text-gray-900">
                          {registration.state}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">City</p>
                        <p className="text-lg font-semibold text-gray-900">
                          {registration.city}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Address</p>
                        <p className="text-lg font-semibold text-gray-900">
                          {registration.address}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">
                          Registration Date
                        </p>
                        <p className="text-lg font-semibold text-gray-900">
                          {new Date(
                            registration.createdAt
                          ).toLocaleDateString()}
                        </p>
                      </div>
                      {registration.receiptUrl && (
                        <div>
                          <p className="text-sm text-gray-500">Receipt</p>
                          <a
                            href={registration.receiptUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-lg font-semibold text-blue-600 hover:underline"
                          >
                            View Receipt
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default RegistrationInfo;
