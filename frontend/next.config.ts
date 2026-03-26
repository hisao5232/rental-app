import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* 静的書き出しを有効にする */
  output: 'export',
  /* 画像の最適化を無効にする（Cloudflare Pages の静的エクスポートでは非対応のため） */
  images: {
    unoptimized: true,
  },
  reactCompiler: true,
};

export default nextConfig;
