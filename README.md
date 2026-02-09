# 极简工具型博客（Astro + Tailwind）

一个“极简 + 工具型”的个人博客/知识站：低频更新，支持 Markdown 写作，包含文章、标签、工具箱、RSS、SEO、深色模式、搜索、分享、评论（Giscus）。

## 功能清单

- Markdown 写作（Astro Content Collections）
- 文章列表 / 文章详情 / 标签页
- 文章阅读时间、目录 TOC、代码高亮
- 上一篇/下一篇、相关文章推荐
- 评论：Giscus（GitHub Discussions）
- 分享：复制链接 / X(Twitter) / Telegram / 微博
- 订阅：RSS；邮件订阅（可嵌入表单，占位配置）
- 工具箱：
  - IP 信息查询（公共 API，失败友好提示）
  - Base64 编码/解码（UTF-8 + 复制）
  - Cron 下一次执行时间（近 5 次，本地时区）
- 深色模式：跟随系统 + 手动切换 + 记忆；切换时同步 Giscus 主题
- SEO：动态 title/description、OG/Twitter meta、canonical、sitemap、robots

## 环境要求（重要）

- 建议本地使用 **Node 20 LTS**
- Cloudflare Pages 构建环境也建议使用 **Node 20**

项目已做两处锁定：

- `package.json` 的 `engines.node`：`>=20 <21`
- `.nvmrc`：`20`

## 快速开始

```bash
npm install
npm run dev
```

构建与预览：

```bash
npm run build
npm run preview
```

生产构建自检（推荐，用于减少“本地能跑、云端 build 失败”概率）：

```bash
npm run check:prod
```

> `check:prod` 会执行 `build` 后再 `preview -- --host`，更接近云端真实部署形态。

## 目录结构

```
src/
  config/
    site.ts              # 站点配置（站名、导航、社交、工具、SEO、Giscus、订阅等）
  content/
    blog/                # Markdown 文章
    config.ts            # content collections schema
  components/            # 组件（layout / home / post / ui 等）
  layouts/               # BaseLayout / PostLayout / ToolLayout
  pages/
    posts/               # 文章列表与详情路由
    tags/                # 标签路由
    tools/               # 工具箱与工具页
    rss.xml.ts           # RSS
    sitemap.xml.ts       # sitemap
public/
  robots.txt
  _headers               # Cloudflare Pages 缓存策略
```

## 如何写文章（Markdown）

在 `src/content/blog/` 新建 `*.md` 文件，示例 frontmatter：

```md
---
title: 你的标题
date: 2026-02-08
tags: [Astro, 工具]
description: 一句话摘要
draft: false
featured: true
---
```

- `draft: true`：生产构建不会出现在首页/列表/标签/上一篇下一篇/sitemap/RSS
- `featured: true`：可用于首页精选文章区（如已实现）

## 站点配置（集中入口）

所有可编辑配置集中在：

- `src/config/site.ts`

你可以在这里修改：

- 站点名称/描述/URL、slogan、作者信息
- 导航菜单、社交链接（GitHub/Telegram/X/Email）
- 工具列表（工具箱卡片数据源）
- SEO 默认配置（OG 图、Twitter Handle 等）
- Giscus 配置（repo/category 等）
- 订阅配置（RSS 路径、邮件订阅表单占位）

## 配置 Giscus（评论）

1) 在 GitHub 仓库开启 Discussions，并创建一个分类（例如 “General”）。
2) 在 `src/config/site.ts` 中填写：
   - `giscus.enabled = true`
   - `giscus.repo`（形如 `OWNER/REPO`）
   - `giscus.repoId`
   - `giscus.category`
   - `giscus.categoryId`
3) 主题：
   - `themeLight` / `themeDark` 可按需选择
   - 站点深色模式切换时，会通过 `postMessage` 同步更新 Giscus 主题

## 第三方 API 可靠性说明（/tools/ip）

`/tools/ip` 使用公共 IP 查询 API：

- 如果 API 失败（网络、限流、跨域等），页面会展示友好错误提示
- 建议后续加入 **备用 API**（例如当主 API 失败时自动切换），提高可用性（当前不强制实现）

## 部署到 Cloudflare Pages（推荐）

目标：稳定部署静态站（SSR 不需要）。

### 1) 连接仓库

1. 将项目推送到 GitHub（或你的 Git 提供方）。
2. 在 Cloudflare Pages 创建新项目，选择从 Git 导入。
3. 选择该仓库与分支。

### 2) 构建设置

- **Build command**：`npm run build`
- **Output directory**：`dist`
- **环境变量**：一般情况下 **无需设置**

### 3) Node 版本（必须 Node 20）

为了稳定构建，建议同时使用以下方式（更稳）：

- A) Pages 的构建环境变量中设置 `NODE_VERSION=20`（若你的 Pages 构建环境支持该变量）
- B) 项目内已包含：
  - `package.json` 的 `engines.node`（`>=20 <21`）
  - `.nvmrc`（`20`）

说明：

- `NODE_VERSION` 优先用于 Pages 的构建镜像选择（如果可用）
- `engines` / `.nvmrc` 用于在不同环境里提供一致的 Node 版本约束与提示

### 4) 缓存策略（已内置）

项目已提供 `public/_headers`，用于建议的缓存策略：

- `/_astro/*`、`/assets/*`：长缓存（1 年 + immutable）
- `/rss.xml`、`/sitemap.xml`、`/robots.txt`：10 分钟缓存
- 其余页面（HTML 路由）：`max-age=0` + `must-revalidate`

