import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow images from Lovable CDN and common external sources
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  // Preserve the @ path alias from tsconfig
  // Next.js respects tsconfig paths automatically
};

export default nextConfig;
