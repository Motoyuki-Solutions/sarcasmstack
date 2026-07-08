/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Cloudflare (OpenNext / next-on-pages) requires the standalone build output.
  // When deploying with @opennextjs/cloudflare, this is handled by the adapter;
  // for @cloudflare/next-on-pages the build command reads .vercel/output/static.
  experimental: {
    // Keep server-side logic edge-compatible; see API routes for `runtime` export.
  },
  images: {
    // Printify mockup URLs + local SVG designs. remotePatterns lets next/image
    // optimize remote Printify mockups when image optimization is available.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.printify.com",
      },
      {
        protocol: "https",
        hostname: "**.cdn.printify.com",
      },
    ],
  },
};

export default nextConfig;
