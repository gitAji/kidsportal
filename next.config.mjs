import { withSentryConfig } from "@sentry/nextjs"; // Example import, adjust as needed

// Conditionally use 'standalone' only in production
const nextConfig = {
  reactStrictMode: true,
  // output: process.env.NODE_ENV === "production" ? "standalone" : undefined, // Only use 'standalone' in production
  images: {
    domains: ["lh3.googleusercontent.com"], // List allowed domains for optimized images
  },
  compiler: {
    emotion: true,
  },
  webpack: (config, { isServer }) => {
    // Add custom rule for handling audio files (.mp3, .wav, .ogg)
    config.module.rules.push({
      test: /\.(mp3|wav|ogg)$/,
      use: {
        loader: "file-loader",
        options: {
          name: "[path][name].[ext]",
        },
      },
    });

    // Optional: If you are using Webpack 5, you can configure HMR (Hot Module Replacement) behavior if needed.
    // Make sure HMR works in development mode (no impact on production).

    // Return the modified Webpack config
    return config;
  },
};

// Sentry configuration (only necessary if using Sentry)
const sentryWebpackPluginOptions = {
  // Your Sentry options go here
  // e.g., release: process.env.VERCEL_GITHUB_COMMIT_SHA,
};

// Export the final Next.js config with Sentry plugin (if using)
export default withSentryConfig(nextConfig, sentryWebpackPluginOptions);
