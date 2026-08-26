const FLAG_ICON_UK = "twemoji:flag-united-kingdom";
const FLAG_ICON_RU = "twemoji:flag-russia";

export type NuxtLocale = "en" | "ru";

export const LocaleToIcon: Record<NuxtLocale, string> = {
  en: FLAG_ICON_UK,
  ru: FLAG_ICON_RU,
} as const;
