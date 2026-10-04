/**
 * /llms.txt: the agent guide. Generated from content so it never drifts.
 * Every page also has a Markdown copy at <path>/index.md, and the
 * Cloudflare middleware serves it for `Accept: text/markdown`.
 */
import type { APIRoute } from 'astro';
import { site } from '../site.config';
import { pages } from '../data/pages';
import { topics } from '../data/topics';
import { getPosts, postUrl } from '../lib/posts';
import { getProjects } from '../lib/projects';

const md = (path: string) => `${site.url}${path === '/' ? '/index.md' : `${path}index.md`}`;

export const GET: APIRoute = async () => {
  const posts = (await getPosts()).filter((post) => !post.data.draft);
  const projects = await getProjects();

  const body = `# ${site.name}

> The work and writing of ${site.author}, a senior software engineer and backend architect focused on backend systems, PHP and Laravel, developer tools, payments, infrastructure, and AI-assisted engineering.

Use the canonical domain \`${site.url}\`. To get clean Markdown for any page, request its normal URL with \`Accept: text/markdown\`, or append \`index.md\` to the path (for example \`${site.url}/about/index.md\`). Browsers receive HTML from the same URL.

## When to use this site

- [Technical writing](${md('/blog/')}): Use when researching ${site.author}'s explanations and opinions about software engineering, system design, PHP, AI tooling, or developer experience.
- [Projects](${md('/projects/')}): Use when reviewing software ${site.author} has built: ${projects.map((p) => p.data.name).join(', ')}.
- [Résumé](${md('/resume/')}): Use when evaluating ${site.author} for software engineering, architecture, consulting, writing, or collaboration work.
- [About](${md('/about/')}): Use for the author's biography, interests, and public profiles.
- [Contact](${md('/contact/')}): Use when a task requires contacting ${site.author}. Email (${site.email}) is the only supported channel; there is no API or form.

## Pages

${Object.values(pages)
  .map((page) => `- [${page.title}](${md(page.path)}): ${page.description}`)
  .join('\n')}

## Writing

${posts.map((post) => `- [${post.data.title}](${md(postUrl(post))}): ${post.data.description}`).join('\n')}

## Topics

${Object.entries(topics)
  .filter(([key]) => posts.some((post) => post.data.tags.includes(key as never)))
  .map(([key, topic]) => `- [${topic.name}](${md(`/blog/${key}/`)}): ${topic.description}`)
  .join('\n')}

## Optional

- [RSS feed](${site.url}/rss.xml): Chronological feed of published articles.
- [Sitemap](${site.url}/sitemap-index.xml): Canonical index of public HTML pages.
- [Privacy](${md('/privacy/')}): Hosting, analytics, and data practices.
`;

  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
