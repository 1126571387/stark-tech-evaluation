import type { NextApiRequest, NextApiResponse } from 'next';
import { createProxyMiddleware } from 'http-proxy-middleware';

// 禁用默认的 bodyParser
export const config = {
  api: {
    bodyParser: false,
    responseLimit: '8mb',
    externalResolver: true,
  },
};

const proxy = createProxyMiddleware({
  target: 'https://api.finmindtrade.com',
  changeOrigin: true,
  pathRewrite: {
    '^/api/finmind': '/api/v4', // 路径重写规则
  },
  onProxyReq: (proxyReq, req) => {
    // 添加认证头
    if (process.env.FINMIND_TOKEN) {
      proxyReq.setHeader('Authorization', `Bearer ${process.env.FINMIND_TOKEN}`);
    }
    
    // 处理 POST/PUT 请求的 body
    if (req.body && (req.method === 'POST' || req.method === 'PUT')) {
      const bodyData = JSON.stringify(req.body);
      proxyReq.setHeader('Content-Type', 'application/json');
      proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
      proxyReq.write(bodyData);
    }
  },
  onProxyRes: (proxyRes) => {
    // 统一添加CORS响应头
    proxyRes.headers['Access-Control-Allow-Origin'] = '*';
    proxyRes.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS';
    proxyRes.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization';
    
    // 移除不必要安全头（可选）
    delete proxyRes.headers['x-frame-options'];
    delete proxyRes.headers['x-powered-by'];
  },
});

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // 处理OPTIONS预检请求
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return res.status(200).end();
  }

  // 执行代理
  return new Promise<void>((resolve) => {
    proxy(req, res, (err: any) => {
      if (err) {
        console.error('Proxy error:', err);
        res.status(500).json({ 
          error: '代理请求失败',
          message: err.message,
          target: 'https://api.finmindtrade.com'
        });
      }
      resolve();
    });
  });
}