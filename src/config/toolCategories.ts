export type ToolCategoryKey = 'developer' | 'network' | 'text' | 'security' | 'design';

export const TOOL_CATEGORIES: {
  key: ToolCategoryKey;
  title: string;
  shortTitle: string;
  description: string;
  icon: string;
}[] = [
  {
    key: 'developer',
    title: '开发者与编码',
    shortTitle: '开发',
    description: 'JSON、URL、时间戳、正则、JWT、Cron 与代码格式处理。',
    icon: 'code',
  },
  {
    key: 'network',
    title: '网络与站长',
    shortTitle: '网络',
    description: 'IP、HTTP Header、DNS、User-Agent 与服务器配置生成。',
    icon: 'network',
  },
  {
    key: 'text',
    title: '文本与数据',
    shortTitle: '文本',
    description: '差异对比、字数统计、命名转换和排版假文生成。',
    icon: 'file-text',
  },
  {
    key: 'security',
    title: '安全与密码学',
    shortTitle: '安全',
    description: '纯前端 Hash、密码、Bcrypt 与 RSA 密钥工具。',
    icon: 'shield',
  },
  {
    key: 'design',
    title: '前端与设计',
    shortTitle: '设计',
    description: '颜色、渐变、二维码与图片 Base64 转换。',
    icon: 'palette',
  },
];

export function getToolCategory(key?: string) {
  return TOOL_CATEGORIES.find((item) => item.key === key) ?? TOOL_CATEGORIES[0];
}
