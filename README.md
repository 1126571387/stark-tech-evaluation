


这是一个类似财报狗的股票数据分析界面，使用 Next.js 和 MUI 构建，通过 FinMind API 获取股票数据。


## 功能特性

- 🚀 股票搜索与选择功能
- 📊 月度营收数据可视化
- 📈 同比/环比增长计算
- 📱 响应式布局适配多设备
- ⚡ 数据缓存优化

## 在线访问

👉 [生产环境地址](https://your-vercel-app-url.vercel.app/)  

## 本地运行指南

### 前置要求

- Node.js v18+
- npm v11+ 或 yarn v1.22+
- FinMind 账号（用于获取 API token）

### 安装步骤

1. **克隆仓库**
   ```bash
   git clone https://github.com/1126571387/stark-tech-evaluation.git
   cd stark-tech-evaluation

2. **​安装依赖**
npm install 或 yarn install

3. **​设置环境变量**
创建 .env.local 文件：
# FinMind API 配置
FINMIND_TOKEN=your_api_token_here

# 可选：开发环境特定设置
NEXT_PUBLIC_ENV=development

4. **​启动开发服务器**
npm run dev 或  yarn dev

5. **访问应用**
打开浏览器访问：http://localhost:3000

6. **​构建生产环境**
# 构建生产版本
npm run build

# 启动生产服务器
npm start


