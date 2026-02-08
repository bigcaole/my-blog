import { getCollection } from 'astro:content';

export async function getAllPosts() {
  const posts = await getCollection('blog', ({ data }) =>
    import.meta.env.DEV ? true : !data.draft,
  );

  return posts.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

export function getTagCounts(posts: Array<{ data: { tags: string[] } }>) {
  const counts = new Map<string, number>();
  for (const p of posts) {
    for (const t of p.data.tags ?? []) counts.set(t, (counts.get(t) ?? 0) + 1);
  }
  return counts;
}

export function getFeaturedPosts<T extends { data: { featured?: boolean } }>(posts: T[]) {
  return posts.filter((p) => !!p.data.featured);
}

export function pickRelatedPosts<T extends { slug: string; data: { tags: string[] } }>(
  all: T[],
  current: T,
  limit = 3,
) {
  const currentTags = new Set(current.data.tags ?? []);
  return all
    .filter((p) => p.slug !== current.slug)
    .map((p) => ({
      p,
      score: (p.data.tags ?? []).reduce((acc, t) => acc + (currentTags.has(t) ? 1 : 0), 0),
    }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((x) => x.p);
}
