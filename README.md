# Tianhao Su - Personal Research Website

Materials Informatics & AI for Science 研究者的个人学术主页。

**在线访问**: https://suthphy2ai.github.io/personal-website

## 项目结构

```
personal-website/
├── index.html          # 主页
├── e3nn-viz/           # E3NN球谐函数可视化工具
│   ├── index.html
│   └── assets/
└── images/             # 论文配图
    └── papers/
```

## Interactive Tools

| 工具 | 描述 | 链接 |
|------|------|------|
| E3NN Spherical Harmonics Visualizer | E(3)等变神经网络中球谐函数的交互式3D可视化 | [Launch](https://suthphy2ai.github.io/personal-website/e3nn-viz/) |

## 本地开发

```bash
# 方式1: 直接打开
open index.html

# 方式2: 本地服务器
python -m http.server 8000
# 访问 http://localhost:8000
```

## 添加新的交互式工具

1. 在本地构建React/Vue等应用 (`npm run build`)
2. 将构建产物复制到子目录（如 `my-tool/`）
3. 在 `index.html` 的 Interactive Tools 部分添加链接
4. 提交并推送到GitHub

**注意**: Vite项目需要配置正确的 `base` 路径：
```js
// vite.config.ts
base: '/personal-website/my-tool/'
```

## 技术栈

- **主页**: 纯HTML + CSS（无构建工具）
- **交互工具**: React + Three.js + Vite
- **托管**: GitHub Pages（静态文件托管）
- **CDN**: esm.sh（运行时模块加载）

## License

MIT
