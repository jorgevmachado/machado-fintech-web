import enUS from '../locales/en-US.json';
import esUE from '../locales/es-UE.json';
import ptBR from '../locales/pt-BR.json';

import { i18n } from '../instance';


import type {
  SupportedLocale,
} from '../config';

type Resource = Record<string, unknown>;

export type TLocalesFiles = Partial<Record<SupportedLocale, Resource>>;

export const resources: Record<
  SupportedLocale,
  Resource
> = {
  'en-US': {
    ...enUS,
  },
  'pt-BR': {
    ...ptBR,
  },
  'es-UE': {
    ...esUE,
  },
};

type LocaleMessages = Record<string, unknown>;

export function registerLocales(
  locale: SupportedLocale,
  namespace: string,
  messages: LocaleMessages
) {
  resources[locale][namespace] = messages;

  i18n.addResourceBundle(
    locale,
    namespace,
    messages,
    true,
    true
  )
}

export function registerLocalesFiles(locales: TLocalesFiles) {
  Object.entries(locales).forEach(([locale, namespaces]) => {
    if (!namespaces) {
      return;
    }

    Object.entries(namespaces).forEach(([namespace, values]) => {
      registerLocales(
        locale as SupportedLocale,
        namespace,
        values as LocaleMessages
      );
    });
  });
}

export function initializeResources() {
  Object.entries(resources).forEach(([locale, messages]) => {
    i18n.addResourceBundle(
      locale,
      'translation',
      messages,
      true,
      true,
    );

  });
}

function typedEntries<T extends object>(
  object: T,
): Array<[keyof T, T[keyof T]]> {
  return Object.entries(object) as Array<[keyof T, T[keyof T]]>;
}

function deepMerge(
  target: Record<string, unknown>,
  source: Record<string, unknown>,
): Record<string, unknown> {

  Object.entries(source).forEach(([key, value]) => {

    if (
      value !== null &&
      typeof value === 'object' &&
      !Array.isArray(value)
    ) {
      target[key] = deepMerge(
        (target[key] as Record<string, unknown>) ?? {},
        value as Record<string, unknown>,
      );

      return;
    }

    target[key] = value;
  });

  return target;
}


export function mergeLocaleFiles(
  localeFiles: Array<TLocalesFiles>,
): TLocalesFiles {

  return localeFiles.reduce<TLocalesFiles>((merged, current) => {
    typedEntries(current).forEach(([locale, namespaces]) => {
      if(!namespaces) {
        return;
      }
      merged[locale] ??= {};

      typedEntries(namespaces).forEach(([namespace, messages]) => {
        merged[locale]![namespace] = deepMerge(
          (merged[locale]![namespace] ?? {}) as Record<string, unknown>,
          messages as Record<string, unknown>,
        ) as LocaleMessages;
      });
    });
    return merged;

  }, {});
}