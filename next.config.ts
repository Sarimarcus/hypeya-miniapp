import type { NextConfig } from "next";
import bundleAnalyzer from "@next/bundle-analyzer";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "hypeya.xyz",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.hypeya.xyz",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "secure.gravatar.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.wp.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
  // Turbopack configuration (experimental)
  turbopack: {
    // Turbopack resolve aliases
    resolveAlias: {
      // Add any alias configurations here if needed
      "@": "./src",
    },
    // Turbopack resolve extensions
    resolveExtensions: [".mdx", ".tsx", ".ts", ".jsx", ".js", ".mjs", ".json"],
  },
};

// Only apply bundle analyzer when not using Turbopack for build
// Bundle analyzer is webpack-specific and doesn't work with Turbopack
const isTurbopackBuild = process.argv.includes("--turbopack");

let config = nextConfig;

if (process.env.ANALYZE === "true" && !isTurbopackBuild) {
  const withAnalyzer = bundleAnalyzer({
    enabled: true,
    openAnalyzer: false,
    analyzerMode: "static",
  });

  config = withAnalyzer(nextConfig);
}

export default config;
