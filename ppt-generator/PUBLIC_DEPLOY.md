# 🌐 公网部署方案

## 问题分析

**当前情况**：
- GitHub Pages 网站：`https://uncletan-qytec.github.io/ai-toolbox/ppt-generator/`
- 后端服务：运行在本地 `http://localhost:3000`

**问题**：GitHub Pages 是静态托管，无法运行 Node.js 后端，前端无法调用本地服务。

---

## ✅ 解决方案

### 方案 1：VPS 部署后端（推荐）

适合有服务器（阿里云/腾讯云/AWS 等）的情况。

#### 步骤 1：准备服务器

- 系统：Ubuntu 20.04+ 或 CentOS 7+
- 配置：2 核 4GB 以上
- 网络：公网 IP

#### 步骤 2：安装环境

```bash
# SSH 登录服务器
ssh root@your-server-ip

# 安装 Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# 安装 Python
apt install -y python3 python3-pip

# 安装 PM2（进程管理）
npm install -g pm2
```

#### 步骤 3：上传代码

```bash
# 方式 A：从 GitHub 克隆
git clone https://github.com/UncleTan-QYTec/ai-toolbox.git
cd ai-toolbox/ppt-generator

# 方式 B：直接上传文件
# 使用 scp 或 FTP 上传 ppt-generator 目录
```

#### 步骤 4：安装 Skywork 技能

```bash
# 下载并解压 Skywork PPT 技能
cd /root
wget https://github.com/.../skywork-ppt-1.0.3.zip
unzip skywork-ppt-1.0.3.zip

# 认证
cd skywork-ppt-1.0.3
python3 scripts/skywork_auth.py --login
```

#### 步骤 5：配置后端

编辑 `server.js`，修改 Skywork 路径：

```javascript
const SKYWORK_SKILL_DIR = '/root/skywork-ppt-1.0.3';
```

#### 步骤 6：启动服务

```bash
# 安装依赖
npm install

# 使用 PM2 启动
pm2 start server.js --name ppt-generator

# 设置开机自启
pm2 startup
pm2 save
```

#### 步骤 7：配置防火墙

```bash
# 开放 3000 端口
ufw allow 3000/tcp

# 或者使用 Nginx 反向代理
apt install -y nginx

cat > /etc/nginx/sites-available/ppt << 'EOF'
server {
    listen 80;
    server_name ppt.your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
EOF

ln -s /etc/nginx/sites-available/ppt /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

#### 步骤 8：配置 HTTPS（可选）

```bash
apt install -y certbot python3-certbot-nginx
certbot --nginx -d ppt.your-domain.com
```

#### 步骤 9：更新前端配置

编辑 `ppt-generator/app.js`：

```javascript
const CONFIG = {
    // 改为公网地址
    backendApiUrl: 'https://ppt.your-domain.com/api/ppt'
    // 或 http://your-server-ip:3000/api/ppt
};
```

#### 步骤 10：重新部署到 GitHub Pages

```bash
cd /home/klnhtt/.openclaw/workspace-coder/ai-toolbox
git add .
git commit -m "config: 更新后端 API 地址为公网"
git push
```

等待 1-2 分钟，GitHub Pages 自动更新。

---

### 方案 2：Railway / Render（免费额度）

适合没有服务器的情况。

#### Railway 部署

1. 访问 https://railway.app
2. 连接 GitHub 账号
3. 选择 `ai-toolbox` 仓库
4. 配置环境变量：
   ```
   SKYWORK_SKILL_DIR=/app/skywork-ppt-1.0.3
   ```
5. 部署

⚠️ **注意**：需要把 Skywork 技能也上传到仓库，或使用 Docker。

#### Docker 方式

创建 `Dockerfile`：

```dockerfile
FROM node:20-slim

# 安装 Python
RUN apt-get update && apt-get install -y \
    python3 python3-pip git \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# 复制代码
COPY package*.json ./
COPY server.js ./
COPY *.html ./
COPY *.css ./
COPY *.js ./

# 安装依赖
RUN npm install

# 下载 Skywork 技能
RUN git clone https://github.com/.../skywork-ppt-1.0.3

# 认证（需要手动）
# RUN python3 skywork-ppt-1.0.3/scripts/skywork_auth.py --login

EXPOSE 3000

