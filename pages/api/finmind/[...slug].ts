import type { NextApiRequest, NextApiResponse } from 'next';
import { createProxyMiddleware, fixRequestBody } from 'http-proxy-middleware';

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
  
  // 增强路径重写逻辑
  pathRewrite: (path: string, req: NextApiRequest) => {
    // 情况1: /api/finmind 直接重写到 /api/v4/data
    if (path === '/api/finmind') {
      return '/api/v4/data';
    }
    
    // 情况2: /api/finmind/data? 保持为 /api/v4/data
    if (path.startsWith('/api/finmind/data')) {
      return path.replace('/api/finmind/data', '/api/v4/data');
    }
    
    // 情况3: /api/finmind?dataset=... 重写到 /api/v4/data
    if (path.startsWith('/api/finmind?')) {
      return '/api/v4/data' + path.substring('/api/finmind'.length);
    }
    
    // 默认处理其他情况
    return path.replace('/api/finmind', '/api/v4');
  },
  
  onProxyReq: (proxyReq, req) => {
    // 修复请求体处理
    fixRequestBody(proxyReq, req);
    
    // 添加认证头 (使用 Vercel 环境变量)
    const token = process.env.FINMIND_TOKEN || process.env.NEXT_PUBLIC_FINMIND_TOKEN;
    if (token) {
      proxyReq.setHeader('Authorization', `Bearer ${token}`);
    }
    
    // 调试日志
    console.log('代理请求路径:', req.url);
    console.log('重写后路径:', proxyReq.path);
    
    // 处理非 GET 请求的 body
    if (req.body && !['GET', 'HEAD'].includes(req.method || '')) {
      const bodyData = JSON.stringify(req.body);
      proxyReq.setHeader('Content-Type', 'application/json');
      proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
      proxyReq.write(bodyData);
    }
  },
  
  onProxyRes: (proxyRes) => {
    // 统一添加 CORS 响应头
    proxyRes.headers['Access-Control-Allow-Origin'] = '*';
    proxyRes.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS';
    proxyRes.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization';
    
    // 移除不必要安全头（可选）
    delete proxyRes.headers['x-frame-options'];
    delete proxyRes.headers['x-powered-by'];
  },
  
  onError: (err, req, res) => {
    console.error('代理请求失败:', err);
    if (!res.headersSent) {
      res.status(500).json({ 
        error: '代理请求失败',
        message: err.message,
        target: 'https://api.finmindtrade.com' 
      });
    }
  },
  
  // 解决 Vercel 超时问题
  proxyTimeout: 30000,
});

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // 处理 OPTIONS 预检请求
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return res.status(200).end();
  }

  // 执行代理
  return new Promise<void>((resolve) => {
    // 调试日志
    console.log('接收请求:', req.url);
    console.log('请求方法:', req.method);
    
    proxy(req, res, (err: any) => {
      if (err) {
        console.error('代理中间件错误:', err);
        if (!res.headersSent) {
          res.status(500).json({ 
            error: '代理处理失败',
            message: err.message,
            details: err.stack 
          });
        }
      }
      resolve();
    });
  });
}