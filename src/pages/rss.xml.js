import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { postUrl } from '../support/blog';

export async function GET(context) {
  const posts = (await getCollection('blog', ({ data }) => !data.draft))
    .sort((a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime());

  return rss({
    title: 'jewei.net',
    description: 'Personal blog by Jewei Mak',
    site: context.site,
    items: posts.map(post => ({
      title: post.data.title,
      pubDate: post.data.pubDate,
      description: post.data.description,
      link: postUrl(post.id),
    })),
  });
}
