export const siteName = 'jewei.toString()';
export const siteUrl = 'https://jewei.net';
export const twitterHandle = '@jewei';
export const authorName = 'Jewei Mak';
export const authorEmail = 'jewei@duck.com';
export const siteDescription =
  'Jewei Mak builds backend systems, developer tools, and payment infrastructure, and writes about software architecture and AI-assisted engineering.';
export const authorProfiles = ['https://github.com/jewei', 'https://x.com/jewei'];
export const personId = `${siteUrl}/#person`;

export function pageTitle(title: string): string {
  return title === siteName ? siteName : `${title} — ${siteName}`;
}
