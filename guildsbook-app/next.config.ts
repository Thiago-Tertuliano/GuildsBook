import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "books.google.com",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "books.google.com",
        pathname: "/**",
      },
    ],
  },
  // Otimizações para build mais rápido
  experimental: {
    // Otimiza imports de pacotes grandes
    optimizePackageImports: ["lucide-react"],
  },
  // Compressão
  compress: true,
  // Swc minify é mais rápido (já é padrão no Next.js 13+)
  swcMinify: true,
};

export default nextConfig;
