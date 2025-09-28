import Header from "@/components/shared/header";
import Footer from "@/components/shared/footer";
import React from "react";

const PublicLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
};
export default PublicLayout;
