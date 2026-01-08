# 部署新项目到GitHub Pages的快速指南

## 概述

本指南总结了将React/Vite应用部署到GitHub Pages子目录的完整流程，基于成功部署DeePAW和Diffraction项目的经验。

## 项目结构要求

适用于以下结构的项目：
- React 19+ 应用
- Vite 6+ 构建工具
- TypeScript支持
- 使用ESM模块从CDN加载React（esm.sh）

## 部署步骤

### 1. 解压和检查项目

```bash
# 查看压缩包内容
unzip -l project.zip

# 解压到临时目录
unzip -q project.zip -d project_temp

# 检查metadata.json了解项目信息
cat project_temp/metadata.json
```

### 2. 重命名并组织目录

```bash
# 根据项目名称重命名目录
mv project_temp project_name

# 检查README了解项目详情
cat project_name/README.md
```

### 3. 配置Vite构建（关键步骤！）

**问题：** Vite默认使用绝对路径（`/assets/...`），在GitHub Pages子目录部署时会失败。

**解决方案：** 在`vite.config.ts`中添加`base: './'`配置

```typescript
// vite.config.ts
export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      base: './',  // ← 添加这一行！使用相对路径
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      // ... 其他配置
    };
});
```

### 4. 安装依赖并构建

```bash
cd project_name

# 安装依赖
npm install

# 构建生产版本
npm run build
```

**预期输出：**
- `dist/index.html` (2-3 KB) - HTML模板
- `dist/assets/*.js` (几百KB) - 编译后的React应用
- `dist/assets/*.css` (可选) - 编译后的样式

### 5. 部署编译后的文件

```bash
# 将dist目录的内容复制到项目根目录
cp -r dist/* .

# 验证assets目录已创建
ls -lh assets/

# 清理构建产物（不需要提交到git）
rm -rf dist node_modules
```

### 6. 添加入口到主网站

编辑主网站的`index.html`，在"Interactive Tools"部分添加新的工具卡片：

```html
<a href="project_name/" class="tool-card">
    <span class="tool-card-badge">Live Demo</span>
    <h3>项目标题</h3>
    <p>项目描述，说明功能和特点...</p>
    <span class="tool-card-btn">Launch Tool</span>
</a>
```

### 7. 提交到Git并推送

```bash
# 回到项目根目录
cd ..

# 添加文件到git
git add index.html project_name/

# 提交
git commit -m "Deploy [项目名称] application

- Add compiled React app
- Configure vite.config.ts with relative paths
- Include compiled assets
- Add entry card to main website

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"

# 推送到GitHub
git push origin main
```

## 常见问题和解决方案

### 问题1：页面显示黑屏或空白

**原因：** 资源路径错误，浏览器无法加载JavaScript和CSS文件。

**解决方案：**
1. 检查`vite.config.ts`是否配置了`base: './'`
2. 重新构建：`npm run build`
3. 检查编译后的`dist/index.html`，确认资源路径是相对路径（`./assets/...`）

### 问题2：构建后的index.html看起来和原始文件一样

**原因：** 原始的`index.html`被错误的手动HTML替换了，Vite使用了错误的模板。

**解决方案：**
1. 从原始zip文件中提取正确的`index.html`模板
2. 正确的模板应该包含：
   - `<div id="root"></div>` - React挂载点
   - `<script type="module" src="/index.tsx"></script>` - 入口文件
   - Import maps配置
3. 恢复正确模板后重新构建

### 问题3：Git显示"no changes to commit"

**原因：** 文件内容实际上没有改变，或者文件没有被正确添加到暂存区。

**解决方案：**
1. 使用`git status`检查文件状态
2. 使用`git diff`查看实际的文件差异
3. 确保使用`git add`添加了正确的文件

## 关键经验总结

### ✅ 必须做的事情

1. **配置相对路径**：在`vite.config.ts`中添加`base: './'`
2. **保持原始模板**：不要手动修改`index.html`，让Vite处理
3. **验证构建输出**：检查`dist/`目录确认生成了正确的文件
4. **清理构建产物**：部署后删除`dist/`和`node_modules/`

### ❌ 不要做的事情

1. **不要**手动创建HTML文件替换原始模板
2. **不要**使用绝对路径配置（会导致GitHub Pages子目录部署失败）
3. **不要**提交`node_modules/`和`dist/`到git
4. **不要**跳过验证步骤就直接提交

## 快速参考清单

部署新项目时，按照以下清单逐项检查：

- [ ] 解压项目文件到合适的目录名
- [ ] 检查`metadata.json`和`README.md`了解项目
- [ ] 编辑`vite.config.ts`，添加`base: './'`
- [ ] 运行`npm install`安装依赖
- [ ] 运行`npm run build`构建项目
- [ ] 检查`dist/index.html`确认资源路径是相对路径（`./assets/...`）
- [ ] 运行`cp -r dist/* .`部署编译文件
- [ ] 验证`assets/`目录已创建且包含JS文件
- [ ] 运行`rm -rf dist node_modules`清理构建产物
- [ ] 编辑主网站`index.html`添加工具卡片
- [ ] 运行`git add index.html project_name/`添加文件
- [ ] 运行`git commit`提交更改
- [ ] 运行`git push origin main`推送到GitHub
- [ ] 等待1-2分钟让GitHub Pages更新
- [ ] 访问`https://suthphy2ai.github.io/personal-website/project_name/`验证部署

## 成功案例

### DeePAW - Charge Density Predictor
- **部署时间**: 2026-01-09
- **编译产物**: 463KB JavaScript + 438B CSS
- **URL**: https://suthphy2ai.github.io/personal-website/deepaw/

### Diffraction - Vectorized Matter
- **部署时间**: 2026-01-09
- **编译产物**: 745KB JavaScript
- **URL**: https://suthphy2ai.github.io/personal-website/diffraction/

---

**最后更新**: 2026-01-09
**适用于**: React 19+ / Vite 6+ / GitHub Pages
