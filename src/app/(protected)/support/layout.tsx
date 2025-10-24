import Header from "@/components/shared/header";
import Footer from "@/components/shared/footer";
import React from "react";

const SupportLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Header />
      <div className="min-h-screen">{children}</div>
      <Footer />
    </>
  );
};
export default SupportLayout;
