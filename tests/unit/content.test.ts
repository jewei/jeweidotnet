/**
 * Content rules. Runs without a build: `vp test tests/content`.
 * The Astro schema (src/content.config.ts) already rejects bad types and
 * unknown topics; these tests cover rules the schema cannot express.
 */
import fs from 'node:fs';
import path from 'node:path';
import { parse } from 'yaml';
import { describe, expect, test } from 'vite-plus/test';
import { topics } from '../../src/data/topics';
import { pages } from '../../src/data/pages';

const root = path.resolve(__dirname, '../..');
const blogDir = path.join(root, 'src/content/blog');
const projectDir = path.join(root, 'src/content/projects');

const posts = fs
  .readdirSync(blogDir)
  .filter((file) => /\.mdx?$/.test(file))
  .map((file) => {
    const raw = fs.readFileSync(path.join(blogDir, file), 'utf8');
    const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
    return { file, slug: file.replace(/\.mdx?$/, ''), data: parse(match?.[1] ?? ''), body: match?.[2] ?? '' };
  });

describe('blog posts', () => {
  test.each(posts.map((post) => [post.file, post]))('%s: slug is lowercase kebab-case', (_file, post) => {
    expect(post.slug).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
  });

  test.each(posts.map((post) => [post.file, post]))('%s: uses registered topics', (_file, post) => {
    for (const tag of post.data.tags ?? []) expect(Object.keys(topics)).toContain(tag);
  });

  test.each(posts.map((post) => [post.file, post]))(
    '%s: body has no H1 (the layout renders it)',
    (_file, post) => {
      const withoutCode = post.body.replace(/```[\s\S]*?```/g, '');
      expect(withoutCode).not.toMatch(/^# /m);
    },
  );

  test.each(posts.map((post) => [post.file, post]))('%s: local images exist', (_file, post) => {
    const refs = [
      ...Array.from(post.body.matchAll(/!\[[^\]]*\]\((\.{1,2}\/[^)\s]+)/g), (m) => m[1]),
      ...(post.data.image ? [post.data.image] : []),
    ];
    for (const ref of refs) expect(fs.existsSync(path.resolve(blogDir, ref)), ref).toBe(true);
    for (const [, src] of post.body.matchAll(/src="(\/content\/[^"]+)"/g)) {
      expect(fs.existsSync(path.join(root, 'public', src)), src).toBe(true);
    }
  });

  test.each(posts.map((post) => [post.file, post]))('%s: images have alt text', (_file, post) => {
    for (const [, alt] of post.body.matchAll(/!\[([^\]]*)\]\(/g))
      expect(alt.trim().length).toBeGreaterThan(3);
    for (const [tag] of post.body.matchAll(/<img\b[^>]*>/g)) expect(tag).toMatch(/\balt="[^"]{4,}"/);
  });

  test('slugs do not collide with fixed pages', () => {
    const reserved = new Set([
      'blog',
      'projects',
      'about',
      'resume',
      'collections',
      'contact',
      'privacy',
      'og',
      '404',
    ]);
    for (const post of posts) expect(reserved.has(post.slug), post.slug).toBe(false);
  });
});

describe('projects', () => {
  const files = fs.readdirSync(projectDir).filter((file) => file.endsWith('.yaml'));
  const projects = files.map((file) => ({
    file,
    data: parse(fs.readFileSync(path.join(projectDir, file), 'utf8')),
  }));

  test('order values are unique', () => {
    const orders = projects.map((project) => project.data.order);
    expect(new Set(orders).size).toBe(orders.length);
  });

  test.each(projects.map((p) => [p.file, p]))('%s: story post exists', (_file, project) => {
    const slug = project.data.story.replace(/^\/|\/$/g, '');
    expect(posts.some((post) => post.slug === slug)).toBe(true);
  });
});

describe('metadata', () => {
  test.each(Object.entries(pages))('%s: description is 70–160 characters', (_key, page) => {
    expect(page.description.length).toBeGreaterThanOrEqual(70);
    expect(page.description.length).toBeLessThanOrEqual(160);
  });

  test.each(Object.entries(topics))('topic %s: description is 70–160 characters', (_key, topic) => {
    expect(topic.description.length).toBeGreaterThanOrEqual(70);
    expect(topic.description.length).toBeLessThanOrEqual(160);
  });
});
