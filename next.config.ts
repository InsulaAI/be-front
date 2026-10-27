import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [{ protocol: "https", hostname: "i.ytimg.com", pathname: "/vi/**" }],
  },
  async redirects() {
    return [
      // A raiz abre no idioma do navegador: português vai para /pt, qualquer outro para /en.
      {
        source: "/",
        has: [{ type: "header", key: "accept-language", value: "(?!pt).*" }],
        destination: "/en",
        permanent: false,
      },
      { source: "/", destination: "/pt", permanent: false },
    ];
  },
};

export default nextConfig;
