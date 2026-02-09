# 0emo博客（Astro + Tailwind，静态站）

一个极简 + 工具型的个人博客/工具站：文章（Markdown）、标签、RSS、站点地图、以及一组内置小工具。项目面向 **Cloudflare Pages** 的 GitHub 自动构建部署；已移除 Docker/容器部署相关内容。

## 功能清单

- 文章系统：Markdown 写作（`src/content/blog/*.md`），支持 `draft` 草稿不在生产环境展示
- 文章增强：目录（TOC）、阅读时间、代码高亮、上一篇/下一篇、相关文章推荐
- SEO：动态 title/description、OG/Twitter meta、canonical、`/sitemap.xml`
- 订阅：`/rss.xml`（RSS）
- 评论：Giscus（基于 GitHub Discussions）
- 工具箱：`/tools` + 多个工具页
  - IP 信息查询：`/tools/ip`
  - Base64 编码/解码：`/tools/base64`
  - Cron 下一次执行时间：`/tools/cron`
  - UUID 生成器：`/tools/uuid`
  - 子网掩码 / CIDR（IPv4/IPv6）：`/tools/subnet`
- 深色模式：跟随系统 + 手动切换（记忆）
- 性能：静态站构建输出 `dist/`，并通过 `public/_headers` 配置静态资源缓存策略（Cloudflare Pages）

> 说明：本站不再提供在线后台（Decap CMS）写作入口；内容更新通过直接提交 Markdown 到仓库完成。

## 目录结构（关键部分）

- `src/content/blog/`：文章 Markdown
- `src/content/settings/site.json`：站点配置（站名/导航/社交/工具列表/SEO 等）
- `src/pages/`：页面路由（`/posts`、`/tags`、`/tools/*` 等）
- `src/layouts/`：布局（基础布局、文章布局、工具布局）
- `src/components/`：组件（Header/Footer/SEO/TOC/分享/Giscus 等）
- `public/`：静态资源（`robots.txt`、`_headers`、图标等）

## 本地开发

建议 Node 版本：**20 LTS**

```bash
npm install
npm run dev
```

打开：`http://localhost:4321`

## 生产自检（推荐）

用于模拟线上构建输出：

```bash
npm run build
npm run preview -- --host
```

然后访问本机局域网地址测试移动端/其他设备访问。

## 如何写文章（Markdown）

在 `src/content/blog/` 新建 `*.md` 文件（文件名建议英文/数字+短横线），示例：

```md
---
title: "我的第一篇文章"
date: "2026-02-09"
description: "这是一段简短摘要"
tags: ["astro", "blog"]
draft: false
featured: false
---

正文从这里开始…
```

字段说明：

- `title`：标题
- `date`：日期（建议 ISO 字符串）
- `description`：摘要（用于列表与 SEO）
- `tags`：标签数组
- `draft`：`true` 时仅用于本地预览/草稿管理，生产环境不会出现在首页/列表/标签页/sitemap/rss
- `featured`：精选文章（用于首页“精选/推荐”区）

## 站点配置怎么改（站名/导航/社交/工具等）

编辑：`src/content/settings/site.json`

常用字段：

- `url`：站点线上域名（非常重要，用于 canonical、sitemap 等）
- `siteName`：站名
- `slogan`：副标题
- `description`：站点描述
- `nav[]`：导航菜单（`label` + `href`）
- `social`：社交链接（`github/telegram/twitter/email` 等）
- `tools[]`：工具箱卡片（`title/slug/description/status/iconKey`）
- `seo`：SEO 默认项（`twitterHandle/ogImage`）

> 提示：`tools[].slug` 必须与路由一致，例如 `uuid` 对应 `/tools/uuid`。

## Giscus 配置（评论）

项目会从站点配置读取 Giscus 参数（repo/category 等）。你需要在 GitHub 仓库启用 Discussions，并在站点配置里填写：

1) 确认仓库已开启 Discussions
2) 生成并填写 Giscus 所需的 `repo`、`repoId`、`category`、`categoryId`
3) 部署后打开任意文章页，评论区应正常加载

如果评论区不显示，优先检查：
- 仓库是否启用 Discussions
- repo/category/categoryId 是否匹配
- 页面是否处于私有网络/拦截脚本环境

## 部署到 Cloudflare Pages（推荐）

### 1) 连接 GitHub 仓库

在 Cloudflare Pages 控制台中：

- 选择导入 GitHub 仓库
- 选择分支：`main`

### 2) 构建配置

- Build command：`npm run build`
- Output directory：`dist`
- 环境变量：默认无需设置

### 3) Node 版本（必须 Node 20）

两种方式（二选一，建议都配，更稳）：

A) Pages UI 环境变量（如你的 Pages 支持）
- `NODE_VERSION=20`

B) 仓库内固定版本（已配置）
- `.nvmrc` 为 `20`
- `package.json` 已设置 `engines`（限制 Node 20）

### 4) 缓存策略（已内置）

本项目通过 `public/_headers` 提供：
- `/assets/*` 等静态资源长缓存（immutable）
- HTML 低缓存（must-revalidate）
- `/rss.xml`、`/sitemap.xml`、`/robots.txt` 中等缓存

### 5) 部署后验证

部署完成后，确认以下地址可访问：

- `/rss.xml`
- `/sitemap.xml`
- `/robots.txt`
- `/tools/ip`

### 6) 自定义域名与 HTTPS（简要）

在 Pages 项目里添加自定义域名：
- 绑定域名
- 等待证书签发
- 开启强制 HTTPS（如可用）

## 工具页：第三方 API 可靠性提示（/tools/ip）

`/tools/ip` 使用公共 IP 信息 API：
- API 失败时页面会显示友好错误提示（不会白屏）
- 建议后续增加“备用 API”以提升稳定性（例如多个 provider 轮询/降级）

## 自检清单（你应该访问哪些路由）

- 首页：`/`
- 文章列表：`/posts`
- 标签页：`/tags`
- 任意文章详情：`/posts/<slug>`
- RSS：`/rss.xml`
- Sitemap：`/sitemap.xml`
- Robots：`/robots.txt`
- 工具箱：`/tools`
- IP 查询：`/tools/ip`
- Base64：`/tools/base64`
- Cron：`/tools/cron`
- UUID：`/tools/uuid`
- 子网掩码：`/tools/subnet`
- 深色模式：切换按钮 + 刷新后是否记忆
- 分享按钮：文章页复制链接/分享到 X/Telegram
- 评论：文章页底部 Giscus（配置正确时可见）

