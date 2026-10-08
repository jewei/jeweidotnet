import { getCollection, type CollectionEntry } from 'astro:content';
import { absolute } from './seo';
import { personId } from '../site.config';
import { getPosts, postUrl } from './posts';

export type Project = CollectionEntry<'projects'> & {
  storyUrl: string | undefined;
  primaryUrl: string;
};

/** Projects in display order (the `order` field). */
export async function getProjects(): Promise<Project[]> {
  const [projects, posts] = await Promise.all([getCollection('projects'), getPosts()]);
  const stories = new Set(posts.map(postUrl));
  return projects
    .sort((a, b) => a.data.order - b.data.order)
    .map((project) => {
      const storyUrl = stories.has(project.data.story) ? project.data.story : undefined;
      const source = project.data.links.find((link) => link.label === 'Source')?.href;
      return { ...project, storyUrl, primaryUrl: storyUrl ?? source ?? `/projects/#${project.id}` };
    });
}

/** schema.org node for one project. */
export function projectSchema(project: Project): Record<string, unknown> {
  const p = project.data;
  const source = p.links.find((link) => link.label === 'Source')?.href;
  const base = {
    '@type': p.schemaType,
    name: p.name,
    description: p.summary,
    url: source ?? absolute(project.primaryUrl),
    mainEntityOfPage: absolute(project.storyUrl ?? `/projects/#${project.id}`),
    image: absolute(p.image.src),
    author: { '@id': personId },
  };
  return p.schemaType === 'SoftwareApplication'
    ? { ...base, applicationCategory: 'UtilitiesApplication', operatingSystem: p.platform, sameAs: source }
    : { ...base, codeRepository: source, programmingLanguage: p.language };
}
