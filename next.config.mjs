/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      }
    ]
  },
  webpack: (config) => {
    // Custom handling of audio files (mp3, wav, ogg)
    config.module.rules.push({
      test: /\.(mp3|wav|ogg)$/,
      type: "asset/resource", // Use webpack's asset modules
      generator: {
        filename: "static/media/[name][hash][ext][query]", // Custom path for media files
      },
    });
    return config;
  },
  turbopack: {},
};

export default nextConfig;
