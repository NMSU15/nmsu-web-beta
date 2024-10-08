/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['127.0.0.1', 'localhost'],
        unoptimized: false,
        remotePatterns: [
          {
            protocol: "https",
            hostname: "**",
          },
        ],
      },
};

export default nextConfig;
