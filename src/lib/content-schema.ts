import { z } from 'zod'

const languageFieldSchema = z.object({
  en: z.string().min(1),
  fr: z.string().min(1),
})

const projectContentSchema = z.object({
  title: z.string().min(1),
  summary: z.string().min(1).max(280),
  description: z.string().min(1),
})

export const projectSchema = z.object({
  id: z.string().regex(/^PJ\d{3}$/),
  slug: z.string().regex(/^[a-z0-9-]+$/),
  status: z.enum(['completed', 'in-progress', 'archived']),
  date: z.string().date(),
  featured: z.boolean(),
  technicalLevel: z.union([z.literal(1), z.literal(2), z.literal(3)]),
  cover: z.object({
    src: z.string().min(1),
    alt: languageFieldSchema,
  }),
  links: z.object({
    primary: z.string().url().nullable(),
    readMore: z.string().url().nullable(),
    github: z.string().url().nullable(),
    live: z.string().url().nullable(),
  }),
  taxonomy: z.object({
    domains: z.array(z.string().min(1)).min(1),
    tools: z.array(z.string().min(1)).min(1),
    keywords: z.object({
      en: z.array(z.string().min(1)).min(1),
      fr: z.array(z.string().min(1)).min(1),
    }),
  }),
  content: z.object({
    en: projectContentSchema,
    fr: projectContentSchema,
  }),
})

export const projectsSchema = z
  .array(projectSchema)
  .superRefine((projects, context) => {
    const featuredProjects = projects.filter((project) => project.featured)

    if (featuredProjects.length > 1) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Only one project can have featured=true.',
      })
    }

    const ids = new Set<string>()
    const slugs = new Set<string>()

    for (const project of projects) {
      if (ids.has(project.id)) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Duplicate project id: ${project.id}`,
        })
      }

      if (slugs.has(project.slug)) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Duplicate project slug: ${project.slug}`,
        })
      }

      ids.add(project.id)
      slugs.add(project.slug)
    }
  })

const skillItemSchema = z.object({
  id: z.string().regex(/^SK\d{3}$/),
  slug: z.string().regex(/^[a-z0-9-]+$/),
  icon: z.object({
    src: z.string().min(1).nullable(),
    key: z.enum(['openai', 'copilot']).optional().nullable(),
    alt: languageFieldSchema,
  }),
  content: z.object({
    label: languageFieldSchema,
    description: languageFieldSchema,
  }),
  tags: z.array(z.string().min(1)).min(1),
})

export const skillsSchema = z.object({
  categories: z.array(
    z.object({
      id: z.string().regex(/^[a-z0-9-]+$/),
      label: languageFieldSchema,
      description: languageFieldSchema,
      items: z.array(skillItemSchema).min(1),
    })
  ),
})
