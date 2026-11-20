import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    short: z.string(), // short card title
    summary: z.string(),
    context: z.string(), // e.g. "TDK research · Hungarian University of Sport Science"
    year: z.string(),
    order: z.number(),
    featured: z.boolean().default(false),
    area: z.enum(['Sport science', 'AEC & data', 'Computer vision', 'MLOps', 'Deep learning']),
    illustration: z.enum(['hammer', 'carbon', 'graph', 'football', 'vo2', 'mlops', 'animals']),
    tags: z.array(z.string()),
    repo: z.string().url().optional(),
    article: z.string().url().optional(),
    codeNote: z.string().optional(), // shown when there's no public repo
    metrics: z
      .array(z.object({ value: z.string(), label: z.string() }))
      .default([]),
    role: z.string().optional(),
    hasPage: z.boolean().default(true),
    partners: z
      .array(z.object({ name: z.string(), role: z.string(), logo: z.string().optional() }))
      .default([]),
  }),
});

export const collections = { projects };
