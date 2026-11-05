import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  transpilePackages: [
    '@fintech/ui',
    '@fintech/i18n',
  ],
};

export default nextConfig;
