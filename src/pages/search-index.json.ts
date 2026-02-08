import { getAllPosts } from '../utils/posts';

export async function GET() {
  const posts = await getAllPosts();
  const items = posts.map((p) => ({
    title: p.data.title,
    description: p.data.description,
    tags: p.data.tags,
    url: `/posts/${p.slug}/`,
    date: p.data.date.toISOString(),
  }));

  return new Response(JSON.stringify(items), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'public, max-age=0, must-revalidate',
    },
  });
}

