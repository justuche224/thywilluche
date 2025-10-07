import localFont from "next/font/local";

export const georgiaItalic = localFont({
    src: [
      {
        path: "../../public/fonts/Georgia-Italic.woff2",
        weight: "400",
        style: "italic",
      },
    ],
    variable: "--font-georgia",
  });