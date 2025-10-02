"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "./nav";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="w-full flex flex-col justify-center items-center">
      <div
        className={`px-5 w-full md:px-10 md:py-3 transition-all duration-300 ${
          isScrolled
            ? "bg-white/50 backdrop-blur-md shadow-md left-0 right-0 w-full fixed top-0 z-[999] "
            : "bg-transparent"
        }`}
      >
        <Navbar />
      </div>
    </header>
  );
};

export default Header;
