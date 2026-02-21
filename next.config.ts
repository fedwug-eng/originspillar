import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Force verbose server logging 
    serverSourceMaps: false,
  },
  webpack: (config) => {
    config.infrastructureLogging = { debug: /Packer/ }
    return config
  }
};

export default nextConfig;
