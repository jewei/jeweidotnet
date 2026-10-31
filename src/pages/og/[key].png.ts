/**
 * Social cards at /og/<key>.png. One per fixed page, topic, and post that
 * has no custom `image`. The list and the rendering live in src/lib/og.ts;
 * pages link a card with `ogImage(key)`, which adds a content hash.
 */
import type { APIRoute, GetStaticPaths, InferGetStaticPropsType } from 'astro';
import { cardList, cardPng } from '../../lib/og';

export const getStaticPaths = (async () =>
  (await cardList()).map(({ key, card }) => ({
    params: { key },
    props: { key, card },
  }))) satisfies GetStaticPaths;

export const GET: APIRoute<InferGetStaticPropsType<typeof getStaticPaths>> = async ({ props }) => {
  const png = await cardPng(props.key, props.card);
  return new Response(new Uint8Array(png), { headers: { 'Content-Type': 'image/png' } });
};
