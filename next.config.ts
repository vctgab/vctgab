import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  experimental: {
    agentFeedback: true,
  },
  cacheComponents: true,
  partialPrefetching: true,
  typedRoutes: true,
  poweredByHeader: false,
  // Prints do caso (D-1309): AVIF e WebP, com cache longo (os nomes não mudam sem novo conteúdo).
  images: { formats: ["image/avif", "image/webp"], minimumCacheTTL: 31536000 },
  // Fontes com versão no nome (D-1010): cache imutável.
  async headers() {
    return [
      {
        source: "/fonts/:file*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
    ]
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
}

export default nextConfig