> 这是静态站常见策略：静态资源强缓存、HTML 低缓存，减少“更新不生效”问题。

### 5) 部署后验证（必做）

部署成功后，打开站点并验证以下路由可访问：

- `/rss.xml`
- `/sitemap.xml`
- `/robots.txt`

同时建议打开：

- 首页、文章页、工具页（/tools/ip /tools/base64 /tools/cron）
- 深色模式切换与评论区主题同步

### 6) 自定义域名与 HTTPS（简要）

1. 在 Pages 项目中添加自定义域名。
2. 按提示在域名 DNS 中添加/修改记录。
3. 等待证书签发完成后，开启 HTTPS（一般自动）。

## Docker 部署（可选）

如果你希望用 Docker 在服务器上部署（不依赖本机 Node 环境），本项目已提供：

- `Dockerfile`：多阶段构建（Node 20 构建静态站 → nginx 提供静态服务）
- `docker/nginx.conf`：静态站 nginx 配置（长缓存静态资源、HTML 低缓存、友好 404）
- `docker-compose.yml`：一条命令启动

### 方式 A：docker build + docker run

```bash
docker build -t myblog .
docker run --rm -p 8080:80 myblog
```

浏览器访问：`http://localhost:8080`

#### 常见问题：无法拉取 `node:20-alpine` / `nginx:alpine`

如果你看到类似“failed to fetch anonymous token / dial tcp … auth.docker.io …”的错误，说明当前网络无法访问 Docker Hub（或被代理/防火墙拦截）。

解决思路（任选其一）：

- 在 Docker Desktop 中配置网络代理（HTTP/HTTPS Proxy），或配置 Registry Mirror（镜像加速）
- 使用可访问的镜像仓库替代基础镜像（本项目已支持通过 build args 覆盖）

覆盖基础镜像示例（把镜像地址替换为你可访问的仓库）：

```bash
docker build -t myblog ^
  --build-arg NODE_IMAGE=your-registry/node:20-alpine ^
  --build-arg NGINX_IMAGE=your-registry/nginx:alpine ^
  .
```

### 方式 B：docker compose

```bash
docker compose up --build
```

同样默认映射到 `http://localhost:8080`。

> 如果需要替换基础镜像，可在项目根目录创建 `.env`：
>
> - `NODE_IMAGE=your-registry/node:20-alpine`
> - `NGINX_IMAGE=your-registry/nginx:alpine`

> 说明：本项目是 Astro 静态站，不需要 SPA fallback（无需 `_redirects` 的 `/* /index.html 200` 规则）。

### GitHub Actions 构建镜像（推荐）

如果你本机网络无法访问 Docker Hub（`docker.io`），推荐让 GitHub Actions 在云端构建镜像，并推送到 GHCR（GitHub Container Registry），服务器只负责拉取与运行。

项目已内置工作流：

- `.github/workflows/docker-image.yml`

工作流行为：

- 推送到 `main`：构建并推送 `ghcr.io/<owner>/<repo>:main`、`ghcr.io/<owner>/<repo>:sha-...`，并在默认分支推送 `latest`
- 打 `v*` tag（如 `v1.0.0`）：构建并推送 `ghcr.io/<owner>/<repo>:v1.0.0`

注意事项：

- 仓库 Settings 中确保 Actions 有权限发布 Packages（工作流已声明 `packages: write`）
- 镜像默认推送到：`ghcr.io/<owner>/<repo>`
- 若仓库为私有，服务器拉取需要登录 GHCR（需要一个具备 `read:packages` 权限的 Token）
- 你也可以把对应 Package 的可见性设置为 Public（若你希望免登录拉取）

### 服务器部署（拉取 GHCR 镜像）

方式 A：docker run（最简单）

```bash
docker login ghcr.io
docker pull ghcr.io/<owner>/<repo>:latest
docker run --rm -p 8080:80 ghcr.io/<owner>/<repo>:latest
```

方式 B：docker compose（推荐长期运行）

1) 修改 `docker-compose.ghcr.yml` 的 `image` 为你的实际镜像名  
2) 启动：

```bash
docker login ghcr.io
docker compose -f docker-compose.ghcr.yml up -d
```

如果镜像是私有的，需要一个 Token 来登录 GHCR：

```bash
docker login ghcr.io
```

Token 建议（任选其一）：

- Fine-grained PAT：对该仓库/组织授予 Packages Read 权限（以及需要时的仓库访问权限）
- Classic PAT：`read:packages`（私有仓库通常还需要 `repo`）

Compose 可选做法：用环境变量控制镜像名（避免写死在文件里）：

```bash
set BLOG_IMAGE=ghcr.io/<owner>/<repo>:latest
docker compose -f docker-compose.ghcr.yml up -d
```

## 本地自检清单（上线前）

建议逐项访问：

- `/` 首页（Hero/分区/工具卡片/最新文章/标签/订阅区）
- `/posts/` 文章列表（筛选/排序如已实现）
- `/posts/<slug>/` 任意文章详情（TOC/阅读时间/上一篇下一篇/相关文章/分享按钮/评论）
- `/tags/` 标签汇总页
- `/tags/<tag>/` 任意标签页
- `/tools/` 工具箱主页
- `/tools/ip` IP 查询（成功与失败提示）
- `/tools/base64` Base64 编解码 + 复制
- `/tools/cron` Cron 计算近 5 次
- 深色模式切换（页面无闪烁 + Giscus 主题同步）
