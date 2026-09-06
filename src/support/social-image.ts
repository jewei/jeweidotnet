import { getImage } from 'astro:assets';
import type { ImageMetadata } from 'astro';
import defaultOgImage from '../assets/og-image-editorial.jpg';

export interface SocialImage {
  url: string;
  width: number;
  height: number;
}

export async function resolveSocialImage(
  image: ImageMetadata | undefined,
  siteUrl: string,
): Promise<SocialImage> {
  const source = image ?? defaultOgImage;
  const socialAspectRatio = 1200 / 630;
  const availableWidth = Math.min(1200, source.width);
  const availableHeight = Math.min(630, source.height);
  const isWiderThanTarget = availableWidth / availableHeight > socialAspectRatio;
  const width = isWiderThanTarget
    ? Math.round(availableHeight * socialAspectRatio)
    : availableWidth;
  const height = isWiderThanTarget
    ? availableHeight
    : Math.round(availableWidth / socialAspectRatio);

  const optimized = await getImage({
    src: source,
    layout: 'none',
    width,
    height,
    fit: 'cover',
    position: 'center',
    format: 'jpg',
  });

  return {
    url: new URL(optimized.src, siteUrl).href,
    width: optimized.attributes.width ?? width,
    height: optimized.attributes.height ?? height,
  };
}
