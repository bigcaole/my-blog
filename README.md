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

## “管理面板”式写作（无需本地改文件）

这个项目是 **Astro 静态站**：文章与配置最终都会变成构建产物（`dist/`），所以“想让公网看到更新”本质上仍然需要一次构建。

但你不需要在本地手动构建镜像/部署——可以用 GitHub 自带界面当作“管理面板”，由 Actions 自动把内容写入仓库并触发构建/部署。

本项目提供两种对小白更友好的方式：

### 方式 A：直接在 GitHub 网页编辑（最简单）

适合：改站名、改导航、改社交链接、改工具卡片、改文章等所有内容。

1) 打开 GitHub 仓库页面
2) 找到文件并点击编辑（铅笔按钮）
3) 修改后直接 Commit 到 `main`
4) 触发 Actions（构建镜像/部署），上线后即可看到更新

常用入口：

- 站点配置：`src/config/site.ts`
- 文章目录：`src/content/blog/`

### 方式 B：用 GitHub Issue 发布文章（更像 CMS）

适合：只想写文章，不想找文件路径。

已内置：

- Issue 模板：`.github/ISSUE_TEMPLATE/publish-post.md`
- 发布工作流：`.github/workflows/publish-post-from-issue.yml`

使用步骤：

1) 在 GitHub 仓库里先创建一个标签：`publish`（只需一次）
2) 新建 Issue，选择模板「发布文章（Markdown）」
3) 在 Issue 正文里直接写 Markdown（可不写 frontmatter）
4) 写完后给 Issue 加上标签 `publish`
5) Actions 会自动：
   - 把 Issue 正文保存为 `src/content/blog/*.md`
   - 提交并推送到仓库
   - 触发后续构建/部署流程

可选增强（不懂也没关系）：

- 你可以在正文里写两行让系统自动生成更准确的 frontmatter：
  - `Tags: A, B`（或 `标签：A, B`）
  - `Description: ...`（或 `摘要：...`）

> 重要：这套“管理面板”不会绕过构建，只是把“构建/部署”自动化了，你不需要在本地反复 build 镜像。

## Decap CMS 内容管理（/admin）

本项目已集成 Decap CMS：

- 管理后台地址：`/admin`
- 配置文件：`public/admin/config.yml`
- 文章目录：`src/content/blog/`
- 图片上传：`public/uploads`（访问路径 `/uploads`）

### 自定义后台入口（可选）

如果你希望把后台入口从 `/admin` 改成更“私密”的路径（例如 `/0emo-admin`），本项目支持通过环境变量生成一个同内容的后台入口（不破坏默认 `/admin`）：

- 环境变量：`ADMIN_PATH=0emo-admin`

行为：

- 仍保留 `/admin`
- 额外生成 `/0emo-admin`（内容与 `/admin` 相同）

本地运行示例：

```bash
set ADMIN_PATH=0emo-admin
npm run dev
```

线上（Cloudflare Pages / Docker 构建环境等）同理，只需要在构建环境注入 `ADMIN_PATH` 即可。

> 提醒：自定义路径不等于安全。真正的安全建议用 GitHub 授权 +（可选）OpenResty Basic Auth。

### 自动填充站点域名占位（可选）

`public/admin/config.yml` 里默认包含 `https://YOUR_DOMAIN` 占位。你可以通过环境变量自动替换（推荐）：

- `SITE_URL=https://你的域名`

该替换在 `predev/prebuild` 阶段自动执行。

### 本地体验（无需 OAuth）

Decap 的 `local_backend: true` 适合本地先体验编辑流程：

1) 启动站点：

```bash
npm run dev
```

2) 另开一个终端启动本地后端（Decap Proxy Server）：

```bash
npx decap-server
```

3) 打开：

- `http://localhost:4321/admin`

> 如果你更喜欢固定端口，也可以在本地后端启动参数中设置端口；默认一般是 `http://localhost:8081` 供 CMS 访问。

### 线上 GitHub 登录（需要 OAuth Proxy）

Decap CMS 的 GitHub backend 在线上需要 OAuth 服务端。这里提供一个最简单可用、适配 1Panel + OpenResty 的方案：**同域名反向代理到 OAuth Proxy 容器**。

#### 第 1 步：创建 GitHub OAuth App

在 GitHub 创建 OAuth App，并设置（把 `你的域名` 替换成实际值）：

- Homepage URL：`https://你的域名`
- Authorization callback URL：`https://你的域名/api/auth/callback`

