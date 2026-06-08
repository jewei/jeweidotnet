export const siteName = 'jewei.toString()';
export const siteUrl = 'https://jewei.net';
export const twitterHandle = '@jewei';
export const authorName = 'Jewei Mak';

export function pageTitle(title: string): string {
  return title === siteName ? siteName : `${title} — ${siteName}`;
}
