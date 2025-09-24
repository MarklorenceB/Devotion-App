import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    dangerouslyAllowSVG: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com", // Google avatars
      },
      {
        protocol: "https",
        hostname: "d1aeh7hxqn8xf9.cloudfront.net", // your CloudFront CDN
      },
      {
        protocol: "https",
        hostname: "**", // wildcard (if you really want to allow all)
      },
    ],
  },
};

export default nextConfig;
