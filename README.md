# myblog（Astro + Tailwind，纯静态）

一个“极简 + 工具型”的个人博客骨架：低频更新，内容包含教程 / 经验 / 随笔 / 综合。支持 Markdown 写作，静态部署（不使用 SSR）。

## 功能清单

- Markdown 写作（Astro content collections，带 schema 校验）
- 文章：列表 / 详情
- 标签：标签列表 / 标签详情页
- 评论：Giscus（GitHub Discussions）
- 社交分享：复制链接 / X(Twitter) / Telegram / 微博（文章页提供）
- 订阅：RSS（`/rss.xml`）+ 邮件订阅表单（可嵌入/占位配置）
- 工具箱：`/tools`（多个工具入口卡片占位）+ 可用的 IP 信息查询（`/tools/ip`）
- 极简 UI、移动端适配、深色模式（跟随系统 + 手动切换）
- 代码高亮（Shiki）、目录（TOC）、阅读时间
- SEO：基础 meta + `@astrojs/sitemap`（生成站点地图）

## 快速开始（可复制粘贴）

```bash
npm install
npm run dev
```

本地访问：

```text
http://localhost:4321
```

构建与预览：

```bash
npm run build
npm run preview
```

## 目录结构

```text
.
├─ astro.config.ts           # Astro 配置（静态输出 / Tailwind / Sitemap / Markdown 高亮）
├─ tailwind.config.mjs       # Tailwind 配置
├─ postcss.config.mjs        # PostCSS 配置
├─ public/                   # 静态资源（favicon、robots 等）
└─ src/
   ├─ config/
   │  └─ site.ts             # 站点配置（站名/描述/菜单/社交/Giscus/订阅）
   ├─ components/            # UI 组件（Header/Footer/ThemeToggle/Giscus/ShareButtons/TOC…）
   ├─ layouts/               # 布局（BaseLayout/PostLayout）
   ├─ pages/                 # 路由页面（首页/文章/标签/工具/RSS）
   ├─ styles/
   │  └─ global.css          # Tailwind + 全局样式（btn/card/prose 等）
   ├─ content/
   │  ├─ config.ts           # content collections schema
   │  └─ blog/               # Markdown 文章
   └─ utils/                 # 工具函数（readingTime/date/posts）
```

## 如何写文章（Markdown）

文章目录：`src/content/blog/`

新建一个 `*.md`，包含以下 frontmatter 字段：

```yaml
---
title: 标题
date: 2026-02-08
tags: [Astro, 教程]
description: 一句话描述（用于列表/SEO）
draft: false
---
```

说明：

- `draft: true`：本地开发（`npm run dev`）可见；生产构建（`npm run build`）会自动隐藏草稿
- 路由规则：文件名决定 slug，例如 `src/content/blog/hello.md` => `/posts/hello/`

## 站点配置（站名/菜单/社交/订阅）

编辑：`src/config/site.ts`

常用项：

- `SITE.name` / `SITE.description` / `SITE.author`
- `SITE.url`：务必改成你的线上域名（影响 sitemap / RSS 的绝对链接）
- `SITE.nav`：顶部菜单
- `SITE.social`：社交链接（用于页脚与关于页）
- `SITE.subscribe.rssPath`：RSS 地址（默认 `/rss.xml`）
- `SITE.subscribe.email`：邮件订阅表单占位配置

## 配置 Giscus（评论）

编辑：`src/config/site.ts` 的 `SITE.giscus`

你需要填入这 4 个关键字段：

- `repo`：形如 `OWNER/REPO`
- `repoId`
- `category`
- `categoryId`

获取方式（按步骤做即可）：

1. 在 GitHub 仓库开启 Discussions
2. 安装并授权 Giscus GitHub App 到你的仓库
3. 在 Giscus 配置页面选择仓库与分类，页面会生成一段配置（包含 `repoId`/`categoryId`）
4. 把对应值复制到 `src/config/site.ts`

提示：

- 当前项目已内置深色模式联动（切换主题会同步更新 Giscus theme）
- 若未配置或仍是占位值，页面会显示“未配置”的友好提示

## 工具：IP 信息查询（/tools/ip）

路由：`/tools/ip`

特点：

- 输入 IP 查询（IPv4/IPv6）
- 留空查询本机出口 IP
- 使用公共 API（浏览器直连），失败会显示友好错误信息

## 部署（静态）

构建产物目录：`dist/`

部署前请先修改：

- `src/config/site.ts` 的 `SITE.url`（影响 RSS / sitemap / canonical）

### Cloudflare Pages（推荐）

在 Cloudflare Pages 新建项目后，配置：

```text
Build command: npm run build
Build output directory: dist
Node.js version: 18+（建议 20）
```

### Vercel

导入仓库后，通常会自动识别 Astro；若需要手动填：

```text
Build command: npm run build
Output directory: dist
Install command: npm install
```

### GitHub Pages（建议使用用户站点仓库）

最省事的方式：创建仓库名为 `USERNAME.github.io`（用户站点），这样站点部署在根路径，不需要额外 basePath 配置。

如果你要用 Actions，可复制下面 workflow 到：`.github/workflows/deploy.yml`

```yaml
name: Deploy Astro to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm

      - name: Install
        run: npm ci

      - name: Build
        run: npm run build

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: dist

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy
        id: deployment
        uses: actions/deploy-pages@v4
```

## 自检清单（建议逐项访问）

- `/`：首页能加载，显示最新文章卡片
- `/posts`：文章列表（含阅读时间、标签）
- `/posts/<slug>`：文章详情（代码高亮、TOC、分享按钮、评论区）
- `/tags`：标签列表
- `/tags/<tag>`：标签详情页筛选正确
- `/rss.xml`：RSS 可访问（浏览器打开能看到 XML）
- `/tools`：工具箱入口卡片
- `/tools/ip`：IP 查询（留空 / 输入 IP / 错误提示）
- 深色模式：右上角“主题”按钮可切换（跟随/深色/浅色），刷新后仍保持
- 分享按钮：复制链接能弹出“已复制”，X/Telegram/微博能打开分享页
- 评论：配置好 Giscus 后能正常加载（未配置时显示提示）

