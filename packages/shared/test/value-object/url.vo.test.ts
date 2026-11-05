import { jest } from '@jest/globals';
import { Url } from '../../src';

describe('Url', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('tryCreate', () => {
    test('should create valid url with tryCreate', () => {
      const result = Url.tryCreate('https://example.com/path');

      expect(result.isOk).toBeTruthy();
      expect(result.instance.url).toBe('https://example.com/path');
      expect(result.instance.value).toBe('https://example.com/path');
      expect(result.instance.domain).toBe('example.com');
      expect(result.instance.protocol).toBe('https:');
      expect(result.instance.pathname).toBe('/path');
      expect(result.instance.parameters).toEqual({});
    });

    test('should trim url before creating', () => {
      const result = Url.tryCreate('  https://example.com  ');

      expect(result.isOk).toBeTruthy();
      expect(result.instance.url).toBe('https://example.com');
      expect(result.instance.value).toBe('  https://example.com  ');
      expect(result.instance.domain).toBe('example.com');
      expect(result.instance.protocol).toBe('https:');
      expect(result.instance.pathname).toBe('/');
      expect(result.instance.parameters).toEqual({});
    });

    test('should create url with path', () => {
      const result = Url.tryCreate('https://example.com', { path: '/path' });

      expect(result.isOk).toBeTruthy();
      expect(result.instance.url).toBe('https://example.com/path');
      expect(result.instance.value).toBe('https://example.com');
      expect(result.instance.domain).toBe('example.com');
      expect(result.instance.protocol).toBe('https:');
      expect(result.instance.pathname).toBe('/path');
      expect(result.instance.parameters).toEqual({});
    });

    test('should create url with path and parameters', () => {
      const result = Url.tryCreate('https://example.com', { path: 'path', params: { key: 'value' } });

      expect(result.isOk).toBeTruthy();
      expect(result.instance.url).toBe('https://example.com/path?key=value');
      expect(result.instance.value).toBe('https://example.com');
      expect(result.instance.domain).toBe('example.com');
      expect(result.instance.protocol).toBe('https:');
      expect(result.instance.pathname).toBe('/path');
      expect(result.instance.parameters).toEqual({ key: 'value' });
    });

    test('should create url with path starts with / and parameters', () => {
      const result = Url.tryCreate('https://example.com', { path: '/path', params: { key: 'value' } });

      expect(result.isOk).toBeTruthy();
      expect(result.instance.url).toBe('https://example.com/path?key=value');
      expect(result.instance.value).toBe('https://example.com');
      expect(result.instance.domain).toBe('example.com');
      expect(result.instance.protocol).toBe('https:');
      expect(result.instance.pathname).toBe('/path');
      expect(result.instance.parameters).toEqual({ key: 'value' });
    });

    test('should fail with invalid url', () => {
      const result = Url.tryCreate('invalid-url');

      expect(result.isFailure).toBeTruthy();
      expect(result.errors).toContain('INVALID_URL');
    });

    test('should fail when value is not a string', () => {
      const result = Url.tryCreate(null as unknown as string);

      expect(result.isFailure).toBeTruthy();
      expect(result.errors).toContain('INVALID_URL');
    });
  });

  describe('create', () => {
    test('should create valid url with create', () => {
      const url = Url.create('https://pharmacore.com');

      expect(url.value).toBe('https://pharmacore.com');
      expect(url.domain).toBe('pharmacore.com');
      expect(url.protocol).toBe('https:');
      expect(url.pathname).toBe('/');
      expect(url.parameters).toEqual({});
    });

    test('should throw when create receives invalid url', () => {
      expect(() => Url.create('invalid-url')).toThrow();
    });
  });

  describe('Constructor', () => {
    test('should create valid url with constructor', () => {
      const url = new Url('https://example.com/path');

      expect(url.value).toBe('https://example.com/path');
      expect(url.domain).toBe('example.com');
      expect(url.protocol).toBe('https:');
      expect(url.pathname).toBe('/path');
      expect(url.parameters).toEqual({});
    });

    test('should throw when constructor receives invalid url', () => {
      expect(() => new Url('invalid-url')).toThrow();
    });
  });

});