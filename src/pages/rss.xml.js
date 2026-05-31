import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
  const posts = (await getCollection('blog', ({ data }) => !data.draft))
    .sort((a, b) => b.data.pubDate - a.data.pubDate);

  return rss({
    title: 'jewei.net',
    description: 'Personal blog by Jewei Mak',
    site: context.site,
    items: posts.map(post => ({
      title: post.data.title,
      pubDate: post.data.pubDate,
      description: post.data.description,
      link: `/${post.id.replace(/\.mdx?$/, '')}/`,
    })),
  });
}
