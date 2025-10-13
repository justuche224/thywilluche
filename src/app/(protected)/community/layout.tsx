import { Metadata } from "next";
import React from "react";
import Header from "@/components/community/shared/header";

export const metadata: Metadata = {
  title: "Community | Thywill Uche",
  description: "Community",
};

const communityLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <Header />
      {children}
    </div>
  );
};

export default communityLayout;
