import rss from '@astrojs/rss';
import { getPublishedPosts, postUrl } from '../support/blog';
import { siteName } from '../support/site';

export async function GET(context) {
  const posts = await getPublishedPosts();

  return rss({
    title: siteName,
    description: 'Personal blog by Jewei Mak',
    site: context.site,
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.pubDate,
      description: post.data.description,
      link: postUrl(post.id),
    })),
  });
}
