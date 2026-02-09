---
name: "发布文章（Markdown）"
about: "用 GitHub Issue 作为“管理面板”：写 Markdown → 打 publish 标签 → 自动生成文章文件并发布"
title: "在这里写文章标题"
labels: []
---

> 使用方法：
> 1) 在正文里直接写 Markdown（可以不写 frontmatter）
> 2) 写完后给这个 Issue 加上标签：`publish`
> 3) Actions 会自动把正文保存为 `src/content/blog/*.md` 并提交到仓库，然后触发部署流程

可选：你也可以在正文最开头写 frontmatter（如果你更熟悉这种方式）：

```md
---
title: 文章标题（可省略，默认用 Issue 标题）
date: 2026-02-09
tags: [Astro, 工具]
description: 一句话摘要
draft: false
featured: false
---
```

可选：不写 frontmatter 时，工作流会自动生成，并支持两行约定：

- `Tags: A, B`（或 `标签：A, B`）
- `Description: ...`（或 `摘要：...`）

---

在这里开始写正文（Markdown）：

## 这一篇写什么？

写下你想记录的内容。你可以包含：

- 列表
- 引用
- 表格
- 代码块

```ts
export function hello() {
  return "hello";
}
```

