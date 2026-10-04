import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { topicKeys } from './data/topics';

const topic = z.enum(topicKeys);

/**
 * Blog posts. One Markdown file per post in `src/content/blog/`.
 * The filename is the URL: `my-post.md` → `/my-post/`.
 * See docs/CONTENT.md for the full guide.
 */
const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: ({ image }) =>
    z
      .object({
        // 70 is the longest <title> the SEO test allows (documentTitle drops the suffix).
        title: z.string().min(3).max(70),
        description: z.string().min(40).max(200),
        pubDate: z.coerce.date(),
        updatedDate: z.coerce.date().optional(),
        // A non-empty tuple, not an array with min(1): the type then proves
        // that tags[0] (the primary topic) exists.
        tags: z.tuple([topic], topic),
        draft: z.boolean().default(false),
        image: image().optional(),
        imageAlt: z.string().min(10).optional(),
      })
      .refine((post) => !post.image || post.imageAlt, {
        message: '`imageAlt` is required when `image` is set.',
        path: ['imageAlt'],
      })
      .refine((post) => !post.updatedDate || post.updatedDate >= post.pubDate, {
        message: '`updatedDate` must be on or after `pubDate`.',
        path: ['updatedDate'],
      }),
});

/**
 * Projects. One YAML file per project in `src/content/projects/`.
 * The filename is the anchor on /projects/ (for example `/projects/#uppa`).
 */
const projects = defineCollection({
  loader: glob({ pattern: '*.yaml', base: './src/content/projects' }),
  schema: ({ image }) =>
    z.object({
      order: z.number().int().positive(),
      name: z.string(),
      category: z.string(),
      summary: z.string().min(40).max(160),
      image: image(),
      imageAlt: z.string().min(10),
      stack: z.array(z.string()).min(1),
      status: z.string(),
      /** Root-relative URL of the post that tells the project's story. */
      story: z.string().regex(/^\/[a-z0-9-]+\/$/),
      links: z.array(z.object({ label: z.string(), href: z.url() })).min(1),
      schemaType: z.enum(['SoftwareApplication', 'SoftwareSourceCode']),
      language: z.array(z.string()).min(1),
      platform: z.string().optional(),
      featured: z.boolean().default(true),
    }),
});

export const collections = { blog, projects };
