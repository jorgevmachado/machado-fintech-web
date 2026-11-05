import {
  FALLBACK_LOCALE ,
  isSupportedLocale ,
  LOCALE_OPTIONS ,
  LOCALE_STORAGE_KEY ,
  normalizeLocale ,
  resolvePreferredLocale ,
  SUPPORTED_LOCALES ,
} from '../../src';

describe('i18n config' ,() => {
  it('exposes supported locales' ,() => {
    expect(SUPPORTED_LOCALES).toEqual(['en-US' ,'pt-BR' ,'es-UE']);
  });

  it('exposes fallback locales' ,() => {
    expect(FALLBACK_LOCALE).toBe('en-US');
  });

  it('exposes locale storage key' ,() => {
    expect(LOCALE_STORAGE_KEY).toBe('machado-web:locale');
  });

  it('exposes locale option' ,() => {
    expect(LOCALE_OPTIONS.map((option) => option.value)).
    toEqual(['pt-BR' ,'en-US' ,'es-UE']);
  });

  it('detects whether a locale is supported' ,() => {
    expect(isSupportedLocale('en-US')).toBeTruthy();
    expect(isSupportedLocale('pt-BR')).toBeTruthy();
    expect(isSupportedLocale('fr')).toBeFalsy();
  });

  it('normalizes exact aliases and base locales' ,() => {
    expect(normalizeLocale(' en-US ')).toBe('en-US');
    expect(normalizeLocale('EN-gb')).toBe('en-US');
    expect(normalizeLocale('pt')).toBe('pt-BR');
    expect(normalizeLocale('es-MX')).toBe('es-UE');
  });

  it('returns undefined for empty and unsupported locales' ,() => {
    expect(normalizeLocale(undefined)).toBeUndefined();
    expect(normalizeLocale(null)).toBeUndefined();
    expect(normalizeLocale('   ')).toBeUndefined();
    expect(normalizeLocale('fr-FR')).toBeUndefined();
  });

  it('resolves preferred locale from persisted value, browser value, or fallback' ,() => {
      expect(resolvePreferredLocale('pt-BR' ,'en-US')).toBe('pt-BR');
      expect(resolvePreferredLocale('unknown' ,'es-ES')).toBe('es-UE');
      expect(resolvePreferredLocale(undefined ,'fr-FR')).toBe('en-US');
    });

  it('rejects locale values without a language before the separator', () => {
    expect(normalizeLocale('-BR')).toBeUndefined();
    expect(resolvePreferredLocale('-BR', 'pt-BR')).toBe('pt-BR');
  });
});