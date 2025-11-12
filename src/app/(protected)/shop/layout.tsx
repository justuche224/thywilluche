import Header from "@/components/shared/header";
import Footer from "@/components/shared/footer";
import React from "react";

const ChampionshipLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
};
export default ChampionshipLayout;
