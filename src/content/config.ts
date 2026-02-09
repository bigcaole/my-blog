import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    description: z.string().default(''),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
    featured: z.boolean().default(false),
  }),
});

const settings = defineCollection({
  type: 'data',
  schema: z.object({
    siteName: z.string().optional().default(''),
    slogan: z.string().optional().default(''),
    description: z.string().optional().default(''),
    nav: z
      .array(
        z.object({
          label: z.string(),
          href: z.string(),
        }),
      )
      .optional()
      .default([]),
    social: z
      .object({
        github: z.string().optional(),
        telegram: z.string().optional(),
        x: z.string().optional(),
        email: z.string().optional(),
      })
      .optional()
      .default({}),
    tools: z
      .array(
        z.object({
          title: z.string(),
          slug: z.string(),
          description: z.string().optional().default(''),
          status: z.enum(['live', 'coming-soon']).optional().default('live'),
          iconKey: z.string().optional().default(''),
        }),
      )
      .optional()
      .default([]),
    seo: z
      .object({
        twitterHandle: z.string().optional().default(''),
        ogImage: z.string().optional().default(''),
      })
      .optional()
      .default({}),
  }),
});

export const collections = { blog, settings };

