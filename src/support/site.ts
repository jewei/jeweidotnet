export const siteName = 'jewei.toString()';

export function pageTitle(title: string): string {
  return title === siteName ? siteName : `${title} — ${siteName}`;
}
