import { HttpUrl ,Url } from '../../../src';

describe('Http Url', () => {
  describe('format', () => {

    test('should format url with path and query params', () => {
      const url = 'https://example.com';
      const path = 'api/v1/resource';
      const params = { page: '1', limit: '10' };

      const formattedUrl = HttpUrl.format(url, path, params);

      expect(formattedUrl).toBe('https://example.com/api/v1/resource?page=1&limit=10');
    });

    test('should format url with path starts with / and query params', () => {
      const url = 'https://example.com';
      const path = '/api/v1/resource';
      const params = { page: '1', limit: '10' };

      const formattedUrl = HttpUrl.format(url, path, params);

      expect(formattedUrl).toBe('https://example.com/api/v1/resource?page=1&limit=10');
    });

    test('should format url without query params', () => {
      const url = 'https://example.com';
      const path = 'api/v1/resource';

      const formattedUrl = HttpUrl.format(url, path);

      expect(formattedUrl).toBe('https://example.com/api/v1/resource');
    });

    test('should format url ends with / and without query params', () => {
      const url = 'https://example.com/';
      const path = 'api/v1/resource';

      const formattedUrl = HttpUrl.format(url, path);

      expect(formattedUrl).toBe('https://example.com/api/v1/resource');
    });

    test('should format url with query params with undefined values', () => {
      const url = 'https://example.com';
      const path = 'api/v1/resource';
      const params = { page: '1', limit: undefined };

      const formattedUrl = HttpUrl.format(url, path, params);

      expect(formattedUrl).toBe('https://example.com/api/v1/resource?page=1');
    });
  });

  describe('isValid', () => {
    test('should return true for valid http url', () => {
      const url = 'http://example.com';
      expect(HttpUrl.isValid(url)).toBeTruthy();
    });

    test('should return true for valid https url', () => {
      const url = 'https://example.com';
      expect(HttpUrl.isValid(url)).toBeTruthy();
    });

    test('should return false for invalid url', () => {
      const url = 'invalid-url';
      expect(HttpUrl.isValid(url)).toBeFalsy();
    });

    test('should return false for non-http/https url', () => {
      const url = 'ftp://example.com';
      expect(HttpUrl.isValid(url)).toBeFalsy();
    });
  });

  describe('queryString', () => {
    test('should build query string with filters and pagination', () => {
      const queryString = HttpUrl.queryString({ name: 'john', status: undefined }, 2, 10);
      expect(queryString).toBe('page=2&limit=10&name=john');
    });

    test('should build query string with filters only', () => {
      const queryString = HttpUrl.queryString({ name: 'john', status: undefined });
      expect(queryString).toBe('name=john');
    });
  });

  describe('constructor', () => {
    test('should create valid url with constructor', () => {
      const result = new HttpUrl('http://example.com/path');

      expect(result.url).toBe('http://example.com/path');
      expect(result.value).toBe('http://example.com/path');
      expect(result.domain).toBe('example.com');
      expect(result.protocol).toBe('http:');
      expect(result.pathname).toBe('/path');
      expect(result.parameters).toEqual({});
    });

    test('should create valid url with constructor and config', () => {
      const result = new HttpUrl('https://example.com/', { path: 'path', params: { key: 'value' } });

      expect(result.url).toBe('https://example.com/path?key=value');
      expect(result.value).toBe('https://example.com/');
      expect(result.domain).toBe('example.com');
      expect(result.protocol).toBe('https:');
      expect(result.pathname).toBe('/path');
      expect(result.parameters).toEqual({ key: 'value'});
    });

    test('should throw when constructor receives invalid url', () => {
      expect(() => new HttpUrl('invalid-url')).toThrow();
    });

    test('should throw when constructor receives url is not a string', () => {
      expect(() => new HttpUrl(null as unknown as string)).toThrow();
    });
  });
});