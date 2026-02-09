export type NavItem = { label: string; href: string; icon?: string };
export type ToolItem = {
  title: string;
  slug: string;
  description?: string;
  icon?: string;
  status?: 'live' | 'coming-soon';
};

export type SiteSettingsFile = {
  siteName?: string;
  slogan?: string;
  description?: string;
  nav?: { label: string; href: string }[];
  social?: { github?: string; telegram?: string; x?: string; email?: string };
  tools?: { title: string; slug: string; description?: string; status?: 'live' | 'coming-soon'; iconKey?: string }[];
  seo?: { twitterHandle?: string; ogImage?: string };
};

export type SiteConfig = {
  name: string;
  slogan: string;
  description: string;
  url: string;
  locale: string;
  author: { name: string };
  nav: NavItem[];
  social: { github?: string; telegram?: string; x?: string; email?: string };
  tools: ToolItem[];
  seo: { ogImage?: string; twitterHandle?: string };
  giscus: {
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
    themeLight: string;
    themeDark: string;
    lang: string;
    loading: 'lazy' | 'eager';
  };
  subscribe: {
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
};

const defaults: SiteConfig = {
  name: '极简工具站',
  slogan: '极简但有层次',
  description: '一个极简 + 工具型的个人博客：教程 / 经验 / 随笔 / 综合。',
  // 必须是合法 URL，否则构建期生成 canonical / og:url 时会直接失败
  // 请改成你的实际域名，例如：https://blog.example.com
  url: 'https://example.com',
  locale: 'zh-CN',
  author: { name: '0emo' },
  nav: [
    { label: '首页', href: '/', icon: 'home' },
    { label: '文章', href: '/posts/', icon: 'posts' },
    { label: '标签', href: '/tags/', icon: 'tag' },
    { label: '工具箱', href: '/tools/', icon: 'tools' },
    { label: '关于', href: '/about/', icon: 'info' },
  ],
  social: {
    github: '',
    telegram: '',
    x: '',
    email: '',
  },
  tools: [
    { title: 'IP 信息查询', slug: 'ip', description: '查询国家/城市/ASN/ISP', icon: 'search', status: 'live' },
    { title: 'Base64', slug: 'base64', description: 'UTF-8 编解码 + 复制', icon: 'sparkles', status: 'live' },
    { title: 'Cron', slug: 'cron', description: '计算近 5 次执行时间', icon: 'clock', status: 'live' },
  ],
  seo: {
    ogImage: '',
    twitterHandle: '',
  },
  giscus: {
    enabled: false,
    repo: 'OWNER/REPO',
    repoId: 'REPO_ID',
    category: 'General',
    categoryId: 'CATEGORY_ID',
    mapping: 'pathname',
    strict: '0',
    reactionsEnabled: '1',
    emitMetadata: '0',
    inputPosition: 'bottom',
    themeLight: 'light',
    themeDark: 'dark',
    lang: 'zh-CN',
    loading: 'lazy',
  },
  subscribe: {
    rssPath: '/rss.xml',
    email: {
      enabled: true,
      title: '邮件订阅',
      description: '订阅更新（占位表单，可在配置中接入真实服务）。',
      formAction: '',
      emailName: 'email',
      placeholder: 'you@example.com',
      buttonText: '订阅',
      note: '提示：这只是占位配置，你可以在设置中接入真实表单服务。',
    },
  },
};

function pickString(v: unknown): string | undefined {
  if (typeof v !== 'string') return undefined;
  const s = v.trim();
  return s ? s : undefined;
}

function mergeSite(defaultSite: SiteConfig, s: SiteSettingsFile | null | undefined): SiteConfig {
  if (!s) return defaultSite;

  const next: SiteConfig = JSON.parse(JSON.stringify(defaultSite)) as SiteConfig;

  next.name = pickString(s.siteName) ?? next.name;
  next.slogan = pickString(s.slogan) ?? next.slogan;
  next.description = pickString(s.description) ?? next.description;

  if (Array.isArray(s.nav) && s.nav.length) {
    next.nav = s.nav
      .filter((x) => x && typeof x.label === 'string' && typeof x.href === 'string')
      .map((x) => ({ label: x.label, href: x.href }));
  }

  if (s.social && typeof s.social === 'object') {
    next.social = {
      github: pickString(s.social.github) ?? next.social.github,
      telegram: pickString(s.social.telegram) ?? next.social.telegram,
      x: pickString(s.social.x) ?? next.social.x,
      email: pickString(s.social.email) ?? next.social.email,
    };
  }

  if (Array.isArray(s.tools) && s.tools.length) {
    next.tools = s.tools
      .filter((t) => t && typeof t.title === 'string' && typeof t.slug === 'string')
      .map((t) => ({
        title: t.title,
        slug: t.slug,
        description: pickString(t.description) ?? '',
        status: t.status === 'coming-soon' ? 'coming-soon' : 'live',
        icon: pickString(t.iconKey) ?? '',
      }));
  }

  if (s.seo && typeof s.seo === 'object') {
    next.seo = {
      ogImage: pickString(s.seo.ogImage) ?? next.seo.ogImage,
      twitterHandle: pickString(s.seo.twitterHandle) ?? next.seo.twitterHandle,
    };
  }

  return next;
}

// Settings override:
// - The file exists in-repo and is edited via Decap CMS.
// - Keep this module free of Node-only APIs to reduce build fragility in Vite/SSR contexts.
// @ts-expect-error - JSON import is handled by Astro/Vite.
import settings from '../content/settings/site.json';

// Keep backward-compatible import style: `import { SITE } from '../config/site'`
export const SITE: SiteConfig = mergeSite(defaults, settings as SiteSettingsFile);
