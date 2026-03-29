import type { AppLanguage } from '../types/i18n'
import type { LocalizedField, Project } from '../types/project'

export function getAppLanguage(language: string): AppLanguage {
  return language === 'fr' ? 'fr' : 'en'
}

export function getLocalizedField<T>(
  field: LocalizedField<T>,
  language: string
): T {
  return field[getAppLanguage(language)]
}

export function getProjectContent(project: Project, language: string) {
  return project.content[getAppLanguage(language)]
}

export function getProjectWindowRoute(project: Pick<Project, 'slug' | 'window'>) {
  if (!project.window?.enabled) {
    return null
  }

  const params = new URLSearchParams({ project: project.slug })
  return `/projects?${params.toString()}`
}
