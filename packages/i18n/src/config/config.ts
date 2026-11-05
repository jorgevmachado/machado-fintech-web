export const SUPPORTED_LOCALES = ['en-US', 'pt-BR', 'es-UE'] as const;
export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];

export const FALLBACK_LOCALE: SupportedLocale = 'en-US';

export const LOCALE_STORAGE_KEY = 'machado-web:locale';

export const LOCALE_OPTIONS = [
  { value: 'pt-BR', flag: '🇧🇷', shortLabel: 'PT', labelKey: 'language.ptBR' },
  { value: 'en-US', flag: '🇺🇸', shortLabel: 'EN', labelKey: 'language.enUS' },
  { value: 'es-UE', flag: '🇪🇸', shortLabel: 'ES', labelKey: 'language.esUE' },
] as const satisfies ReadonlyArray<{
  value: SupportedLocale;
  flag: string;
  shortLabel: string;
  labelKey: string;
}>;

const localeAliases: Record<string, SupportedLocale> = {
  en: 'en-US',
  'en-us': 'en-US',
  'en-gb': 'en-US',
  pt: 'pt-BR',
  'pt-br': 'pt-BR',
  es: 'es-UE',
  'es-es': 'es-UE',
};

export function normalizeLocale(input?: string | null): SupportedLocale | undefined {
  if (!input) {
    return undefined;
  }

  const normalized = input.trim().toLowerCase();

  if (!normalized) {
    return undefined;
  }

  const aliasMatch = localeAliases[normalized];

  if (aliasMatch) {
    return aliasMatch;
  }

  const [baseLocale] = normalized.split('-');

  if(!baseLocale) {
    return undefined;
  }

  return localeAliases[baseLocale];
}

export function isSupportedLocale(value: string): value is SupportedLocale {
  return SUPPORTED_LOCALES.includes(value as SupportedLocale);
}

export function resolvePreferredLocale(
  storage?: string | null,
  browser?: string | null,
) : SupportedLocale {
  return (
    normalizeLocale(storage) ??
    normalizeLocale(browser) ??
    FALLBACK_LOCALE
  );
}