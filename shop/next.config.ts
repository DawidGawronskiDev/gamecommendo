import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [new URL("https://images.igdb.com/igdb/image/upload/**")],
  },
};

export default nextConfig;
