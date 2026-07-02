const FLAG_ICON_US = 'twemoji:flag-united-states'
const FLAG_ICON_RU = 'twemoji:flag-russia'

export type NuxtLocale = 'en' | 'ru'

export const LocaleToIcon: Record<NuxtLocale, string> = {
  en: FLAG_ICON_US,
  ru: FLAG_ICON_RU,
} as const
