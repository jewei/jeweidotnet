import { displayUrl, personId, site, websiteId } from '../site.config';

/** Absolute URL on the canonical domain. */
export function absolute(path: string): string {
  return new URL(path, site.url).href;
}

/**
 * Document title. Adds the author suffix while the result stays within
 * the ~65 characters search results show; long titles stand alone.
 */
export function documentTitle(title: string): string {
  const withSuffix = `${title} · ${site.author}`;
  return withSuffix.length <= 65 ? withSuffix : title;
}

type Json = Record<string, unknown>;

export function personSchema(extra: Json = {}): Json {
  return {
    '@type': 'Person',
    '@id': personId,
    name: site.author,
    alternateName: site.name,
    url: absolute('/about/'),
    jobTitle: site.jobTitle,
    email: `mailto:${site.email}`,
    sameAs: [site.profiles.github, site.profiles.x],
    knowsAbout: site.knowsAbout,
    ...extra,
  };
}

export function websiteSchema(): Json {
  return {
    '@type': 'WebSite',
    '@id': websiteId,
    name: site.name,
    alternateName: [site.author, displayUrl(site.url)],
    url: absolute('/'),
    description: site.description,
    inLanguage: 'en',
    publisher: { '@id': personId },
  };
}

export interface Crumb {
  name: string;
  path: string;
}

export function breadcrumbSchema(crumbs: Crumb[]): Json {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: absolute(crumb.path),
    })),
  };
}

/** Wrap one or more nodes in a single JSON-LD graph. */
export function graph(...nodes: Json[]): Json {
  return { '@context': 'https://schema.org', '@graph': nodes };
}
