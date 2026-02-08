export type NavItem = {
  label: string;
  href: string;
  icon?: IconName;
};

export type SocialLinks = Partial<{
  github: string;
  telegram: string;
  x: string;
  weibo: string;
  email: string;
}>;

export type SeoConfig = {
  ogImage: string;
  twitterHandle: string;
};

export type GiscusConfig = {
  enabled: boolean;
  repo: string;
  repoId: string;
  category: string;
  categoryId: string;
  mapping: 'pathname' | 'url' | 'title' | 'og:title' | 'specific' | 'number';
  strict: '0' | '1';
  reactionsEnabled: '0' | '1';
  emitMetadata: '0' | '1';
  inputPosition: 'top' | 'bottom';
  lang: string;
  loading: 'lazy' | 'eager';
  themeLight: string;
  themeDark: string;
};

export type SubscribeConfig = {
  rssPath: string;
  email: {
    enabled: boolean;
    title: string;
    description: string;
    formAction: string;
    emailName: string;
    placeholder: string;
    buttonText: string;
    note: string;
  };
};

export type ToolStatus = 'active' | 'coming_soon';
export type ToolItem = {
  title: string;
  slug: string;
  description: string;
  icon: IconName;
  status: ToolStatus;
};

// Keep this list in sync with `src/components/ui/Icon.astro`
export type IconName =
  | 'home'
  | 'posts'
  | 'tags'
  | 'tools'
  | 'about'
  | 'search'
  | 'menu'
  | 'github'
  | 'telegram'
  | 'x'
  | 'weibo'
  | 'mail'
  | 'sun'
  | 'moon'
  | 'monitor'
  | 'arrow-right'
  | 'arrow-left'
  | 'sparkles'
  | 'clock'
  | 'hash'
  | 'terminal'
  | 'wand'
  | 'calendar'
  | 'globe'
  | 'binary'
  | 'repeat';

export const SITE = {
  name: '我的极简博客',
  slogan: '极简但有层次 · 工具型个人站点',
  description: '低频更新：教程 / 经验 / 随笔 / 综合。以“可复用、可检索、可长期维护”为目标。',
  url: 'https://example.com',
  locale: 'zh-CN',
  author: {
    name: 'Your Name',
  },

  seo: {
    ogImage: '',
    twitterHandle: '',
  } satisfies SeoConfig,

  nav: [
    { label: '首页', href: '/', icon: 'home' },
    { label: '文章', href: '/posts/', icon: 'posts' },
    { label: '标签', href: '/tags/', icon: 'tags' },
    { label: '工具箱', href: '/tools/', icon: 'tools' },
    { label: '关于', href: '/about/', icon: 'about' },
  ] satisfies NavItem[],

  social: {
    github: 'https://github.com/yourname',
    telegram: 'https://t.me/yourname',
    x: 'https://x.com/yourname',
    weibo: '',
    email: '',
  } satisfies SocialLinks,

  tools: [
    {
      title: 'IP 信息查询',
      slug: 'ip',
      description: '查询本机出口 IP 或指定 IP 的国家 / 城市 / ASN / ISP。',
      icon: 'globe',
      status: 'active',
    },
    {
      title: 'Base64 编码 / 解码',
      slug: 'base64',
      description: '支持 UTF-8 文本，附复制按钮与友好错误提示。',
      icon: 'binary',
      status: 'active',
    },
    {
      title: 'Cron 下一次执行',
      slug: 'cron',
      description: '输入 5 段 cron 表达式，展示本地时区近 5 次执行时间。',
      icon: 'repeat',
      status: 'active',
    },
    {
      title: 'CIDR 计算器',
      slug: 'cidr',
      description: '子网划分 / 掩码 / 地址范围（开发中）。',
      icon: 'terminal',
      status: 'coming_soon',
    },
    {
      title: '端口检测',
      slug: 'port-check',
      description: '常用端口连通性检测（开发中）。',
      icon: 'wand',
      status: 'coming_soon',
    },
  ] satisfies ToolItem[],

  giscus: {
    enabled: true,
    repo: 'OWNER/REPO',
    repoId: 'REPO_ID',
    category: 'General',
    categoryId: 'CATEGORY_ID',
    mapping: 'pathname',
    strict: '0',
    reactionsEnabled: '1',
    emitMetadata: '0',
    inputPosition: 'top',
    lang: 'zh-CN',
    loading: 'lazy',
    themeLight: 'light',
    themeDark: 'dark_dimmed',
  } satisfies GiscusConfig,

  subscribe: {
    rssPath: '/rss.xml',
    email: {
      enabled: true,
      title: '订阅更新',
      description: '获取更新：RSS / 邮件订阅（可嵌入表单）。',
      formAction: '',
      emailName: 'email',
      placeholder: 'you@example.com',
      buttonText: '订阅',
      note: '把表单 action 配到你的邮件服务商即可（例如 Buttondown / Mailchimp / 自建）。',
    },
  } satisfies SubscribeConfig,
};

