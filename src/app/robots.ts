import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://thywilluche.com";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin/",
          "/api/",
          "/auth/",
          "/shop/checkout/",
          "/shop/orders/",
          "/community/profile/",
          "/community/settings/",
          "/support/",
          "/championship/registration/",
          "/championship/submit/",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
