import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import TurndownService from 'turndown';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

const EXPORT_FILE = join(root, 'jewei-tostring.ghost.2026-05-31-05-06-33.json');
const OUT_DIR = join(root, 'src/content/blog');

const td = new TurndownService({ headingStyle: 'atx', codeBlockStyle: 'fenced' });

function slug(str) {
  return str.replace(/[^\w\s-]/g, '').trim().replace(/[\s_]+/g, '-').toLowerCase();
}

function escapeYaml(str) {
  if (!str) return '';
  return str.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
}

const raw = JSON.parse(readFileSync(EXPORT_FILE, 'utf8'));
const { posts, tags, posts_tags } = raw.db[0].data;

const tagById = Object.fromEntries(tags.map(t => [t.id, t.name]));
const tagsByPost = {};
for (const pt of posts_tags) {
  if (!tagsByPost[pt.post_id]) tagsByPost[pt.post_id] = [];
  tagsByPost[pt.post_id].push(tagById[pt.tag_id]);
}

mkdirSync(OUT_DIR, { recursive: true });

let written = 0;
let skipped = 0;

for (const post of posts) {
  if (post.status !== 'published' || post.type !== 'post') {
    skipped++;
    continue;
  }

  const postTags = (tagsByPost[post.id] ?? []).filter(Boolean);
  const description = post.custom_excerpt ?? '';
  const html = (post.html ?? '').replace(/__GHOST_URL__/g, 'https://jewei.net');
  const markdown = html ? td.turndown(html) : '';

  const frontmatter = [
    '---',
    `title: "${escapeYaml(post.title)}"`,
    description ? `description: "${escapeYaml(description)}"` : null,
    `pubDate: "${post.published_at}"`,
    post.updated_at && post.updated_at !== post.published_at
      ? `updatedDate: "${post.updated_at}"`
      : null,
    postTags.length
      ? `tags: [${postTags.map(t => `"${escapeYaml(t)}"`).join(', ')}]`
      : 'tags: []',
    '---',
  ].filter(line => line !== null).join('\n');

  const content = `${frontmatter}\n\n${markdown}\n`;
  const filename = `${post.slug}.md`;

  writeFileSync(join(OUT_DIR, filename), content, 'utf8');
  written++;
  console.log(`  ✓ ${filename}`);
}

console.log(`\nDone: ${written} posts written, ${skipped} skipped.`);
