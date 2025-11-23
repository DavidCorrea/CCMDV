export const languages = {
  es: {
    code: 'es',
    name: 'Español',
    flag: '🇪🇸',
  },
  // Easy to add more languages:
  // en: {
  //   code: 'en',
  //   name: 'English',
  //   flag: '🇺🇸',
  // },
} as const;

export type LanguageCode = keyof typeof languages;
export const defaultLang: LanguageCode = 'es';
export const supportedLanguages = Object.keys(languages) as LanguageCode[];

