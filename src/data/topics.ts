/**
 * Topic registry. Every post tag must be a key here; the content schema
 * rejects unknown tags at build time.
 *
 * - `name` is the display name (and the topic page <h1>).
 * - `description` is the topic page meta description and intro. Keep it
 *   specific: 70–160 characters.
 *
 * To add a topic: add an entry here, then use its key in post frontmatter.
 */
export const topics = {
  ai: {
    name: 'AI',
    description:
      'Notes on AI-assisted software engineering: coding agents, Claude Code, adoption levels, and honest reviews of how the tools change daily work.',
  },
  'browser-extensions': {
    name: 'Browser extensions',
    description:
      'Small browser extensions built to remove friction, with notes on Manifest V3, local-first design, and permissions.',
  },
  cloudflare: {
    name: 'Cloudflare',
    description:
      'Building on Cloudflare Workers, D1, and Pages: edge infrastructure, self-hosted tools, and deployment notes.',
  },
  database: {
    name: 'Databases',
    description:
      'Database design decisions from production work, including primary keys, identifiers, and the trade-offs behind them.',
  },
  design: {
    name: 'Design',
    description:
      'How this site is designed and why: typography, layout, and the small details that make reading pleasant.',
  },
  entrepreneurship: {
    name: 'Entrepreneurship',
    description:
      'Thinking about software as a business: the spectrum of makers, from no-code builders to systems programmers.',
  },
  infrastructure: {
    name: 'Infrastructure',
    description:
      'Scaling, hosting, and running systems in production, from the first server to millions of users.',
  },
  macos: {
    name: 'macOS',
    description:
      'Native macOS utilities built in Swift: menu bar apps, launchers, and the lessons learned shipping them.',
  },
  'open-source': {
    name: 'Open source',
    description:
      'Open-source projects by Jewei Mak: PHP libraries, Laravel tooling, macOS apps, and edge infrastructure, with the story behind each one.',
  },
  php: {
    name: 'PHP',
    description:
      'Modern PHP and Laravel in practice: why the language still matters and how to use it well in production.',
  },
  swift: {
    name: 'Swift',
    description: 'Swift and AppKit development notes from building small, fast, local-first macOS apps.',
  },
  'system-design': {
    name: 'System design',
    description:
      'System design for working engineers: scaling to millions of users, choosing identifiers, and architecture trade-offs.',
  },
} as const satisfies Record<string, { name: string; description: string }>;

export type TopicKey = keyof typeof topics;

/** True when the registry has this key. Object.keys() is typed string[]; this proves more. */
export const isTopicKey = (key: string): key is TopicKey => Object.hasOwn(topics, key);

/** Every topic key, in registry order. */
export const topicKeys = Object.keys(topics).filter(isTopicKey);

export function topicName(key: TopicKey): string {
  return topics[key].name;
}

export function topicUrl(key: TopicKey): string {
  return `/blog/${key}/`;
}
