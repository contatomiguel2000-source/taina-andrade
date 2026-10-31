import type { NextConfig } from "next";
import { basePath } from "./src/lib/base-path";

const nextConfig: NextConfig = {
  basePath,
  // Imagens 3D têm gradientes suaves: qualidade 90 evita o serrilhado da compressão padrão (75)
  images: { qualities: [75, 90] },
};

export default nextConfig;
