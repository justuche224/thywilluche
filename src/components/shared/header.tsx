import React from "react";
import { Navbar } from "./nav";
import Image from "next/image";
import Link from "next/link";

const socials = [
  {
    name: "Facebook",
    url: "#",
    icon: (
      <Image
        src={"/icons/facebook.svg"}
        width={16}
        height={16}
        alt="Facebook"
        className="text-[#0866FF]"
      />
    ),
  },
  {
    name: "Instagram",
    url: "#",
    icon: (
      <Image
        src={"/icons/instagram.svg"}
        width={16}
        height={16}
        alt="Instagram"
        className="text-[#FF0069]"
      />
    ),
  },
  {
    name: "Tiktok",
    url: "#",
    icon: (
      <Image
        src={"/icons/tiktok.svg"}
        width={16}
        height={16}
        alt="Tiktok"
        className="text-[#000000]"
      />
    ),
  },
  {
    name: "X",
    url: "#",
    icon: (
      <Image
        src={"/icons/x.svg"}
        width={16}
        height={16}
        alt="Tiktok"
        className="text-[#000000]"
      />
    ),
  },
];

const Header = () => {
  return (
    <header className="w-full flex flex-col justify-center items-center">
      <div className="bg-secondary w-full p-2 flex flex-col gap-2 md:flex-row justify-between items-center">
        <p className="uppercase text-foreground text-center md:text-left font-semibold">
          Never miss a new release or exclusive content
        </p>
        <div className="flex gap-2">
          {socials.map((social) => (
            <Link href={social.url} key={social.name}>
              {social.icon}
            </Link>
          ))}
        </div>
      </div>
      <div className="p-5 w-full max-w-7xl mx-auto md:p-10 bg-white/60 backdrop-blur-md sticky top-0 z-50">
        <Navbar />
      </div>
    </header>
  );
};

export default Header;
