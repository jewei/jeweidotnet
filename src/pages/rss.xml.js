import rss from '@astrojs/rss';
import { getPublishedPosts, postUrl } from '../support/blog';
import { authorEmail, authorName, siteDescription, siteName } from '../support/site';

export async function GET(context) {
  const posts = await getPublishedPosts();

  return rss({
    title: siteName,
    description: siteDescription,
    site: context.site,
    xmlns: {
      atom: 'http://www.w3.org/2005/Atom',
    },
    customData: [
      '<language>en</language>',
      `<managingEditor>${authorEmail} (${authorName})</managingEditor>`,
      `<atom:link href="${new URL('/rss.xml', context.site).href}" rel="self" type="application/rss+xml" />`,
    ].join(''),
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.pubDate,
      description: post.data.description,
      link: postUrl(post.id),
      categories: post.data.tags,
      author: `${authorEmail} (${authorName})`,
    })),
  });
}
