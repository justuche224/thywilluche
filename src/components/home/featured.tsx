import Image from "next/image";
import React from "react";
import { Pacifico, Oswald } from "next/font/google";

const pacifico = Pacifico({
  variable: "--font-pacifico",
  subsets: ["latin"],
  weight: "400",
});

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
});

const Featured = () => {
  return (
    <div className="w-full mt-24 bg-white/50">
      <div className="container mx-auto px-2 lg:px-8 py-16 lg:py-20">
        <h2 className={`text-5xl ${pacifico.className} text-center mb-10`}>
          Latest Addition
        </h2>
        <div className="max-w-4xl w-full mx-auto grid grid-cols-2 gap-0  relative">
          <Image
            src="/doodles/doodle-5.svg"
            alt="doodle"
            className="absolute -top-10 md:-top-20 -left-10 md:-left-50 -z-[1] "
            width={300}
            height={300}
          />
          {/* flip left to righ */}
          <Image
            src="/doodles/doodle-5.svg"
            alt="doodle"
            className="absolute -bottom-10 md:-bottom-20 -right-10 md:-right-50 -z-[1] rotate-180"
            width={300}
            height={300}
          />
          <div className="space-y-2">
            <div className="p-2">
              <p
                className={`text-md md:text-2xl font-semibold ${oswald.className}`}
              >
                SOME BATTLES ARE INVISIBLE. SOME SCARS ARE BURIED DEEP. BUT
                SURVIVAL ITSELF IS THE LOUDEST TESTIMONY.
              </p>
            </div>
            <div className="p-1 bg-primary/50 rounded-lg">
              <Image
                src="/images/IMG_20250918_104735[2].jpg"
                width={200}
                height={500}
                alt="Days i do not die"
                className="w-full aspect-[3/4] rounded-lg"
              />
            </div>
          </div>
          <div className="space-y-2">
            <div className="p-1 bg-secondary/50 rounded-lg">
              <Image
                src="/images/IMG_20250716_093443[1].jpg"
                width={200}
                height={500}
                alt="Days i do not die"
                className="w-full aspect-[3/4] rounded-lg"
              />
            </div>
            <div className="p-2">
              <p
                className={`text-sm md:text-2xl font-semibold text-justify ${oswald.className}`}
              >
                In Days I Do Not Die, Thywill Uche opens the door to his most
                vulnerable truths-sharing a raw, unfiltered journey through
                struggle, survival, and the silent weight of mental illness.
                This is not just a story of pain; it is a story of recovery,
                rebirth, and the relentless will to live when life itself feels
                unbearable.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Featured;
