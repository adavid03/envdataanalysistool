import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Disable static exports
  output: 'standalone',
  // Enable server-side rendering
  reactStrictMode: true,
  // Add transpilePackages for plotly.js-dist-min
  transpilePackages: ['plotly.js-dist-min']
};

export default nextConfig;