创建完成后得到：

- Client ID
- Client Secret

#### 第 2 步：部署 OAuth Proxy（Docker）

项目已提供 `docker-compose.oauth-proxy.yml`，你只需要替换三个环境变量：

- `SESSION_SECRET`：一段足够长的随机字符串
- `GITHUB_KEY`：Client ID
- `GITHUB_SECRET`：Client Secret

启动：

```bash
docker compose -f docker-compose.oauth-proxy.yml up -d
```

该服务会在服务器上监听 `4000` 端口。

#### 第 3 步：OpenResty 反向代理（1Panel）

在你的站点反代中添加一条规则（关键点：带尾部 `/` 的转发，确保路径正确映射）：

- 路径前缀：`/api/auth/`
- 目标：`http://127.0.0.1:4000/`

反代后，这些路径会工作：

- `https://你的域名/api/auth/auth`  → OAuth 登录入口（对应上游 `/auth`）
- `https://你的域名/api/auth/callback` → OAuth 回调（对应上游 `/callback`）

#### 第 4 步：配置 CMS 的站点域名

打开 `public/admin/config.yml`，把以下占位替换成你的实际域名：

- `backend.base_url: "https://YOUR_DOMAIN/api/auth"`
- `site_url: "https://YOUR_DOMAIN"`

然后访问：

- `https://你的域名/admin`

即可 GitHub 登录 → 新建/编辑文章 → 发布 → 自动提交到 GitHub 仓库并触发你的部署流程。

### 站点设置也可在后台改（settings 集合）

Decap CMS 里提供了「设置」集合，会编辑单文件：

- `src/content/settings/site.json`

前端会优先读取该文件来覆盖默认的 `SITE` 配置（站名、slogan、描述、导航、社交链接、工具卡片、SEO 等），让你更像在“管理面板”里改前台元素。

> 说明：该设置文件是版本化的（会提交到 GitHub），所以修改后同样会触发构建/部署，线上才会生效。

### 安全提醒

- `/admin` 是公开可访问的登录入口，但只有完成 GitHub 授权的人才能提交内容
- 建议 OAuth App 与仓库权限只给你自己的 GitHub 账号使用
- 如果你希望更私密，可以在 OpenResty 对 `/admin` 加一层 Basic Auth（可选）

## 备份与恢复（管理面板内）

### 合理性分析（为什么需要备份？）

即使你使用 Decap CMS 在网页里写文章/改配置，本项目的本质仍是 **Git 驱动的静态站**：

- 文章/设置/上传图片最终会以文件形式提交到 GitHub 仓库
- 构建与部署会基于仓库内容生成 `dist/`（或镜像）

因此：

- **Git 历史本身就是最可靠的“备份”**（每一次提交都是一个可回滚的快照）
- “额外备份”主要是为了更方便地：
  - 创建一个清晰可识别的快照点（tag）
  - 导出一份压缩包用于离线保存
  - 用 PR 安全回滚（避免直接强推 main）

### 管理面板入口

已提供一个管理面板内的入口页面：

- `/admin/backup.html`

在 `/admin` 页面右下角会有一个「备份/恢复」按钮，点击即可打开备份与回滚说明与快捷入口。

### 一键备份（创建 tag + 生成压缩包）

工作流：`.github/workflows/backup-snapshot.yml`

做了什么：

- 创建 tag：`backup-YYYYMMDD-HHMMSS`
- 上传一份压缩包 artifact（包含文章/设置/上传图片等关键目录；artifact 默认会过期，但 tag 永久保留）

使用方法：

1) GitHub → Actions → `Backup Snapshot` → Run workflow
2) 可选填写备注
3) 运行完成后：
   - Tags 里会出现 `backup-...`
   - Actions 里会有一个可下载的 artifact

### 安全恢复（从备份 ref 创建 PR）

工作流：`.github/workflows/restore-from-ref.yml`

为什么这样设计：

- 不直接回滚/强推 `main`，而是从 ref 创建一个 restore 分支并发起 PR
- 你可以先审查改动，确认后再合并

使用方法：

1) GitHub → Actions → `Restore From Backup Ref (PR)` → Run workflow
2) `ref` 填：
   - 你要恢复的备份 tag（例如 `backup-20260209-010203`）
   - 或任意 commit SHA
3) Actions 会自动创建 PR；合并 PR 后触发正常构建/部署流程，线上即回滚到备份状态

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
