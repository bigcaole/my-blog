---
title: Astro Content Collections：更可控的 Markdown 写作
date: 2026-02-08
tags: [Astro, 教程]
description: 用 content collections 给文章加 schema 校验、草稿过滤与稳定路由。
draft: false
featured: true
---

Astro 的 content collections 适合“少依赖、强约束”的个人博客。

## 为什么要用 schema

你会立刻得到：

1. 标题/日期/标签等字段校验
2. `draft` 草稿过滤（生产构建不输出）
3. 数据统一，渲染更稳定

## 目录（TOC）

文章页可从 `post.render()` 拿到 `headings`，直接渲染目录。

