import { SITE } from '../config/site';
import { getAllPosts } from '../utils/posts';

function xmlEscape(s: string) {
  return s
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

export async function GET() {
  const posts = await getAllPosts();
  const tags = new Set<string>();
  for (const p of posts) for (const t of p.data.tags) tags.add(t);

  const toolRoutes = SITE.tools
    .filter((t) => t.status === 'active')
    .map((t) => `/tools/${t.slug}/`);

  const staticRoutes = ['/', '/posts/', '/tags/', '/tools/', '/about/', ...toolRoutes];

  const urls: Array<{ loc: string; lastmod?: string }> = [];
  const now = new Date().toISOString();

  for (const r of staticRoutes) {
    urls.push({ loc: new URL(r, SITE.url).toString(), lastmod: now });
  }

  for (const p of posts) {
    urls.push({
      loc: new URL(`/posts/${p.slug}/`, SITE.url).toString(),
      lastmod: p.data.date.toISOString(),
    });
  }

  for (const t of tags) {
    urls.push({
      loc: new URL(`/tags/${encodeURIComponent(t)}/`, SITE.url).toString(),
      lastmod: now,
    });
  }

  const body =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    urls
      .map((u) => {
        const loc = xmlEscape(u.loc);
        const lastmod = u.lastmod ? `<lastmod>${xmlEscape(u.lastmod)}</lastmod>` : '';
        return `  <url><loc>${loc}</loc>${lastmod}</url>`;
      })
      .join('\n') +
    `\n</urlset>\n`;

  return new Response(body, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
}
