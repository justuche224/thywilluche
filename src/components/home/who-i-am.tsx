import Image from "next/image";
import React from "react";
import { Oswald } from "next/font/google";
import { georgiaItalic } from "@/utils/georgia-italic";


const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
});

interface WhoIAmProps {
  title?: string;
  description?: string;
  image?: string;
}

const WhoIAm = ({
  title = "Who I Am",
  description = "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam cum officiis officia, aspernatur deleniti velit vitae facilis, provident labore debitis, quidem dignissimos eius. Animi est molestiae dolor. Odio, aperiam commodi? Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam cum officiis officia, aspernatur deleniti velit vitae facilis, provident labore debitis, quidem dignissimos eius. Animi est molestiae dolor. Odio, aperiam commodi?",
  image = "/images/IMG_20240828_162619[1].jpg",
}: WhoIAmProps) => {
  return (
    <div className="max-w-2xl lg:max-w-3xl 2xl:max-w-4xl w-full mx-auto grid md:grid-cols-2 gap-4 p-2 relative max-lg:overflow-clip">
      <Image
        src={"/doodles/doodle-1.svg"}
        alt="doodle"
        className="absolute -top-10 md:-top-20 -left-10 md:-left-20"
        width={200}
        height={200}
      />
      <Image
        src={"/doodles/doodle-2.svg"}
        alt="doodle"
        className="absolute -bottom-10 md:-bottom-20 -right-20 z-[-1]"
        width={200}
        height={200}
      />
      <Image
        src={"/doodles/doodle-3.svg"}
        alt="doodle"
        className="absolute max-md:hidden -top-10 md:-top-30 -right-10 md:-right-20 z-[-1]"
        width={200}
        height={200}
      />
      <div className="w-full h-full max-md:flex max-md:justify-center">
        <Image src={image} alt="who i am" width={400} height={400} />
      </div>
      <div className="w-full h-full space-y-4">
        <h2
          className={`text-3xl lg:text-4xl 2xl:text-5xl ${georgiaItalic.className} text-center md:text-left`}
        >
          {title}
        </h2>
        <p className={`text-lg md:text-2xl ${oswald.className} text-justify`}>
          {description}
        </p>
      </div>
    </div>
  );
};

export default WhoIAm;
