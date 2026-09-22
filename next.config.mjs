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
  webpack: (config, { isServer }) => {
    // Custom handling of audio files (mp3, wav, ogg)
    config.module.rules.push({
      test: /\.(mp3|wav|ogg)$/,
      type: "asset/resource", // Use webpack's asset modules
      generator: {
        filename: "static/media/[name][hash][ext][query]", // Custom path for media files
      },
    });
    if (isServer) {
      // Blockly is only ever loaded client-side (dynamic import inside a
      // useEffect). Its package resolves to a Node/jsdom entry point when
      // webpack's server compiler statically analyzes the module graph,
      // which fails since jsdom isn't installed — stub it out server-side.
      config.resolve.alias = {
        ...config.resolve.alias,
        'blockly/core-node.js': false,
        jsdom: false,
      };
    }
    return config;
  },
  turbopack: {},
};

export default nextConfig;
