import { getImage } from 'astro:assets';
import type { ImageMetadata } from 'astro';
import defaultOgImage from '../assets/og-image.jpg';

export interface SocialImage {
  url: string;
  width: number;
  height: number;
}

export async function resolveSocialImage(
  image: ImageMetadata | undefined,
  siteUrl: string,
): Promise<SocialImage> {
  const optimized = await getImage({
    src: image ?? defaultOgImage,
    layout: 'none',
    width: 1200,
    format: 'jpg',
  });

  return {
    url: new URL(optimized.src, siteUrl).href,
    width: optimized.attributes.width ?? 1200,
    height: optimized.attributes.height ?? 630,
  };
}
