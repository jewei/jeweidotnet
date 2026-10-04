import { getCollection, type CollectionEntry } from 'astro:content';
import { absolute } from './seo';
import { personId } from '../site.config';

export type Project = CollectionEntry<'projects'>;

/** Projects in display order (the `order` field). */
export async function getProjects(): Promise<Project[]> {
  return (await getCollection('projects')).sort((a, b) => a.data.order - b.data.order);
}

/** schema.org node for one project. */
export function projectSchema(project: Project): Record<string, unknown> {
  const p = project.data;
  const source = p.links.find((link) => link.label === 'Source')?.href;
  const base = {
    '@type': p.schemaType,
    name: p.name,
    description: p.summary,
    url: source ?? absolute(p.story),
    mainEntityOfPage: absolute(p.story),
    image: absolute(p.image.src),
    author: { '@id': personId },
  };
  return p.schemaType === 'SoftwareApplication'
    ? { ...base, applicationCategory: 'UtilitiesApplication', operatingSystem: p.platform, sameAs: source }
    : { ...base, codeRepository: source, programmingLanguage: p.language };
}
