import { getCollection, type CollectionEntry } from 'astro:content';
import { site } from '../site.config';

export type Post = CollectionEntry<'blog'>;

/**
 * Publication order, oldest first. Posts on the same date sort by id: the
 * collection's own order can change between builds, and so would the
 * catalogue numbers and the newer/older links.
 */
function oldestFirst(a: Post, b: Post): number {
  return a.data.pubDate.getTime() - b.data.pubDate.getTime() || a.id.localeCompare(b.id);
}

/** Published posts, newest first. Drafts never leave this function. */
export async function getPosts(): Promise<Post[]> {
  const posts = await getCollection('blog', ({ data }) => import.meta.env.DEV || !data.draft);
  return posts.sort((a, b) => oldestFirst(b, a));
}

export function postSlug(post: Post): string {
  return post.id.replace(/\.mdx?$/, '');
}

export function postUrl(post: Post): string {
  return `/${postSlug(post)}/`;
}

/**
 * Catalogue number: the post's position in publication order, oldest first.
 * Shown as "No. 007" in lists and article headers.
 */
export function postNumbers(posts: Post[]): Map<string, string> {
  const chronological = [...posts].sort(oldestFirst);
  return new Map(chronological.map((post, index) => [post.id, String(index + 1).padStart(3, '0')]));
}

export function lastModified(post: Post): Date {
  return post.data.updatedDate ?? post.data.pubDate;
}

/** Words per minute for reading time. Code and MDX statements do not count. */
export function readingMinutes(body: string | undefined): number {
  if (!body) return 1;
  const prose = body
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`[^`]*`/g, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/^\s*(?:import|export)\s.*$/gm, '');
  const words = prose.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}

const shortDate = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
  timeZone: site.timeZone,
});

const longDate = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  timeZone: site.timeZone,
});

const yearOnly = new Intl.DateTimeFormat('en-US', { year: 'numeric', timeZone: site.timeZone });

export const formatDate = {
  short: (date: Date) => shortDate.format(date),
  long: (date: Date) => longDate.format(date),
  year: (date: Date) => Number(yearOnly.format(date)),
};

const stopWords = new Set(
  'about after again build building from have into more software that their this using what when with your'.split(
    ' ',
  ),
);

function terms(post: Post): Set<string> {
  return new Set(
    `${post.data.title} ${post.data.description}`
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, ' ')
      .split(' ')
      .filter((term) => term.length >= 4 && !stopWords.has(term)),
  );
}

/** Rank by shared topics, then shared title and description terms, then recency. */
export function relatedPosts(post: Post, posts: Post[], limit = 3): Post[] {
  const tags = new Set(post.data.tags);
  const own = terms(post);
  return posts
    .filter((candidate) => candidate.id !== post.id)
    .map((candidate) => ({
      candidate,
      score:
        candidate.data.tags.filter((tag) => tags.has(tag)).length * 10 +
        [...terms(candidate)].filter((term) => own.has(term)).length,
    }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score || oldestFirst(b.candidate, a.candidate))
    .slice(0, limit)
    .map(({ candidate }) => candidate);
}

/** Topic keys with post counts, most used first. */
export function topicCounts(posts: Post[]): [string, number][] {
  const counts = new Map<string, number>();
  for (const post of posts) for (const tag of post.data.tags) counts.set(tag, (counts.get(tag) ?? 0) + 1);
  return [...counts].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
}

export function groupByYear(posts: Post[]): [number, Post[]][] {
  const years = new Map<number, Post[]>();
  for (const post of posts) {
    const year = formatDate.year(post.data.pubDate);
    years.set(year, [...(years.get(year) ?? []), post]);
  }
  return [...years];
}
