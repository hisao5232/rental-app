import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Vercelでは動的レンダリングが標準で使えるため、
     Cloudflare Pages用の output: 'export' は削除またはコメントアウトします */
  // output: 'export',

  images: {
    unoptimized: true,
  },
  reactCompiler: true,
};

export default nextConfig;
