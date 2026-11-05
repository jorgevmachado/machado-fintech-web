import { resolveFinanceApiBaseUrl } from '../config-utils';

describe('resolveFinanceApiBaseUrl', () => {
  it.each([undefined, '', '   '])(
    'uses the local default for missing development configuration: %s',
    (API_BASE_URL) => {
      expect(resolveFinanceApiBaseUrl({ API_BASE_URL, NODE_ENV: 'development' }))
        .toBe('http://127.0.0.1:8000');
    },
  );

  it('uses the local default when NODE_ENV is not production', () => {
    expect(resolveFinanceApiBaseUrl({})).toBe('http://127.0.0.1:8000');
  });

  it.each([undefined, '', '   '])(
    'requires API_BASE_URL in production: %s',
    (API_BASE_URL) => {
      expect(() => resolveFinanceApiBaseUrl({ API_BASE_URL, NODE_ENV: 'production' }))
        .toThrow('API_BASE_URL must be configured in production.');
    },
  );

  it.each([
    'http://localhost:8000',
    'https://api.example.com/v1',
  ])('accepts absolute HTTP(S) backend URLs: %s', (API_BASE_URL) => {
    expect(resolveFinanceApiBaseUrl({ API_BASE_URL, NODE_ENV: 'production' }))
      .toBe(API_BASE_URL);
  });

  it.each([
    'not-a-url',
    '/api',
    'ftp://api.example.com',
    'file:///tmp/api',
  ])('rejects invalid or unsupported URLs: %s', (API_BASE_URL) => {
    expect(() => resolveFinanceApiBaseUrl({ API_BASE_URL, NODE_ENV: 'development' }))
      .toThrow('API_BASE_URL must be a valid absolute HTTP or HTTPS URL.');
  });
});
