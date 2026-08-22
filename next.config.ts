import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // The FBR tax receipt image URL is configured by the admin in platform settings.
    remotePatterns: [{ protocol: 'https', hostname: '**' }],
  },
};

export default nextConfig;
