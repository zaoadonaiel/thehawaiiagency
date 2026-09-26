import { defineCollection, reference } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const section = z.object({
  kicker: z.string().optional(),
  heading: z.string(),
  paragraphs: z.array(z.string()),
  tags: z.array(z.string()).optional(),
});

const services = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/services' }),
  schema: ({ image }) =>
    z.object({
      order: z.number(),
      name: z.string(),
      short: z.string(),
      seoTitle: z.string(),
      seoDescription: z.string(),
      heroTitle: z.string(),
      heroTagline: z.string(),
      summary: z.string(),
      image: image(),
      intro: z.object({ heading: z.string(), paragraphs: z.array(z.string()) }),
      sections: z.array(section),
      benefits: z.array(z.object({ title: z.string(), text: z.string() })).optional(),
      steps: z.array(z.string()).optional(),
      listTitle: z.string().optional(),
      list: z.array(z.string()).optional(),
      module: z.enum(['hosting', 'social']).optional(),
      cta: z.object({ heading: z.string(), paragraphs: z.array(z.string()) }),
      faq: z.string().nullable(),
      related: z.array(reference('projects')),
    }),
});

const projects = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/projects' }),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      domain: z.string(),
      url: z.url(),
      location: z.string(),
      image: image(),
      imageAlt: z.string(),
      services: z.array(z.string()),
      body: z.array(z.string()),
      highlights: z.array(z.object({ title: z.string(), text: z.string() })).optional(),
      stack: z.array(z.string()).optional(),
      gallery: z.array(z.object({ src: image(), alt: z.string() })).optional(),
      result: z.string().nullable(),
      metric: z.object({ value: z.string(), label: z.string() }).nullable(),
      note: z.string().optional(),
      order: z.number(),
      featured: z.boolean(),
      hawaii: z.boolean(),
    }),
});

const blog = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/blog' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      pubDate: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),
      category: z.string(),
      tags: z.array(z.string()).default([]),
      cover: image(),
      coverAlt: z.string(),
    }),
});

export const collections = { services, projects, blog };
