import type { NextConfig } from "next";

const isPagesBuild = process.env.GITHUB_ACTIONS === "true" || process.env.GITHUB_PAGES === "true";
const repoName = "LK_tenant";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  basePath: isPagesBuild ? `/${repoName}` : "",
  assetPrefix: isPagesBuild ? `/${repoName}/` : undefined
};

export default nextConfig;
