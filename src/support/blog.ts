import { getCollection } from 'astro:content';
import type { CollectionEntry } from 'astro:content';

export const tagColors = [
  'bg-primary-fixed text-on-primary-fixed',
  'bg-secondary-fixed text-on-secondary-fixed',
  'bg-tertiary-fixed text-on-tertiary-fixed',
  'bg-surface-variant text-on-surface-variant',
] as const;

export function tagToSlug(tag: string): string {
  return (
    tag
      .normalize('NFKD')
      .toLowerCase()
      .replace(/[\u0300-\u036f]/g, '')
      // Spell out symbols that distinguish tags, so "c++" / "c#" / "c" don't
      // collapse into the same slug (and URL).
      .replace(/\+/g, '-plus')
      .replace(/#/g, '-sharp')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'tag'
  );
}

const tagDisplayNames: Record<string, string> = {
  ai: 'AI',
  cloudflare: 'Cloudflare',
  macos: 'macOS',
  php: 'PHP',
  swift: 'Swift',
};

export function formatTagName(tag: string): string {
  const slug = tagToSlug(tag);
  if (tagDisplayNames[slug]) return tagDisplayNames[slug];

  return tag
    .replace(/[-_]+/g, ' ')
    .replace(/\b[a-z]/g, (letter) => letter.toUpperCase());
}

export function postUrl(id: string): string {
  return `/${id.replace(/\.mdx?$/, '')}/`;
}

export const shortDateFormatter = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
  timeZone: 'Asia/Kuala_Lumpur',
});

export const longDateFormatter = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  timeZone: 'Asia/Kuala_Lumpur',
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

const relatedPostStopWords = new Set([
  'about',
  'after',
  'again',
  'build',
  'building',
  'from',
  'have',
  'into',
  'more',
  'software',
  'that',
  'their',
  'this',
  'using',
  'what',
  'when',
  'with',
  'your',
]);

function postTerms(post: CollectionEntry<'blog'>): Set<string> {
  const text = `${post.data.title} ${post.data.description}`
    .normalize('NFKD')
    .toLowerCase()
    .replace(/[\u0300-\u036f]/g, ' ')
    .replace(/[^a-z0-9]+/g, ' ');

  return new Set(
    text
      .split(/\s+/)
      .filter((term) => term.length >= 4 && !relatedPostStopWords.has(term)),
  );
}

/**
 * Rank related writing by shared topics first, then by meaningful title and
 * description terms. Publication date resolves ties and supplies a sensible
 * fallback for posts with a unique topic.
 */
export function getRelatedPosts(
  post: CollectionEntry<'blog'>,
  posts: CollectionEntry<'blog'>[],
  limit = 3,
): CollectionEntry<'blog'>[] {
  const tags = new Set(post.data.tags);
  const terms = postTerms(post);

  return posts
    .filter((candidate) => candidate.id !== post.id)
    .map((candidate) => {
      const sharedTags = candidate.data.tags.filter((tag) => tags.has(tag)).length;
      const sharedTerms = [...postTerms(candidate)].filter((term) => terms.has(term)).length;

      return {
        post: candidate,
        score: sharedTags * 10 + sharedTerms,
      };
    })
    .filter(({ score }) => score > 0)
    .sort(
      (a, b) =>
        b.score - a.score || b.post.data.pubDate.getTime() - a.post.data.pubDate.getTime(),
    )
    .slice(0, Math.max(0, limit))
    .map(({ post: candidate }) => candidate);
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
