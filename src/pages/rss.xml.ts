import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { site } from '../site.config';
import { topicName } from '../data/topics';
import { getPosts, postUrl } from '../lib/posts';

export async function GET(context: APIContext) {
  const posts = (await getPosts()).filter((post) => !post.data.draft);
  const feedUrl = new URL('/rss.xml', site.url).href;

  return rss({
    title: `${site.name} — writing by ${site.author}`,
    description: site.description,
    site: context.site ?? site.url,
    trailingSlash: true,
    xmlns: { atom: 'http://www.w3.org/2005/Atom' },
    customData: [
      `<language>${site.language}</language>`,
      `<managingEditor>${site.email} (${site.author})</managingEditor>`,
      `<atom:link href="${feedUrl}" rel="self" type="application/rss+xml" />`,
      `<lastBuildDate>${new Date().toUTCString()}</lastBuildDate>`,
    ].join(''),
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      link: postUrl(post),
      categories: post.data.tags.map(topicName),
      author: `${site.email} (${site.author})`,
    })),
  });
}
