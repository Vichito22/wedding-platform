import type { NextConfig } from "next";

// Next 16 rechaza en el optimizador toda imagen remota cuyo host resuelva a una
// IP privada. En desarrollo el backend es localhost, asi que hay que permitirlo.
// Se condiciona a la URL del backend y no a NODE_ENV para que tambien funcione
// un build de produccion local; en Railway la URL es publica y queda en false.
const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "";
const usesLocalApi = /^https?:\/\/(localhost|127\.0\.0\.1)(:|\/|$)/.test(apiUrl);

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
      // Backend local en desarrollo (las imagenes subidas se sirven desde ahi).
      { protocol: "http", hostname: "localhost", port: "8000" },
      { protocol: "http", hostname: "127.0.0.1", port: "8000" },
    ],
    dangerouslyAllowLocalIP: usesLocalApi,
  },
};

export default nextConfig;
