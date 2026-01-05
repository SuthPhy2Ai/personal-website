# Tianhao Su - Personal Research Website

现代学术风格的个人网页，展示物理与深度学习的研究方向。

**在线访问**: `https://YOUR_USERNAME.github.io/personal-website`

---

## 📁 项目结构

```
web-test/
├── index.html              # 主网页文件
├── README.md              # 本文档
├── .gitignore             # Git 忽略文件配置
│
├── start.bat              # 启动本地服务器和隧道
├── stop.bat               # 停止所有服务
├── get-password.bat       # 获取 localtunnel 访问密码
├── status.bat             # 查看服务运行状态
└── deploy-instructions.bat # GitHub Pages 部署指南
```

---

## 🚀 本地开发

### 方式1：直接打开（最简单）
直接用浏览器打开 `index.html` 文件即可预览。

### 方式2：本地服务器
```bash
# Python 3
python -m http.server 8000

# 然后访问
http://localhost:8000
```

### 方式3：使用脚本（含公网隧道）
双击运行 `start.bat`

这会自动：
- 启动本地 HTTP 服务器（端口 8000）
- 启动 localtunnel 隧道
- 获取并显示公网访问地址
- 获取并显示访问密码

**停止服务**: 双击运行 `stop.bat`

---

## 🌐 部署到 GitHub Pages（推荐）

### 首次部署

1. **创建 GitHub 仓库**
   - 访问 https://github.com/new
   - 仓库名称：`personal-website`
   - 选择 **Public**
   - 不要勾选任何初始化选项
   - 点击 **Create repository**

2. **推送代码**
   ```bash
   # 替换 YOUR_USERNAME 为你的 GitHub 用户名
   git remote add origin https://github.com/YOUR_USERNAME/personal-website.git
   git push -u origin main
   ```

3. **启用 GitHub Pages**
   - 进入仓库的 **Settings** → **Pages**
   - Source: **Deploy from a branch**
   - Branch: **main**，文件夹：**/ (root)**
   - 点击 **Save**

4. **访问你的网站**

   几分钟后，网站将在以下地址上线：
   ```
   https://YOUR_USERNAME.github.io/personal-website
   ```

### 更新网站内容

修改 `index.html` 后，运行以下命令更新：

```bash
git add index.html
git commit -m "Update website content"
git push
```

等待 1-2 分钟，更改将自动部署到线上。

---

## ✏️ 修改网页内容

直接编辑 `index.html` 文件：

### 修改个人信息
```html
<!-- 修改名字 (第 282 行) -->
<h1>Tianhao Su</h1>

<!-- 修改副标题 (第 283 行) -->
<span class="title-accent">Physics × Deep Learning Research</span>

<!-- 修改简介 (第 288-292 行) -->
<p class="about-text">
    I am a researcher working at the intersection...
</p>
```

### 修改研究方向
找到 `research-grid` 部分（第 297-310 行），修改或添加研究卡片：
```html
<div class="research-item">
    <h3>你的研究方向</h3>
    <p>研究描述...</p>
</div>
```

### 修改项目列表
找到 `publication-list` 部分（第 315-328 行），修改项目：
```html
<li class="publication-item">
    <div class="pub-title">项目名称</div>
    <div class="pub-meta">项目描述</div>
</li>
```

### 修改技术标签
找到 `skills-container` 部分（第 333-345 行），添加或删除技能：
```html
<span class="skill-tag">你的技能</span>
```

### 修改配色方案
在 CSS 的 `:root` 部分（第 8-15 行）修改颜色变量：
```css
:root {
    --primary: #1a1a2e;      /* 主背景色 */
    --secondary: #16213e;    /* 卡片背景色 */
    --accent: #0f4c75;       /* 强调色 */
    --highlight: #3282b8;    /* 高亮色 */
    --text: #e8e8e8;         /* 主文字颜色 */
    --text-muted: #a0a0a0;   /* 次要文字颜色 */
    --border: #2a2a3e;       /* 边框颜色 */
}
```

---

## 🛠️ 常用 Git 命令

### 查看状态
```bash
git status
```

### 提交更改
```bash
git add .
git commit -m "描述你的更改"
git push
```

### 查看提交历史
```bash
git log --oneline
```

### 撤销未提交的更改
```bash
git checkout -- index.html
```

---

## 🔧 辅助脚本说明

### `start.bat`
启动本地服务器和 localtunnel 隧道，用于临时分享。

**输出示例**:
```
[1/3] Starting HTTP server on port 8000...
[2/3] Starting localtunnel...
[3/3] Getting tunnel information...

Your Website is Now Live!
your url is: https://xxxxx.loca.lt
Tunnel Password: 180.164.40.140
```

### `stop.bat`
停止所有后台运行的服务器和隧道进程。

### `get-password.bat`
快速获取 localtunnel 访问密码（你的公网IP）。

### `status.bat`
检查服务运行状态，显示当前的 URL 和密码。

---

## 📝 localtunnel 使用说明

### 特点
- ✅ 无需安装，使用 npx 即可运行
- ✅ 快速分享本地网站
- ⚠️ 每次重启 URL 会变化
- ⚠️ 首次访问需要输入密码（公网IP）

### 手动使用
```bash
# 启动服务器
python -m http.server 8000

# 在另一个终端启动隧道
npx localtunnel --port 8000

# 获取密码
curl https://loca.lt/mytunnelpassword
```

### 密码说明
- 密码是你的公网 IP 地址
- 同一公网 IP 下，7天内只需输入一次
- 分享链接时需要一起分享密码

---

## 🌟 GitHub Pages vs localtunnel

| 特性 | GitHub Pages | localtunnel |
|------|--------------|-------------|
| **URL稳定性** | ✅ 永久固定 | ❌ 每次变化 |
| **访问限制** | ✅ 无需密码 | ⚠️ 需要密码 |
| **部署速度** | ⚠️ 1-2分钟 | ✅ 即时 |
| **使用场景** | 长期展示 | 临时演示 |
| **成本** | 免费 | 免费 |

**推荐**：长期使用选 GitHub Pages，临时演示用 localtunnel。

---

## 🎨 设计特点

- **深色学术风格**：专业现代的配色方案
- **网格背景**：模拟科研论文/数据可视化风格
- **极简主义**：干净的排版，优秀的可读性
- **细腻交互**：悬停效果和微妙动画
- **响应式设计**：自适应手机、平板、电脑
- **无障碍访问**：语义化 HTML，良好的对比度

---

## 📚 技术栈

- **纯 HTML + CSS**：无需构建工具
- **响应式设计**：CSS Grid + Flexbox
- **现代字体**：系统字体栈，等宽代码字体
- **动画效果**：CSS transitions + keyframes
- **版本控制**：Git + GitHub

---

## 🐛 故障排除

### 本地服务器端口被占用
```bash
# 使用其他端口
python -m http.server 8080

# 对应修改 localtunnel
npx localtunnel --port 8080
```

### Git 推送失败
```bash
# 确认远程仓库地址
git remote -v

# 如果错误，重新设置
git remote set-url origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
```

### GitHub Pages 没有更新
- 等待 1-5 分钟（GitHub 需要构建时间）
- 检查仓库 **Actions** 标签页查看部署状态
- 清除浏览器缓存（Ctrl + F5）

### localtunnel 无法访问
- 确认防火墙没有阻止
- 检查本地服务器是否正在运行
- 尝试重新启动隧道

---

## 📄 许可证

MIT License - 自由使用和修改

---

## 🤝 贡献

欢迎提出建议和改进！

---

**最后更新**: 2026-01-02
