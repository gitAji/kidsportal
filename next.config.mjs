// next.config.mjs
import { withSentryConfig } from "@sentry/nextjs"; // Example import, adjust as needed

const nextConfig = {
  reactStrictMode: true, // Example configuration
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(mp3|wav|ogg)$/,
      use: {
        loader: "file-loader",
        options: {
          name: "[path][name].[ext]",
        },
      },
    });

    return config;
  },
};

// If you're using Sentry or similar, use the appropriate options here
const sentryWebpackPluginOptions = {
  // Your Sentry options here
};

// Export the configuration
export default withSentryConfig(nextConfig, sentryWebpackPluginOptions);
