import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
  serverExternalPackages: ['@countrystatecity/countries'],
  outputFileTracingIncludes: {
    '/api/**/*': ['./node_modules/@countrystatecity/countries/dist/data/**/*'],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "3mb",
    },
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
