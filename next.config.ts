import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // reactCompiler: true, // Removed - not a valid Next.js option yet

  eslint: {
    ignoreDuringBuilds: true,
  },

  typescript: {
    ignoreBuildErrors: true,
  },

  images: {
    domains: ['res.cloudinary.com'], // Add this for Cloudinary images
  },
};

export default nextConfig;