import { jest } from '@jest/globals';
import { FileVO } from '../../src';

describe('FileVO', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('tryCreate', () => {
    test('should try create file invalid type', () => {
      const file = new File(['content'], 'test.txt', { type: 'text/plain' });
      const result = FileVO.tryCreate(file);
      expect(result.isFailure).toBeTruthy();
      expect(result.errors).toContain('file.validation.invalid_type');
    });

    test('should try create file too large', () => {
      const file = new File(['a'.repeat(11 * 1024 * 1024)], 'test.pdf', { type: 'application/pdf' });
      const result = FileVO.tryCreate(file);
      expect(result.isFailure).toBeTruthy();
      expect(result.errors).toContain('file.validation.too_large, {{ max: 10.00 }}');
    });

    test('should try create file valid', () => {
      const file = new File(['a'.repeat(1024 * 1024)], 'test.pdf', { type: 'application/pdf' });
      const result = FileVO.tryCreate(file);
      expect(result.isOk).toBeTruthy();
    });
  });

  describe('create', () => {
    test('should create file valid', () => {
      const file = new File(['a'.repeat(1024 * 1024)], 'test.pdf', { type: 'application/pdf' });
      const fileVO = FileVO.create(file);
      expect(fileVO).toBeInstanceOf(FileVO);
      expect(fileVO.value).toBe(file);
      expect(fileVO.fileKey).toBe(`${file.name}-${file.size}-${file.lastModified}`);
    });
  });

  describe('getFileKey', () => {});

  describe('isAcceptedFileType', () => {});
});