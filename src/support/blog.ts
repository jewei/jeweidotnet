import { getCollection } from 'astro:content';
import type { CollectionEntry } from 'astro:content';

export const tagColors = [
  'bg-primary-fixed text-on-primary-fixed',
  'bg-secondary-fixed text-on-secondary-fixed',
  'bg-tertiary-fixed text-on-tertiary-fixed',
  'bg-surface-variant text-on-surface-variant',
] as const;

export function tagToSlug(tag: string): string {
  return tag.toLowerCase().replace(/\s+/g, '-');
}

export function postUrl(id: string): string {
  return `/${id.replace(/\.mdx?$/, '')}/`;
}

export const shortDateFormatter = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
});

export const longDateFormatter = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
});

export async function getPublishedPosts(): Promise<CollectionEntry<'blog'>[]> {
  return (await getCollection('blog', ({ data }) => !data.draft)).sort(
    (a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime(),
  );
}

export function hasCodeBlocks(body: string | undefined): boolean {
  return body?.includes('```') ?? false;
}

export function getReadingTime(body: string | undefined): number {
  if (!body) return 1;

  // Strip non-prose noise so reading time reflects readable words, not syntax:
  // fenced/inline code and MDX import/export statements.
  const prose = body
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`[^`]*`/g, '')
    .replace(/^\s*(?:import|export)\s.*$/gm, '');

  const words = prose.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

export function getTagCloud(posts: CollectionEntry<'blog'>[]): [string, number][] {
  const tagCounts = new Map<string, number>();
  for (const post of posts) {
    for (const tag of post.data.tags) {
      tagCounts.set(tag, (tagCounts.get(tag) ?? 0) + 1);
    }
  }
  return [...tagCounts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
}

export function getAllTags(posts: CollectionEntry<'blog'>[]): [string, string][] {
  const tagSet = new Map<string, string>();
  for (const post of posts) {
    for (const tag of post.data.tags) {
      const slug = tagToSlug(tag);
      if (!tagSet.has(slug)) tagSet.set(slug, tag);
    }
  }
  return [...tagSet.entries()].sort((a, b) => a[1].localeCompare(b[1]));
}

export async function getPostsByTag(): Promise<Map<string, CollectionEntry<'blog'>[]>> {
  const posts = await getPublishedPosts();
  const tagMap = new Map<string, CollectionEntry<'blog'>[]>();

  for (const post of posts) {
    for (const tag of post.data.tags) {
      const key = tagToSlug(tag);
      if (!tagMap.has(key)) tagMap.set(key, []);
      tagMap.get(key)!.push(post);
    }
  }

  return tagMap;
}
