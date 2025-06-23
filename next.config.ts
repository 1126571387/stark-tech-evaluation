
/** @type {import('next').NextConfig} */
const nextConfig = {
   // 不需要 experimental.appDir（App Router 已默认启用）
  output: 'standalone', // 推荐使用（优化生产部署）
  // 启用严格模式
  reactStrictMode: true,
  // 配置环境变量
  env: {
    NEXT_PUBLIC_FINMIND_TOKEN: process.env.NEXT_PUBLIC_FINMIND_TOKEN,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'https://api.finmindtrade.com/api/v4/data',
  },
  // 配置图片优化
  images: {
    domains: [],
  },
    typescript: {
    ignoreBuildErrors: true, // 临时忽略构建错误
  }
};

module.exports = nextConfig;