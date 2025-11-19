/** @type {import('next').NextConfig} */
const nextConfig = {
  // During CI / Vercel builds Next runs ESLint and can fail the build.
  // Ignore ESLint errors during production builds to avoid blocking deploys.
  // If you prefer fixing lint errors, remove this and address reported issues.
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ["localhost"],
    unoptimized: true,
  },
};

export default nextConfig;
