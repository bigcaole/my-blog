import rss from '@astrojs/rss';
import { SITE } from '../config/site';
import { getAllPosts } from '../utils/posts';

export async function GET() {
  const posts = await getAllPosts();
  return rss({
    title: SITE.name,
    description: SITE.description,
    site: SITE.url,
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.date,
      description: post.data.description,
      link: `/posts/${post.slug}/`,
    })),
  });
}

