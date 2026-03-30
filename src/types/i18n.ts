export const supportedLanguages = ['en', 'fr'] as const

export type AppLanguage = (typeof supportedLanguages)[number]
