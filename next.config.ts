import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Export statique : sortie dans out/, déployable tel quel par deploy.sh sur Nginx.
  output: "export",
  trailingSlash: true,
  images: {
    // next/image ne peut pas optimiser à la volée en export statique :
    // les visuels sont pré-optimisés par scripts/optimize-assets.mjs.
    unoptimized: true,
  },
};

export default nextConfig;
