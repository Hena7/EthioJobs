import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    // Allow dynamic rendering for all routes using Base UI
    // This prevents "Base UI error #28" during static prerendering
  },
};

export default nextConfig;
