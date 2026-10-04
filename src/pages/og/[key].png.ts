/**
 * Social cards at /og/<key>.png. One per fixed page, topic, and post that
 * has no custom `image`. Keys: page keys from src/data/pages.ts,
 * `topic-<topic>`, `post-<slug>`, and `default`.
 */
import type { APIRoute, GetStaticPaths } from 'astro';
import { pages } from '../../data/pages';
import { topics } from '../../data/topics';
import { renderCard, type Card } from '../../lib/og';
import { getPosts, postNumbers, postSlug } from '../../lib/posts';

export const getStaticPaths = (async () => {
  const posts = await getPosts();
  const numbers = postNumbers(posts);
  const cards: { key: string; card: Card }[] = [
    { key: 'default', card: { eyebrow: 'jewei.net', title: 'Jewei Mak', subtitle: pages.home.card } },
    ...Object.entries(pages).map(([key, page]) => ({
      key,
      card: { eyebrow: page.eyebrow, title: key === 'home' ? 'Jewei Mak' : page.title, subtitle: page.card },
    })),
    ...Object.entries(topics).map(([key, topic]) => ({
      key: `topic-${key}`,
      card: { eyebrow: 'Topic', title: topic.name, subtitle: topic.description },
    })),
    ...posts
      .filter((post) => !post.data.image)
      .map((post) => ({
        key: `post-${postSlug(post)}`,
        card: {
          eyebrow: `No. ${numbers.get(post.id)} · Writing`,
          title: post.data.title,
          subtitle: post.data.description,
        },
      })),
  ];
  return cards.map(({ key, card }) => ({ params: { key }, props: { card } }));
}) satisfies GetStaticPaths;

export const GET: APIRoute = async ({ props }) => {
  const png = await renderCard(props.card as Card);
  return new Response(new Uint8Array(png), { headers: { 'Content-Type': 'image/png' } });
};
