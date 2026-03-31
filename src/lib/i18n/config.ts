export const locales = ["en", "ta"] as const;

export type AppLocale = (typeof locales)[number];

export const defaultLocale: AppLocale = "en";

export function isSupportedLocale(value: string): value is AppLocale {
  return locales.includes(value as AppLocale);
}
