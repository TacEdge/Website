/**
 * Static export, no backend. NEXT_PUBLIC_BASE_PATH is set in CI when
 * deploying to GitHub Pages (served under /Website); empty for local dev
 * and for any host that serves from the domain root.
 */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  trailingSlash: true,
  basePath,
  images: { unoptimized: true },
};

export default nextConfig;
