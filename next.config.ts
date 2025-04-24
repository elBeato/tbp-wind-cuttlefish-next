/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    turbo: {
      enabled: false, // Force disable Turbopack
    },
  },
};

export default nextConfig;
