import type { TFunction } from 'i18next';

export const TRANSLATION_KEY_PATTERN = /^[a-zA-Z0-9]+(?:\.[a-zA-Z0-9_-]+)+$/;

export const TRANSLATION_WITH_PARAMS_PATTERN =
  /^['"][a-zA-Z0-9]+(?:\.[a-zA-Z0-9_-]+)+['"],\s*\{.*\}$/;

export const TRANSLATION_WITH_UNQUOTED_PARAMS_PATTERN =
  /^[a-zA-Z0-9]+(?:\.[a-zA-Z0-9_-]+)+,\s*\{[\s\S]*\}$/;

type DynamicTFunction = (
  key: string,
  options?: Parameters<TFunction>[1],
) => string;

const I18N_MESSAGE_PREFIX = 'i18n:';

export function createI18nMessage(key: string): string {
  return `${I18N_MESSAGE_PREFIX}${key}`;
}

export function translateI18nMessage(t: DynamicTFunction, message?: string): string | undefined {
  if (!message) {
    return message;
  }

  if (!message.startsWith(I18N_MESSAGE_PREFIX)) {
    return message;
  }

  return t(message.slice(I18N_MESSAGE_PREFIX.length));
}

type ParsedTranslation = {
  key: string;
  params?: Record<string, unknown>;
};

export function parseTranslationMessage(value: string): ParsedTranslation | null {
  const match = value.match(
    /^['"]([^'"]+)['"]\s*(?:,\s*(\{[\s\S]*\}))?$/,
  );

  if (!match) {
    return null;
  }

  const key = match[1];
  const params = match[2];

  if (!key) {
    return null;
  }

  if (!params) {
    return { key };
  }

  try {
    return {
      key,
      params: JSON.parse(
        params.replace(
          /([{,]\s*)(\w+)\s*:/g,
          '$1"$2":',
        ),
      ),
    };
  } catch {
    return null;
  }
}

export function isTranslationValue(value: unknown): value is string {
  if(typeof value !== 'string') {
    return false;
  }
  return TRANSLATION_KEY_PATTERN.test(value) || TRANSLATION_WITH_PARAMS_PATTERN.test(value);
}

export function isTranslationWithUnquotedParams(value: unknown): value is string {
  return typeof value === 'string' && TRANSLATION_WITH_UNQUOTED_PARAMS_PATTERN.test(value);
}