CMD ["node", "server.js"]
```

---

### 方案 3：Agent 中转（无需服务器）

如果不想部署后端，可以用我（Agent）来调用 Skywork 技能。

#### 工作流程

```
前端 → 提交任务 → 飞书/微信 → 我（Agent）→ Skywork → 返回结果 → 前端
```

#### 实现方式

1. 前端提交任务到飞书多维表格/飞书任务
2. 我定期检查新任务
3. 调用 Skywork 技能生成
4. 把结果写回飞书
5. 前端轮询飞书获取结果

这个方案**完全免费**，但速度较慢（依赖检查间隔）。

---

## 📊 方案对比

| 方案 | 成本 | 速度 | 复杂度 | 推荐度 |
|------|------|------|--------|--------|
| VPS 部署 | ¥50-200/月 | 快 | 中 | ⭐⭐⭐⭐⭐ |
| Railway | 免费额度 | 快 | 低 | ⭐⭐⭐⭐ |
| Agent 中转 | 免费 | 慢 | 低 | ⭐⭐⭐ |

---

## 🚀 快速开始（VPS 方案）

### 一键部署脚本

创建 `deploy.sh`：

```bash
#!/bin/bash

echo "🚀 AI PPT 生成器 - 公网部署脚本"
echo "================================"

# 检查环境
if ! command -v node &> /dev/null; then
    echo "❌ 未安装 Node.js"
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
    apt install -y nodejs
fi

if ! command -v python3 &> /dev/null; then
    echo "❌ 未安装 Python"
    apt install -y python3 python3-pip
fi

# 安装 PM2
npm install -g pm2

# 进入项目目录
cd /root/ai-toolbox/ppt-generator

# 安装依赖
npm install

# 停止旧服务
pm2 stop ppt-generator 2>/dev/null || true
pm2 delete ppt-generator 2>/dev/null || true

# 启动新服务
pm2 start server.js --name ppt-generator

# 保存配置
pm2 startup
pm2 save

echo ""
echo "✅ 部署完成！"
echo ""
echo "服务状态：$(pm2 status ppt-generator | grep online)"
echo "访问地址：http://$(curl -s ifconfig.me):3000"
echo ""
echo "日志：pm2 logs ppt-generator"
echo "重启：pm2 restart ppt-generator"
echo "停止：pm2 stop ppt-generator"
```

使用：
```bash
curl -O https://raw.githubusercontent.com/UncleTan-QYTec/ai-toolbox/main/ppt-generator/deploy.sh
chmod +x deploy.sh
./deploy.sh
```

---

## 📝 前端配置

无论选择哪个方案，都需要更新前端 API 地址：

编辑 `ppt-generator/app.js`：

```javascript
const CONFIG = {
    // 本地开发
    // backendApiUrl: 'http://localhost:3000/api/ppt',
    
    // 公网部署（改为你的地址）
    backendApiUrl: 'https://ppt.your-domain.com/api/ppt'
};
```

然后提交：
```bash
git add .
git commit -m "config: 更新 API 地址为公网"
git push
```

---

## 🔍 验证部署

### 1. 健康检查

```bash
curl https://ppt.your-domain.com/api/health
```

期望响应：
```json
{
  "status": "ok",
  "service": "ppt-generator-server"
}
```

### 2. 创建任务

```bash
curl -X POST https://ppt.your-domain.com/api/ppt/generate \
  -H "Content-Type: application/json" \
  -d '{"topic":"测试","slideCount":5,"style":"business","language":"zh"}'
```

### 3. 前端测试

访问 GitHub Pages 网站：
```
https://uncletan-qytec.github.io/ai-toolbox/ppt-generator/
```

打开浏览器控制台，查看是否有网络错误。

---

## ❓ 常见问题

### Q: GitHub Pages 能直接运行后端吗？

**A:** 不能。GitHub Pages 只能托管静态文件（HTML/CSS/JS），无法运行 Node.js/Python 等后端服务。

### Q: 必须买服务器吗？

**A:** 不是。可以用 Railway/Render 的免费额度，或者用 Agent 中转方案。

### Q: 本地测试可以，公网不行？

**A:** 检查：
1. 防火墙是否开放端口
2. 后端是否监听 `0.0.0.0` 而非 `127.0.0.1`
3. 前端 API 地址是否正确

### Q: HTTPS 证书怎么弄？

**A:** 使用 Nginx + Let's Encrypt：
```bash
apt install certbot python3-certbot-nginx
certbot --nginx -d your-domain.com
```

---

需要帮助部署？告诉我你的情况（有无服务器/域名），我帮你选最佳方案！
