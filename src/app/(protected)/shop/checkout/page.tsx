import { serverAuth } from "@/lib/server-auth";
import { redirect } from "next/navigation";
import { Metadata } from "next";
import CheckoutPage from "@/components/shop/checkout";

export const metadata: Metadata = {
  title: "Shop Checkout | Thywill Uche",
  description: "Checkout your order",
  openGraph: {
    title: "Shop Checkout | Thywill Uche",
    description: "Checkout your order",
    images: "/images/IMG_20250907_010336[1].jpg",
  },
  twitter: {
    card: "summary_large_image",
    title: "Shop Checkout | Thywill Uche",
    description: "Checkout your order",
    images: "/images/IMG_20250907_010336[1].jpg",
  },
};

const page = async () => {
  const user = await serverAuth();
  if (!user) {
    redirect("/auth/login?callbackUrl=/shop/checkout");
  }
  return <CheckoutPage />;
};

export default page;
